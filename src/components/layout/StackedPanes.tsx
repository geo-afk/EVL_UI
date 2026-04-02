import { useRef, useState, useCallback, useEffect, type ReactNode } from "react";
import { Box, Flex } from "@chakra-ui/react";

interface StackedPanesProps {
  top: ReactNode;
  bottom: ReactNode;
  defaultTopPercent?: number;
  /** Minimum height in px for each pane. Defaults to 80. */
  minPanePx?: number;
}

export const StackedPanes = ({
  top,
  bottom,
  defaultTopPercent = 50,
  minPanePx = 80,
}: StackedPanesProps) => {
  const [topPercent,  setTopPercent]  = useState(defaultTopPercent);
  const containerRef                  = useRef<HTMLDivElement>(null);
  const isDragging                    = useRef(false);
  // Cleanup fn stored so the unmount effect can cancel a drag in progress.
  const cleanupRef                    = useRef<(() => void) | null>(null);

  // Remove any dangling listeners when the component unmounts mid-drag.
  useEffect(() => {
    return () => { cleanupRef.current?.(); };
  }, []);

  const onMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor     = "row-resize";
    document.body.style.userSelect = "none";

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect   = containerRef.current.getBoundingClientRect();
      const totalH = rect.height;
      const clamped = Math.max(minPanePx, Math.min(e.clientY - rect.top, totalH - minPanePx));
      setTopPercent((clamped / totalH) * 100);
    };

    const cleanup = () => {
      isDragging.current             = false;
      document.body.style.cursor     = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup",   onMouseUp);
      cleanupRef.current = null;
    };

    const onMouseUp = () => cleanup();

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup",   onMouseUp);
    cleanupRef.current = cleanup;
  }, [minPanePx]);

  return (
    <Flex direction="column" h="100%" ref={containerRef} overflow="hidden">
      {/* Top pane */}
      <Box style={{ height: `${topPercent}%` }} flexShrink={0} overflow="hidden">
        {top}
      </Box>

      {/* Drag handle */}
      <Box
        h="4px" flexShrink={0} bg="var(--drag-handle)" cursor="row-resize"
        transition="background 0.15s" onMouseDown={onMouseDown}
        _hover={{ bg: "var(--accent-dim)" }} _active={{ bg: "var(--accent-border)" }}
        position="relative"
      >
        <Flex align="center" justify="center" h="100%" gap="4px" pointerEvents="none">
          {[0, 1, 2, 3, 4].map((i) => (
            <Box key={i} w="2px" h="2px" borderRadius="full" bg="var(--text-ghost)" />
          ))}
        </Flex>
      </Box>

      {/* Bottom pane */}
      <Box flex="1" overflow="hidden">{bottom}</Box>
    </Flex>
  );
};