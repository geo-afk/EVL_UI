import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Code2, BookOpen } from "lucide-react";
import { EditorPage } from "./pages/EditorPage";
import { LearnPage } from "./pages/LearnPage";

const NavItem = ({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
}) => (
  <NavLink to={to} end={to === "/"}>
    {({ isActive }) => (
      <Flex
        align="center"
        gap="8px"
        px="14px"
        py="7px"
        borderRadius="6px"
        fontSize="13px"
        fontWeight="500"
        letterSpacing="0.02em"
        cursor="pointer"
        transition="all 0.15s ease"
        bg={isActive ? "rgba(251, 146, 60, 0.12)" : "transparent"}
        color={isActive ? "#fb923c" : "#8a8a9a"}
        border="1px solid"
        borderColor={isActive ? "rgba(251, 146, 60, 0.25)" : "transparent"}
        _hover={{ color: "#e2e2e8", bg: "rgba(255,255,255,0.05)" }}
      >
        <Icon size={14} />
        <Text>{label}</Text>
      </Flex>
    )}
  </NavLink>
);

export default function App() {
  return (
    <BrowserRouter>
      <Flex direction="column" h="100vh" bg="#0e0e12" overflow="hidden">
        {/* Top Nav */}
        <Flex
          h="44px"
          align="center"
          px="18px"
          gap="6px"
          borderBottom="1px solid #1e1e28"
          flexShrink={0}
          justify="space-between"
        >
          <Flex align="center" gap="10px">
            {/* Logo mark */}
            <Box
              w="22px"
              h="22px"
              borderRadius="5px"
              bg="linear-gradient(135deg, #fb923c, #f97316)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
            >
              <Code2 size={12} color="#fff" />
            </Box>
            <Text
              fontSize="13px"
              fontWeight="700"
              color="#e2e2e8"
              fontFamily="'Courier New', monospace"
              letterSpacing="0.05em"
            >
              EVAL Lang
            </Text>
          </Flex>
          <Flex gap="4px">
            <NavItem to="/" icon={Code2} label="Editor" />
            <NavItem to="/learn" icon={BookOpen} label="Learn" />
          </Flex>
          <Box w="100px" /> {/* spacer for balance */}
        </Flex>

        {/* Page Content */}
        <Box flex="1" overflow="hidden">
          <Routes>
            <Route path="/" element={<EditorPage />} />
            <Route path="/learn" element={<LearnPage />} />
          </Routes>
        </Box>
      </Flex>
    </BrowserRouter>
  );
}
