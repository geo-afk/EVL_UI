import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { GitBranch, Maximize2, RefreshCw } from "lucide-react";
import {
  CharStream,
  CommonTokenStream,
  TerminalNode,
  ParserRuleContext,
} from "antlr4ng";
import type { ParseTree } from "antlr4ng";
import * as d3 from "d3";
import { EVALLexer } from "../../eval/generated/EVALLexer";
import { EVALParser } from "../../eval/generated/EVALParser";

// ─────────────────────────────────────────────────────────────────────────────
// Tree data model
// ─────────────────────────────────────────────────────────────────────────────

type NodeKind = "rule" | "terminal" | "eof";

interface RawNode {
  id: string;
  label: string; // rule name or token-type name
  detail?: string; // token literal text (terminals only)
  kind: NodeKind;
  children: RawNode[];
}

interface ParseResult {
  root: RawNode | null;
  errorMsg: string | null;
  nodeCount: number;
  depthMax: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// ANTLR → RawNode converter
// ─────────────────────────────────────────────────────────────────────────────

function buildRawTree(code: string): ParseResult {
  if (!code.trim())
    return { root: null, errorMsg: null, nodeCount: 0, depthMax: 0 };

  let counter = 0;

  try {
    const input = CharStream.fromString(code);
    const lexer = new EVALLexer(input);
    lexer.removeErrorListeners();
    const tokens = new CommonTokenStream(lexer);
    const parser = new EVALParser(tokens);
    parser.removeErrorListeners();
    const cst = parser.program();

    function convert(pt: ParseTree): RawNode {
      const id = String(counter++);

      if (pt instanceof TerminalNode) {
        const sym = pt.symbol;
        const isEof = sym.type === -1;
        const name = isEof
          ? "EOF"
          : (parser.vocabulary.getSymbolicName(sym.type) ??
            `TOKEN_${sym.type}`);
        return {
          id,
          label: name,
          detail: isEof ? undefined : (sym.text ?? ""),
          kind: isEof ? "eof" : "terminal",
          children: [],
        };
      }

      if (pt instanceof ParserRuleContext) {
        let ruleName = "rule";
        try {
          const ruleIdx = pt.ruleIndex;
          if (typeof ruleIdx === "number" && parser.ruleNames[ruleIdx]) {
            ruleName = parser.ruleNames[ruleIdx];
          }
        } catch {
          /* use default */
        }

        // FIX: use array filter+map instead of manual for-loop with push
        const children: RawNode[] = pt.children
          ? pt.children.filter(Boolean).map(convert)
          : [];

        return { id, label: ruleName, kind: "rule", children };
      }

      // Fallback unknown node — reuse same counter slot
      return { id, label: "?", kind: "rule", children: [] };
    }

    const root = convert(cst);

    let nodeCount = 0;
    let depthMax = 0;
    function walk(n: RawNode, depth: number) {
      nodeCount++;
      if (depth > depthMax) depthMax = depth;
      n.children.forEach((c) => walk(c, depth + 1));
    }
    walk(root, 0);

    return { root, errorMsg: null, nodeCount, depthMax };
  } catch (e) {
    return {
      root: null,
      errorMsg: e instanceof Error ? e.message : String(e),
      nodeCount: 0,
      depthMax: 0,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout constants
// ─────────────────────────────────────────────────────────────────────────────

const NODE_ROW_GAP = 70;
const NODE_COL_GAP = 320;
const NODE_PADDING_X = 20;
const NODE_PADDING_Y = 12;
const NODE_RX = 6;
const FONT_STACK = "'JetBrains Mono', 'Courier New', monospace";
const FONT_SIZE_MAIN = 17;
const FONT_SIZE_DETAIL = 9;

// ─────────────────────────────────────────────────────────────────────────────
// Module-level singleton canvas context for text measurement
// Keeps it outside React to avoid repeated canvas creation.
// ─────────────────────────────────────────────────────────────────────────────

let _measureCtx: CanvasRenderingContext2D | null = null;

function getMeasureCtx(): CanvasRenderingContext2D | null {
  if (_measureCtx) return _measureCtx;
  _measureCtx = document.createElement("canvas").getContext("2d");
  return _measureCtx;
}

function measureTextWidth(
  text: string,
  fontSize: number,
  fontWeight: string,
): number {
  const ctx = getMeasureCtx();
  if (!ctx) return text.length * 10; // safe fallback
  ctx.font = `${fontWeight} ${fontSize}px ${FONT_STACK}`;
  return ctx.measureText(text).width;
}

// ─────────────────────────────────────────────────────────────────────────────
// Node dimension calculation — pure function, no redundant calls
// ─────────────────────────────────────────────────────────────────────────────

function getNodeDims(node: RawNode): { width: number; height: number } {
  const fw = node.kind === "rule" ? "600" : "400";
  const mainW = measureTextWidth(node.label, FONT_SIZE_MAIN, fw);
  const mainH = FONT_SIZE_MAIN * 1.2;

  let maxW = mainW;
  let totalH = NODE_PADDING_Y * 2 + mainH;

  if (node.detail) {
    const dW = measureTextWidth(`"${node.detail}"`, FONT_SIZE_DETAIL, "normal");
    maxW = Math.max(maxW, dW);
    totalH += FONT_SIZE_DETAIL * 1.2 + 2; // 2px gap between lines
  }

  return {
    width: Math.max(maxW + NODE_PADDING_X * 2, 80),
    height: totalH,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Horizontal cubic-bezier link path
// ─────────────────────────────────────────────────────────────────────────────

function hLink(sx: number, sy: number, tx: number, ty: number): string {
  const mx = (sx + tx) / 2;
  return `M${sx},${sy} C${mx},${sy} ${mx},${ty} ${tx},${ty}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Node color helpers — pure functions extracted to avoid inline ternary chains
// ─────────────────────────────────────────────────────────────────────────────

function nodeFill(kind: NodeKind): string {
  if (kind === "rule") return "var(--accent-dim)";
  if (kind === "terminal") return "rgba(34,197,94,0.10)";
  return "rgba(100,116,139,0.10)";
}

function nodeStroke(kind: NodeKind): string {
  if (kind === "rule") return "var(--accent-border)";
  if (kind === "terminal") return "rgba(34,197,94,0.55)";
  return "rgba(100,116,139,0.4)";
}

function nodeLabelColor(kind: NodeKind): string {
  if (kind === "rule") return "var(--accent)";
  if (kind === "terminal") return "rgb(134,239,172)";
  return "var(--text-muted)";
}

// ─────────────────────────────────────────────────────────────────────────────
// Build a flat id → RawNode map for O(1) lookups (avoids repeated tree walks)
// ─────────────────────────────────────────────────────────────────────────────

function buildNodeMap(root: RawNode | null): Map<string, RawNode> {
  const map = new Map<string, RawNode>();
  if (!root) return map;
  function walk(n: RawNode) {
    map.set(n.id, n);
    n.children.forEach(walk);
  }
  walk(root);
  return map;
}

// ─────────────────────────────────────────────────────────────────────────────
// Tooltip state
// ─────────────────────────────────────────────────────────────────────────────

interface TooltipState {
  x: number;
  y: number;
  label: string;
  detail: string | undefined;
  kind: NodeKind;
  depth: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

interface ParseTreePanelProps {
  code: string;
}

export function ParseTreePanel({ code }: ParseTreePanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  // Tracks whether the next render should auto-fit the view
  const shouldFitRef = useRef(true);

  const [parseResult, setParseResult] = useState<ParseResult>({
    root: null,
    errorMsg: null,
    nodeCount: 0,
    depthMax: 0,
  });
  const [isParsing, setIsParsing] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  // ── Debounced parsing ──────────────────────────────────────────────────────
  useEffect(() => {
    setIsParsing(true);
    const timer = setTimeout(() => {
      const result = buildRawTree(code);
      setParseResult(result);
      setCollapsed(new Set());
      shouldFitRef.current = true; // new code → fit to view on next render
      setIsParsing(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [code]);

  // ── O(1) node lookup map ───────────────────────────────────────────────────
  // IMPROVEMENT: replaces repeated recursive tree-search in click/filter handlers.
  const nodeMap = useMemo(
    () => buildNodeMap(parseResult.root),
    [parseResult.root],
  );

  // ── Node dimensions ────────────────────────────────────────────────────────
  // IMPROVEMENT: moved from useState (causing extra re-render) to useMemo.
  // Recomputes only when the full node set changes (new parse), not on collapse.
  const nodeDimensions = useMemo(() => {
    const dims = new Map<string, { width: number; height: number }>();
    nodeMap.forEach((node, id) => dims.set(id, getNodeDims(node)));
    return dims;
  }, [nodeMap]);

  // ── Visible (pruned) tree respecting collapsed set ─────────────────────────
  // IMPROVEMENT: was computed inline in the render body; now properly memoized.
  const visibleRoot = useMemo(() => {
    if (!parseResult.root) return null;
    function prune(n: RawNode): RawNode {
      if (collapsed.has(n.id)) return { ...n, children: [] };
      return { ...n, children: n.children.map(prune) };
    }
    return prune(parseResult.root);
  }, [parseResult.root, collapsed]);

  // ── Fit to view ────────────────────────────────────────────────────────────
  const fitToView = useCallback(() => {
    if (
      !svgRef.current ||
      !gRef.current ||
      !containerRef.current ||
      !zoomRef.current
    )
      return;
    const svg = d3.select(svgRef.current);
    try {
      const bbox = gRef.current.getBBox();
      if (bbox.width === 0 || bbox.height === 0) return;
      const { width: W, height: H } =
        containerRef.current.getBoundingClientRect();
      const pad = 48;
      const scale = Math.min(
        (W - pad * 2) / bbox.width,
        (H - pad * 2) / bbox.height,
        1.4,
      );
      const tx = W / 2 - scale * (bbox.x + bbox.width / 2);
      const ty = H / 2 - scale * (bbox.y + bbox.height / 2);
      svg
        .transition()
        .duration(420)
        .call(
          zoomRef.current.transform,
          d3.zoomIdentity.translate(tx, ty).scale(scale),
        );
    } catch {
      /* getBBox unavailable in some environments */
    }
  }, []);

  // ── Toggle node collapse ───────────────────────────────────────────────────
  const toggleCollapse = useCallback((id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  // ── Zoom + SVG defs setup (runs ONCE on mount) ─────────────────────────────
  // IMPROVEMENT: glow filter is now added here, not inside the render effect.
  // Previously it was inside `g` which got wiped on every render; now it lives
  // in the SVG's own <defs> and persists for the component's lifetime.
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    // Add glow filter to SVG defs — survives all tree re-renders
    const defs = svg.append("defs");
    const filter = defs
      .append("filter")
      .attr("id", "pt-glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");
    filter
      .append("feGaussianBlur")
      .attr("in", "SourceGraphic")
      .attr("stdDeviation", "2")
      .attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Zoom behavior
    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.05, 4])
      .on("zoom", (event) => {
        if (gRef.current)
          d3.select(gRef.current).attr("transform", event.transform);
      });

    zoomRef.current = zoomBehavior;
    svg.call(zoomBehavior);
    svg.on("dblclick.zoom", null);

    return () => {
      svg.on(".zoom", null);
    };
  }, []);

  // ── D3 rendering ───────────────────────────────────────────────────────────
  //
  // KEY IMPROVEMENTS:
  //
  // 1. Uses D3's `.join(enter, update, exit)` pattern instead of
  //    `g.selectAll("*").remove()` + `.enter().append()`.
  //    This means only changed nodes are touched; unchanged nodes are reused,
  //    which enables proper enter/exit transitions and is far more efficient.
  //
  // 2. Node building is a single pass: rect + chevron + labels are all
  //    appended in the enter selection and then updated via `.select()`.
  //    Previously there were 3+ separate `nodeG.each()` loops over all nodes.
  //
  // 3. Hover events no longer use hoverTimeoutRef (was never set, only cleared).
  //    Simplified to direct set/clear without timeouts.
  //
  useEffect(() => {
    if (!svgRef.current || !gRef.current || !containerRef.current) return;
    if (!visibleRoot || nodeDimensions.size === 0) return;

    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);

    // Save current zoom transform to restore after a collapse toggle
    const savedTransform = d3.zoomTransform(svgRef.current);
    const doFit = shouldFitRef.current;

    const { width: W, height: H } =
      containerRef.current.getBoundingClientRect();

    // ── D3 hierarchy + layout ──────────────────────────────────────────────
    const root = d3.hierarchy(visibleRoot, (d) =>
      d.children.length ? d.children : null,
    );
    d3.tree<RawNode>().nodeSize([NODE_ROW_GAP, NODE_COL_GAP])(root);

    type PNode = d3.HierarchyPointNode<RawNode>;
    const nodes = root.descendants() as PNode[];
    const links = root.links() as d3.HierarchyPointLink<RawNode>[];

    // ── Links ── use .join() with stable key ──────────────────────────────
    g.selectAll<SVGPathElement, d3.HierarchyPointLink<RawNode>>(".pt-link")
      .data(links, (d) => `${d.source.data.id}→${d.target.data.id}`)
      .join(
        (enter) => enter.append("path").attr("class", "pt-link"),
        (update) => update,
        (exit) => exit.remove(),
      )
      .attr("fill", "none")
      .attr("stroke", "var(--border)")
      .attr("stroke-width", 1.2)
      .attr("d", (d) =>
        hLink(
          (d.source as PNode).y,
          (d.source as PNode).x,
          (d.target as PNode).y,
          (d.target as PNode).x,
        ),
      );

    // ── Node groups ── use .join() with stable key (node id) ─────────────
    // All sub-elements (rect, chevron, labels) are appended once in enter
    // and then updated in-place for both enter and update selections.
    const nodeG = g
      .selectAll<SVGGElement, PNode>(".pt-node")
      .data(nodes, (d) => d.data.id)
      .join(
        (enter) => {
          const el = enter.append("g").attr("class", "pt-node");
          el.append("rect").attr("class", "pt-rect");
          el.append("text").attr("class", "pt-chevron");
          el.append("text").attr("class", "pt-label");
          el.append("text").attr("class", "pt-detail");
          return el;
        },
        (update) => update,
        (exit) => exit.remove(),
      );

    // ── Position ──────────────────────────────────────────────────────────
    nodeG.attr("transform", (d) => `translate(${d.y},${d.x})`);

    // ── Cursor ────────────────────────────────────────────────────────────
    nodeG.attr("cursor", (d) => {
      const full = nodeMap.get(d.data.id);
      return full?.children.length && d.data.kind === "rule"
        ? "pointer"
        : "default";
    });

    // ── Rect ─ single pass update ─────────────────────────────────────────
    nodeG.select<SVGRectElement>(".pt-rect").each(function (d) {
      const dims = nodeDimensions.get(d.data.id);
      if (!dims) return;
      d3.select(this)
        .attr("x", -dims.width / 2)
        .attr("y", -dims.height / 2)
        .attr("width", dims.width)
        .attr("height", dims.height)
        .attr("rx", NODE_RX)
        .attr("fill", nodeFill(d.data.kind))
        .attr("stroke", nodeStroke(d.data.kind))
        .attr("stroke-width", 1.2)
        .attr("filter", "none");
    });

    // ── Chevron indicator ─────────────────────────────────────────────────
    nodeG.select<SVGTextElement>(".pt-chevron").each(function (d) {
      const full = nodeMap.get(d.data.id);
      const isCollapsible = !!full?.children.length && d.data.kind === "rule";
      const dims = nodeDimensions.get(d.data.id);
      d3.select(this)
        .attr("visibility", isCollapsible ? "visible" : "hidden")
        .attr("x", dims ? dims.width / 2 - 12 : 0)
        .attr("y", 0)
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "middle")
        .attr("fill", "var(--accent)")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("font-family", "monospace")
        .attr("pointer-events", "none")
        .text(collapsed.has(d.data.id) ? "▶" : "▼");
    });

    // ── Main label ────────────────────────────────────────────────────────
    nodeG
      .select<SVGTextElement>(".pt-label")
      .attr("dominant-baseline", "middle")
      .attr("dy", (d) => (d.data.detail ? -8 : 0))
      .attr("text-anchor", "middle")
      .attr("fill", (d) => nodeLabelColor(d.data.kind))
      .attr("font-size", `${FONT_SIZE_MAIN}px`)
      .attr("font-weight", (d) => (d.data.kind === "rule" ? "600" : "400"))
      .attr("font-family", FONT_STACK)
      .attr("pointer-events", "none")
      .text((d) => d.data.label);

    // ── Detail label (token literal) ──────────────────────────────────────
    nodeG
      .select<SVGTextElement>(".pt-detail")
      .attr("visibility", (d) => (d.data.detail ? "visible" : "hidden"))
      .attr("dominant-baseline", "middle")
      .attr("dy", 10)
      .attr("text-anchor", "middle")
      .attr("fill", "rgba(134,239,172,0.75)")
      .attr("font-size", `${FONT_SIZE_DETAIL}px`)
      .attr("font-family", FONT_STACK)
      .attr("font-style", "italic")
      .attr("pointer-events", "none")
      .text((d) => (d.data.detail ? `"${d.data.detail}"` : ""));

    // ── Event handlers ────────────────────────────────────────────────────
    nodeG
      .on("click", (_event, d) => {
        // O(1) lookup — no more recursive tree search per click
        const full = nodeMap.get(d.data.id);
        if (full?.children.length && d.data.kind === "rule") {
          toggleCollapse(d.data.id);
        }
      })
      .on("mouseenter", (event, d) => {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        setTooltip({
          x: event.clientX - rect.left + 15,
          y: event.clientY - rect.top + 10,
          label: d.data.label,
          detail: d.data.detail,
          kind: d.data.kind,
          depth: d.depth,
        });
        d3.select<SVGGElement, PNode>(event.currentTarget as SVGGElement)
          .select<SVGRectElement>("rect")
          .transition()
          .duration(150)
          .attr("stroke-width", 2.5)
          .attr("filter", "url(#pt-glow)");
      })
      .on("mousemove", (event) => {
        const container = containerRef.current;
        if (!container) return;
        const { left, top } = container.getBoundingClientRect();
        setTooltip((prev) =>
          prev
            ? {
                ...prev,
                x: event.clientX - left + 15,
                y: event.clientY - top + 10,
              }
            : null,
        );
      })
      .on("mouseleave", (event) => {
        setTooltip(null);
        d3.select<SVGGElement, PNode>(event.currentTarget as SVGGElement)
          .select<SVGRectElement>("rect")
          .transition()
          .duration(150)
          .attr("stroke-width", 1.2)
          .attr("filter", "none");
      });

    // ── Zoom: auto-fit on new tree; restore on collapse toggle ────────────
    if (doFit) {
      requestAnimationFrame(() => {
        try {
          const bbox = gRef.current!.getBBox();
          if (bbox.width === 0 || bbox.height === 0) return;
          const pad = 40;
          const scale = Math.min(
            (W - pad * 2) / bbox.width,
            (H - pad * 2) / bbox.height,
            1.2,
          );
          const tx = W / 2 - scale * (bbox.x + bbox.width / 2);
          const ty = H / 2 - scale * (bbox.y + bbox.height / 2);
          svg.call(
            zoomRef.current!.transform,
            d3.zoomIdentity.translate(tx, ty).scale(scale),
          );
          shouldFitRef.current = false;
        } catch {
          /* ignore */
        }
      });
    } else {
      svg.call(zoomRef.current!.transform, savedTransform);
    }
  }, [visibleRoot, nodeDimensions, nodeMap, collapsed, toggleCollapse]);

  // ── Render ─────────────────────────────────────────────────────────────────
  const hasTree = !!parseResult.root;
  const hasError = !!parseResult.errorMsg;

  return (
    <Flex direction="column" h="100%" bg="var(--bg-base)">
      {/* ── Header ── */}
      <Flex
        align="center"
        justify="space-between"
        h="36px"
        px="12px"
        flexShrink={0}
        borderBottom="1px solid var(--border)"
        bg="var(--bg-panel)"
      >
        <Flex align="center" gap="6px">
          <GitBranch size={12} color="var(--accent)" />
          <Text
            fontSize="11px"
            fontWeight="700"
            color="var(--accent)"
            fontFamily="'JetBrains Mono', monospace"
            letterSpacing="0.08em"
          >
            PARSE TREE
          </Text>
          {parseResult.nodeCount > 0 && (
            <Text
              fontSize="10px"
              color="var(--text-muted)"
              fontFamily="monospace"
              ml="4px"
            >
              {parseResult.nodeCount} nodes · depth {parseResult.depthMax}
            </Text>
          )}
          {isParsing && (
            <RefreshCw
              size={10}
              color="var(--text-muted)"
              style={{
                animation: "pt-spin 0.9s linear infinite",
                marginLeft: "6px",
              }}
            />
          )}
        </Flex>

        <Flex align="center" gap="4px">
          {hasTree && (
            <Text
              fontSize="9.5px"
              color="var(--text-muted)"
              fontFamily="monospace"
              mr="6px"
            >
              scroll/drag · click rule to collapse
            </Text>
          )}
          <ToolBtn title="Fit to view" onClick={fitToView}>
            <Maximize2 size={11} />
          </ToolBtn>
        </Flex>
      </Flex>

      {/* ── Canvas ── */}
      <Box ref={containerRef} flex={1} overflow="hidden" position="relative">
        {/* Error state */}
        {hasError && !hasTree && (
          <Flex
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%,-50%)"
            direction="column"
            align="center"
            gap="8px"
            px="24px"
          >
            <Text
              fontSize="12px"
              color="var(--text-muted)"
              fontFamily="monospace"
            >
              Parse error — tree unavailable
            </Text>
            <Text
              fontSize="11px"
              color="rgba(239,68,68,0.7)"
              fontFamily="monospace"
              maxW="320px"
              textAlign="center"
            >
              {parseResult.errorMsg}
            </Text>
          </Flex>
        )}

        {/* Empty state */}
        {!hasTree && !hasError && !isParsing && (
          <Flex
            h="100%"
            align="center"
            justify="center"
            direction="column"
            gap="8px"
          >
            <GitBranch size={28} color="var(--border)" />
            <Text
              fontSize="12px"
              color="var(--text-muted)"
              fontFamily="monospace"
            >
              Write code to see the parse tree
            </Text>
          </Flex>
        )}

        {/* SVG */}
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          style={{ display: hasTree ? "block" : "none" }}
        >
          <g ref={gRef} />
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <Box
            position="absolute"
            left={tooltip.x}
            top={tooltip.y}
            bg="var(--bg-panel)"
            border="1px solid var(--border)"
            borderRadius="6px"
            px="10px"
            py="7px"
            pointerEvents="none"
            zIndex={50}
            boxShadow="0 6px 20px rgba(0,0,0,0.5)"
            maxW="300px"
            style={{ transition: "left 0.05s ease, top 0.05s ease" }}
          >
            <Flex align="center" gap="5px" mb="4px">
              <KindBadge kind={tooltip.kind} />
              <Text
                fontSize="11px"
                fontWeight="600"
                color="var(--text-primary)"
                fontFamily="monospace"
              >
                {tooltip.label}
              </Text>
            </Flex>
            {tooltip.detail && (
              <Text
                fontSize="10px"
                color="rgb(134,239,172)"
                fontFamily="monospace"
                fontStyle="italic"
                wordBreak="break-all"
              >
                "{tooltip.detail}"
              </Text>
            )}
            <Text
              fontSize="9.5px"
              color="var(--text-muted)"
              fontFamily="monospace"
              mt="3px"
            >
              depth {tooltip.depth}
            </Text>
          </Box>
        )}

        {/* Legend */}
        {hasTree && (
          <Flex
            position="absolute"
            bottom="10px"
            left="10px"
            gap="10px"
            bg="var(--bg-panel)"
            border="1px solid var(--border-subtle)"
            borderRadius="6px"
            px="10px"
            py="6px"
            pointerEvents="none"
            opacity={0.85}
          >
            <LegendItem
              color="var(--accent-border)"
              fill="var(--accent-dim)"
              label="Rule"
            />
            <LegendItem
              color="rgba(34,197,94,0.55)"
              fill="rgba(34,197,94,0.10)"
              label="Token"
            />
            <LegendItem
              color="rgba(100,116,139,0.4)"
              fill="rgba(100,116,139,0.10)"
              label="EOF"
            />
          </Flex>
        )}

        <style>{`
          @keyframes pt-spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}</style>
      </Box>
    </Flex>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function ToolBtn({
  children,
  title,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "24px",
        height: "24px",
        background: "transparent",
        border: "1px solid transparent",
        borderRadius: "4px",
        cursor: "pointer",
        color: "var(--text-muted)",
        transition: "all 0.12s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        const b = e.currentTarget;
        b.style.background = "var(--bg-surface)";
        b.style.borderColor = "var(--border)";
        b.style.color = "var(--text-primary)";
      }}
      onMouseLeave={(e) => {
        const b = e.currentTarget;
        b.style.background = "transparent";
        b.style.borderColor = "transparent";
        b.style.color = "var(--text-muted)";
      }}
    >
      {children}
    </button>
  );
}

function KindBadge({ kind }: { kind: NodeKind }) {
  const map: Record<NodeKind, { label: string; color: string }> = {
    rule: { label: "RULE", color: "var(--accent)" },
    terminal: { label: "TOKEN", color: "rgb(134,239,172)" },
    eof: { label: "EOF", color: "var(--text-muted)" },
  };
  const { label, color } = map[kind];
  return (
    <Box
      as="span"
      px="4px"
      py="1px"
      borderRadius="3px"
      border="1px solid"
      borderColor={color}
      color={color}
      fontSize="8.5px"
      fontFamily="monospace"
      fontWeight="700"
      letterSpacing="0.08em"
      flexShrink={0}
    >
      {label}
    </Box>
  );
}

function LegendItem({
  color,
  fill,
  label,
}: {
  color: string;
  fill: string;
  label: string;
}) {
  return (
    <Flex align="center" gap="5px">
      <Box
        w="10px"
        h="10px"
        borderRadius="2px"
        border="1px solid"
        borderColor={color}
        bg={fill}
        flexShrink={0}
      />
      <Text fontSize="9.5px" color="var(--text-muted)" fontFamily="monospace">
        {label}
      </Text>
    </Flex>
  );
}
