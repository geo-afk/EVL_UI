import { Box, Flex, Text } from "@chakra-ui/react";
import { AlertTriangle, XCircle, CheckCircle2, Bug } from "lucide-react";
import { DiagnosticModel } from "../../model/models";

interface DiagnosticsPanelProps {
  errors: DiagnosticModel[];
  warnings: DiagnosticModel[];
  onGoToLine: (line: number, column?: number) => void;
}

// ─── Severity helpers ─────────────────────────────────────────────────────────
const SEV_ERROR = 1;

function isError(d: DiagnosticModel) {
  return d.severity <= SEV_ERROR;
}

// ─── Single diagnostic row ────────────────────────────────────────────────────
interface DiagRowProps {
  diag: DiagnosticModel;
  kind: "error" | "warning";
  onGoToLine: (line: number, column?: number) => void;
}

const DiagRow = ({ diag, kind, onGoToLine }: DiagRowProps) => {
  const isErr = kind === "error";

  const accentColor = isErr ? "var(--diag-error)" : "var(--diag-warning)";
  const bgHover = isErr ? "var(--diag-error-bg)" : "var(--diag-warning-bg)";
  const Icon = isErr ? XCircle : AlertTriangle;

  return (
    <Flex
      as="button"
      align="flex-start"
      gap="10px"
      px="12px"
      py="7px"
      w="100%"
      bg="transparent"
      border="none"
      cursor="pointer"
      textAlign="left"
      borderLeft="2px solid transparent"
      transition="background 0.12s, border-color 0.12s"
      _hover={{
        bg: bgHover,
        borderLeftColor: accentColor,
      }}
      onClick={() => onGoToLine(diag.line_number, diag.column_number)}
      title={`Jump to line ${diag.line_number}`}
      role="button"
    >
      {/* Icon */}
      <Box pt="2px" flexShrink={0}>
        <Icon size={13} color={accentColor} />
      </Box>

      {/* Message */}
      <Box flex={1} overflow="hidden">
        <Text
          fontSize="12px"
          fontFamily="'JetBrains Mono', 'Courier New', monospace"
          color="var(--text-secondary)"
          lineHeight="1.55"
          style={{
            wordBreak: "break-word",
          }}
        >
          {diag.message}
        </Text>
      </Box>

      {/* Location badge */}
      <Flex
        align="center"
        gap="2px"
        flexShrink={0}
        pt="1px"
      >
        <Text
          fontSize="10px"
          fontFamily="'JetBrains Mono', 'Courier New', monospace"
          color={accentColor}
          opacity={0.75}
          letterSpacing="0.04em"
        >
          {diag.line_number}
          {diag.column_number != null ? `:${diag.column_number}` : ""}
        </Text>
      </Flex>
    </Flex>
  );
};

// ─── Section header ───────────────────────────────────────────────────────────
const SectionHeader = ({
  label,
  count,
  kind,
}: {
  label: string;
  count: number;
  kind: "error" | "warning";
}) => {
  const color =
    kind === "error" ? "var(--diag-error)" : "var(--diag-warning)";

  return (
    <Flex
      align="center"
      gap="6px"
      px="12px"
      py="5px"
      bg="var(--bg-elevated)"
      borderBottom="1px solid var(--border)"
      borderTop="1px solid var(--border)"
      position="sticky"
      top={0}
      zIndex={1}
    >
      <Text
        fontSize="10px"
        fontWeight="700"
        fontFamily="'JetBrains Mono', 'Courier New', monospace"
        color={color}
        letterSpacing="0.08em"
      >
        {label}
      </Text>
      <Flex
        align="center"
        justify="center"
        bg={color}
        borderRadius="3px"
        px="5px"
        h="14px"
        minW="18px"
      >
        <Text
          fontSize="9.5px"
          fontWeight="700"
          color="var(--bg-base)"
          fontFamily="monospace"
          lineHeight={1}
        >
          {count}
        </Text>
      </Flex>
    </Flex>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────
export const DiagnosticsPanel = ({
  errors,
  warnings,
  onGoToLine,
}: DiagnosticsPanelProps) => {
  const hasErrors = errors.length > 0;
  const hasWarnings = warnings.length > 0;
  const isEmpty = !hasErrors && !hasWarnings;

  return (
    <Flex direction="column" h="100%" bg="var(--bg-panel)">
      {/* ── Panel header ── */}
      <Flex
        h="36px"
        align="center"
        px="14px"
        gap="8px"
        borderBottom="1px solid var(--border)"
        flexShrink={0}
        justify="space-between"
      >
        <Flex align="center" gap="6px">
          <Bug size={12} color="var(--text-muted)" />
          <Text
            fontSize="11px"
            fontWeight="600"
            color="var(--text-muted)"
            letterSpacing="0.08em"
            fontFamily="monospace"
          >
            DIAGNOSTICS
          </Text>
        </Flex>

        {/* Summary badges */}
        <Flex align="center" gap="6px">
          {hasErrors && (
            <Flex align="center" gap="4px">
              <XCircle size={10} color="var(--diag-error)" />
              <Text
                fontSize="10px"
                fontFamily="monospace"
                color="var(--diag-error)"
                fontWeight="600"
              >
                {errors.length}
              </Text>
            </Flex>
          )}
          {hasWarnings && (
            <Flex align="center" gap="4px">
              <AlertTriangle size={10} color="var(--diag-warning)" />
              <Text
                fontSize="10px"
                fontFamily="monospace"
                color="var(--diag-warning)"
                fontWeight="600"
              >
                {warnings.length}
              </Text>
            </Flex>
          )}
          {isEmpty && (
            <Flex align="center" gap="4px">
              <CheckCircle2 size={10} color="var(--diag-ok)" />
              <Text fontSize="10px" fontFamily="monospace" color="var(--diag-ok)">
                clean
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex>

      {/* ── Content ── */}
      <Box flex={1} overflowY="auto">
        {/* Empty state */}
        {isEmpty && (
          <Flex
            direction="column"
            align="flex-start"
            justify="center"
            h="100%"
            px="14px"
            gap="5px"
          >
            <Text
              color="var(--text-ghost)"
              fontSize="12px"
              fontFamily="monospace"
            >
              // No errors or warnings
            </Text>
            <Text
              color="var(--text-ghost)"
              fontSize="12px"
              fontFamily="monospace"
            >
              // Run your code to see diagnostics
            </Text>
          </Flex>
        )}

        {/* Errors section */}
        {hasErrors && (
          <Box>
            <SectionHeader
              label="ERRORS"
              count={errors.length}
              kind="error"
            />
            {errors.map((d, i) => (
              <DiagRow
                key={`err-${i}`}
                diag={d}
                kind="error"
                onGoToLine={onGoToLine}
              />
            ))}
          </Box>
        )}

        {/* Warnings section */}
        {hasWarnings && (
          <Box>
            <SectionHeader
              label="WARNINGS"
              count={warnings.length}
              kind="warning"
            />
            {warnings.map((d, i) => (
              <DiagRow
                key={`warn-${i}`}
                diag={d}
                kind="warning"
                onGoToLine={onGoToLine}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* ── CSS variable shims (add to your global theme instead if preferred) ── */}
      <style>{`
        :root {
          --diag-error:      #f87171;
          --diag-error-bg:   rgba(248, 113, 113, 0.06);
          --diag-warning:    #fbbf24;
          --diag-warning-bg: rgba(251, 191, 36, 0.06);
          --diag-ok:         #4ade80;
        }
      `}</style>
    </Flex>
  );
};