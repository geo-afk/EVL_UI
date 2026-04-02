import { useCallback, useEffect, useRef } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { X, WifiOff, AlertTriangle, Info } from "lucide-react";
import { Toast, ToastKind } from "./useToasts";

// ─── Single toast card ────────────────────────────────────────────────────────
const AUTO_DISMISS_MS = 8_000;

const STYLE: Record<ToastKind, { bg: string; border: string; accent: string }> = {
  error:   { bg: "#1a0808", border: "#5a1e1e", accent: "#f87171" },
  warning: { bg: "#1a1400", border: "#5a4a00", accent: "#fbbf24" },
  info:    { bg: "#081018", border: "#1e3a5a", accent: "#60a5fa" },
};

const ICON: Record<ToastKind, React.ElementType> = {
  error:   WifiOff,
  warning: AlertTriangle,
  info:    Info,
};



function ToastCard({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const s           = STYLE[toast.kind];
  const Icon        = ICON[toast.kind];
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoveredRef  = useRef(false);

  const startTimer = useCallback(() => {
    timerRef.current = setTimeout(() => {
      if (!hoveredRef.current) onDismiss(toast.id);
    }, AUTO_DISMISS_MS);
  }, [toast.id, onDismiss]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  }, []);

  // Start auto-dismiss timer on mount; clear on unmount.
  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [startTimer, clearTimer]);

  return (
    <Box
      bg={s.bg}
      border={`1px solid ${s.border}`}
      borderLeft={`3px solid ${s.accent}`}
      borderRadius="8px"
      boxShadow="0 8px 32px rgba(0,0,0,0.6)"
      p="12px 14px"
      w="320px"
      style={{ animation: "toastSlideIn 0.2s ease both" }}
      onMouseEnter={() => {
        hoveredRef.current = true;
        clearTimer();
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
        startTimer();
      }}
    >
      <Flex align="flex-start" gap="10px">
        {/* Icon */}
        <Box pt="1px" flexShrink={0}>
          <Icon size={14} color={s.accent} />
        </Box>

        {/* Text */}
        <Box flex={1} overflow="hidden">
          <Text
            fontSize="11.5px"
            fontWeight="700"
            color={s.accent}
            fontFamily="'JetBrains Mono', monospace"
            letterSpacing="0.04em"
            mb="3px"
          >
            {toast.title}
          </Text>
          <Text
            fontSize="11px"
            color="var(--text-secondary)"
            fontFamily="'JetBrains Mono', monospace"
            lineHeight="1.6"
            wordBreak="break-word"
          >
            {toast.message}
          </Text>
        </Box>

        {/* Dismiss */}
        <button
          onClick={() => onDismiss(toast.id)}
          title="Dismiss"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--text-ghost)",
            padding: "1px",
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color = s.accent)
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-ghost)")
          }
        >
          <X size={12} />
        </button>
      </Flex>
    </Box>
  );
}

// ─── Stack ────────────────────────────────────────────────────────────────────
export function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <Box
      position="fixed"
      bottom="20px"
      right="20px"
      zIndex={9999}
      display="flex"
      flexDirection="column"
      gap="8px"
      alignItems="flex-end"
      pointerEvents="none"
    >
      {toasts.map((t) => (
        <Box key={t.id} pointerEvents="auto">
          <ToastCard toast={t} onDismiss={onDismiss} />
        </Box>
      ))}

      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </Box>
  );
}