import { useRef, useState, useCallback, useEffect, type ReactNode } from "react";
import { Box, Flex } from "@chakra-ui/react";

interface SplitLayoutProps {
  left: ReactNode;
  right: ReactNode;
  defaultLeftPercent?: number;
  minLeftPx?: number;
  minRightPx?: number;
}

export const SplitLayout = ({
  left,
  right,
  defaultLeftPercent = 38,
  minLeftPx  = 260,
  minRightPx = 320,
}: SplitLayoutProps) => {
  const [leftPercent, setLeftPercent] = useState(defaultLeftPercent);
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
    document.body.style.cursor     = "col-resize";
    document.body.style.userSelect = "none";

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect       = containerRef.current.getBoundingClientRect();
      const totalWidth = rect.width;
      const clamped    = Math.max(minLeftPx, Math.min(e.clientX - rect.left, totalWidth - minRightPx));
      setLeftPercent((clamped / totalWidth) * 100);
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
  }, [minLeftPx, minRightPx]);

  return (
    <Flex h="100%" ref={containerRef} overflow="hidden">
      {/* Left pane */}
      <Box style={{ width: `${leftPercent}%` }} flexShrink={0} overflow="hidden">
        {left}
      </Box>

      {/* Drag handle */}
      <Box
        w="4px" flexShrink={0} bg="var(--drag-handle)" cursor="col-resize"
        position="relative" transition="background 0.15s" onMouseDown={onMouseDown}
        _hover={{ bg: "var(--accent-dim)" }} _active={{ bg: "var(--accent-border)" }}
      >
        <Flex direction="column" align="center" justify="center"
          h="100%" gap="4px" pointerEvents="none"
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <Box key={i} w="2px" h="2px" borderRadius="full" bg="var(--text-ghost)" />
          ))}
        </Flex>
      </Box>

      {/* Right pane */}
      <Box flex="1" overflow="hidden">{right}</Box>
    </Flex>
  );
};