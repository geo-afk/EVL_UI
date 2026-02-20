import { Box, Flex } from "@chakra-ui/react";
import { useRef, useState, useCallback, type ReactNode } from "react";

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
  minLeftPx = 260,
  minRightPx = 320,
}: SplitLayoutProps) => {
  const [leftPercent, setLeftPercent] = useState(defaultLeftPercent);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const onMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalWidth = rect.width;
      let newLeftPx = e.clientX - rect.left;

      newLeftPx = Math.max(
        minLeftPx,
        Math.min(newLeftPx, totalWidth - minRightPx),
      );
      setLeftPercent((newLeftPx / totalWidth) * 100);
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
  }, [minLeftPx, minRightPx]);

  return (
    <Flex h="100%" ref={containerRef} overflow="hidden">
      {/* Left pane */}
      <Box
        style={{ width: `${leftPercent}%` }}
        flexShrink={0}
        overflow="hidden"
      >
        {left}
      </Box>

      {/* Drag handle */}
      <Box
        w="4px"
        flexShrink={0}
        bg="#1a1a22"
        cursor="col-resize"
        position="relative"
        transition="background 0.15s"
        onMouseDown={onMouseDown}
        _hover={{ bg: "#fb923c40" }}
        _active={{ bg: "#fb923c80" }}
      >
        {/* visual grip dots */}
        <Flex
          direction="column"
          align="center"
          justify="center"
          h="100%"
          gap="4px"
          pointerEvents="none"
        >
          {[...Array(5)].map((_, i) => (
            <Box key={i} w="2px" h="2px" borderRadius="full" bg="#2a2a38" />
          ))}
        </Flex>
      </Box>

      {/* Right pane */}
      <Box flex="1" overflow="hidden">
        {right}
      </Box>
    </Flex>
  );
};
