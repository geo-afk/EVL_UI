import { Box, Flex } from "@chakra-ui/react";
import { useRef, useState, useCallback, type ReactNode } from "react";

interface StackedPanesProps {
  top: ReactNode;
  bottom: ReactNode;
  defaultTopPercent?: number;
}

export const StackedPanes = ({
  top,
  bottom,
  defaultTopPercent = 50,
}: StackedPanesProps) => {
  const [topPercent, setTopPercent] = useState(defaultTopPercent);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const onMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalH = rect.height;
      let newTopPx = e.clientY - rect.top;
      newTopPx = Math.max(120, Math.min(newTopPx, totalH - 120));
      setTopPercent((newTopPx / totalH) * 100);
    };

    const onMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }, []);

  return (
    <Flex direction="column" h="100%" ref={containerRef} overflow="hidden">
      {/* Top pane */}
      <Box
        style={{ height: `${topPercent}%` }}
        flexShrink={0}
        overflow="hidden"
      >
        {top}
      </Box>

      {/* Drag handle */}
      <Box
        h="4px"
        flexShrink={0}
        bg="var(--drag-handle)"
        cursor="row-resize"
        transition="background 0.15s"
        onMouseDown={onMouseDown}
        _hover={{ bg: "var(--accent-dim)" }}
        _active={{ bg: "var(--accent-border)" }}
        position="relative"
      >
        <Flex
          align="center"
          justify="center"
          h="100%"
          gap="4px"
          pointerEvents="none"
        >
          {[...Array(5)].map((_, i) => (
            <Box
              key={i}
              w="2px"
              h="2px"
              borderRadius="full"
              bg="var(--text-ghost)"
            />
          ))}
        </Flex>
      </Box>

      {/* Bottom pane */}
      <Box flex="1" overflow="hidden">
        {bottom}
      </Box>
    </Flex>
  );
};
