import { useState } from "react";
import { Box, Flex, Text, Grid } from "@chakra-ui/react";
import {
  ChevronRight,
  Code2,
  ArrowRight,
  Hash,
  Cpu,
  Zap,
  Shield,
  Calculator,
  Terminal,
  ChevronDown,
  ChevronUp,
  Star,
  Layers,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  icon: React.ReactNode;
  accentColor: string;
  topics: string[];
  sections: Section[];
}

interface Section {
  heading: string;
  body: string;
  codeBlocks?: CodeBlock[];
  note?: string;
  tip?: string;
}

interface CodeBlock {
  label?: string;
  code: string;
}

// ─────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────
const DIFF_COLORS = {
  Beginner: {
    color: "#4ade80",
    bg: "rgba(74,222,128,0.06)",
    border: "rgba(74,222,128,0.2)",
  },
  Intermediate: {
    color: "#facc15",
    bg: "rgba(250,204,21,0.06)",
    border: "rgba(250,204,21,0.2)",
  },
  Advanced: {
    color: "#f87171",
    bg: "rgba(248,113,113,0.06)",
    border: "rgba(248,113,113,0.2)",
  },
};

// ─────────────────────────────────────────────
// SYNTAX HIGHLIGHTER
// Gives EVL code its own identity
// ─────────────────────────────────────────────
const KEYWORDS = ["int", "float", "const", "print", "try", "catch", "cast"];
const BUILTINS = ["pow", "sqrt", "min", "max", "round"];
const CONSTANTS = ["PI", "DAYS_IN_WEEK", "HOURS_IN_DAY", "YEAR"];

function tokenizeLine(line: string): React.ReactNode[] {
  if (line.trim().startsWith("//")) {
    return [
      <span key="comment" style={{ color: "#4a5568", fontStyle: "italic" }}>
        {line}
      </span>,
    ];
  }

  const wordRx =
    /(-?\d+\.\d+|-?\d+|"[^"]*"|[a-zA-Z_][a-zA-Z0-9_]*|[+\-*/%=();{},]|\S)/g;
  const tokens: React.ReactNode[] = [];
  let match: RegExpExecArray | null;
  let lastIndex = 0;

  while ((match = wordRx.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(
        <span key={`ws-${lastIndex}`} style={{ color: "#d4d4e8" }}>
          {line.slice(lastIndex, match.index)}
        </span>,
      );
    }
    const tok = match[0];
    let color = "#d4d4e8";
    if (KEYWORDS.includes(tok)) color = "#c084fc";
    else if (BUILTINS.includes(tok)) color = "#38bdf8";
    else if (CONSTANTS.includes(tok)) color = "#fb923c";
    else if (tok.startsWith('"')) color = "#86efac";
    else if (/^-?\d/.test(tok)) color = "#fbbf24";
    else if (["+", "-", "*", "/", "%", "="].includes(tok)) color = "#f472b6";
    tokens.push(
      <span key={`tok-${match.index}`} style={{ color }}>
        {tok}
      </span>,
    );
    lastIndex = wordRx.lastIndex;
  }
  if (lastIndex < line.length) {
    tokens.push(
      <span key="tail" style={{ color: "#d4d4e8" }}>
        {line.slice(lastIndex)}
      </span>,
    );
  }
  return tokens;
}

function EVLCode({ code, label }: { code: string; label?: string }) {
  return (
    <Box my="14px">
      {label && (
        <Flex align="center" gap="6px" mb="6px">
          <Box w="3px" h="12px" bg="#fb923c" borderRadius="2px" />
          <Text
            fontSize="10px"
            color="#fb923c"
            fontFamily="monospace"
            letterSpacing="0.1em"
            fontWeight="600"
          >
            {label.toUpperCase()}
          </Text>
        </Flex>
      )}
      <Box
        bg="#07070b"
        border="1px solid #1e1e2e"
        borderRadius="8px"
        overflow="hidden"
      >
        {/* title bar */}
        <Flex
          align="center"
          gap="6px"
          px="14px"
          py="8px"
          bg="#0d0d14"
          borderBottom="1px solid #1e1e2e"
        >
          <Box w="8px" h="8px" borderRadius="50%" bg="#f87171" opacity={0.7} />
          <Box w="8px" h="8px" borderRadius="50%" bg="#fbbf24" opacity={0.7} />
          <Box w="8px" h="8px" borderRadius="50%" bg="#4ade80" opacity={0.7} />
          <Text
            ml="8px"
            fontSize="10px"
            color="#3a3a4e"
            fontFamily="monospace"
            letterSpacing="0.06em"
          >
            evl
          </Text>
        </Flex>
        <Box p="16px 20px" overflow="auto">
          {code.split("\n").map((line, i) => (
            <Text
              key={i}
              as="div"
              fontFamily="'JetBrains Mono', 'Fira Code', 'Courier New', monospace"
              fontSize="12.5px"
              lineHeight="1.75"
              whiteSpace="pre"
            >
              <span
                style={{
                  color: "#2a2a3e",
                  userSelect: "none",
                  marginRight: "16px",
                  fontSize: "11px",
                }}
              >
                {String(i + 1).padStart(2, " ")}
              </span>
              {tokenizeLine(line)}
            </Text>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

// ─────────────────────────────────────────────
// BEGINNER NOTE / TIP BOXES
// ─────────────────────────────────────────────
function NoteBox({
  text,
  type = "note",
}: {
  text: string;
  type?: "note" | "tip" | "warn";
}) {
  const styles = {
    note: {
      border: "rgba(96,165,250,0.3)",
      bg: "rgba(96,165,250,0.04)",
      icon: "💡",
      label: "NOTE",
      color: "#60a5fa",
    },
    tip: {
      border: "rgba(74,222,128,0.3)",
      bg: "rgba(74,222,128,0.04)",
      icon: "✅",
      label: "TIP",
      color: "#4ade80",
    },
    warn: {
      border: "rgba(251,191,36,0.3)",
      bg: "rgba(251,191,36,0.04)",
      icon: "⚠️",
      label: "IMPORTANT",
      color: "#fbbf24",
    },
  }[type];

  return (
    <Box
      bg={styles.bg}
      border={`1px solid ${styles.border}`}
      borderLeft={`3px solid ${styles.color}`}
      borderRadius="6px"
      p="12px 16px"
      my="14px"
    >
      <Flex align="center" gap="6px" mb="4px">
        <Text fontSize="11px">{styles.icon}</Text>
        <Text
          fontSize="10px"
          fontWeight="700"
          color={styles.color}
          letterSpacing="0.1em"
          fontFamily="monospace"
        >
          {styles.label}
        </Text>
      </Flex>
      <Text fontSize="12.5px" color="#8a8a9a" lineHeight="1.7">
        {text}
      </Text>
    </Box>
  );
}

// ─────────────────────────────────────────────
// LESSONS DATA
// ─────────────────────────────────────────────
const LESSONS: Lesson[] = [
  {
    id: "intro",
    title: "Welcome to EVL",
    subtitle: "Your first steps",
    description:
      "What EVL is, how it works, and why weak typing makes it flexible.",
    difficulty: "Beginner",
    icon: <Star size={16} />,
    accentColor: "#c084fc",
    topics: ["Overview", "Weak Typing", "Implicit Conversion", "Comments"],
    sections: [
      {
        heading: "What is EVL?",
        body: `EVL is a statically-typed, weakly-typed programming language designed for clarity and ease of learning. You declare what type your variable is, but EVL is smart enough to convert between compatible types automatically when needed — this is called implicit conversion.\n\nThink of it like a calculator: you can add an integer (3) and a decimal number (2.5) and it just works — you don't have to do anything special.`,
        note: "Statically-typed means you write the type (int or float) when creating a variable. Weakly-typed means EVL can bend those types in operations when it makes sense.",
      },
      {
        heading: "Your First EVL Program",
        body: `Every EVL program is a series of statements. The simplest thing you can do is store a value and print it.`,
        codeBlocks: [
          {
            label: "Hello, EVL",
            code: `int x = 10\nfloat y = 20.5\nint sum = x + y  // Implicit conversion happens here\nprint("Sum:", sum)`,
          },
        ],
        tip: "EVL adds x (an int) and y (a float). The result is automatically treated as an int for storage in 'sum'. This is weak typing in action!",
      },
      {
        heading: "Comments",
        body: `Comments are notes you leave in your code. EVL ignores them entirely — they're just for humans reading the code.\n\nEVL supports two comment styles:`,
        codeBlocks: [
          {
            label: "Comment styles",
            code: `// This is a single-line comment\n\n/* This is a\n   multi-line comment */\n\nint age = 25  // You can also put comments at the end of a line`,
          },
        ],
        note: "Good comments explain WHY you did something, not WHAT the code does (the code itself shows what it does).",
      },
    ],
  },
  {
    id: "types",
    title: "Variables & Types",
    subtitle: "int, float, const",
    description:
      "Understand integers, floating-point numbers, and immutable constants.",
    difficulty: "Beginner",
    icon: <Hash size={16} />,
    accentColor: "#38bdf8",
    topics: ["int", "float", "const", "Naming Rules"],
    sections: [
      {
        heading: "What is a Variable?",
        body: `A variable is like a labelled box that holds a value. You give the box a name, and you can look inside it or replace what's in it any time.\n\nIn EVL, before you create a variable you must declare its type — what kind of value it will hold. This helps EVL catch mistakes early.`,
        note: "Variable names can contain letters, numbers, and underscores, but must START with a letter or underscore. They are case-sensitive: myVal and MyVal are different variables.",
      },
      {
        heading: "int — Whole Numbers",
        body: `An int (short for integer) holds whole numbers — no decimal point. This includes negative numbers, zero, and positive numbers.\n\nUse int when you're counting things, working with indices, or doing anything that doesn't need fractions.`,
        codeBlocks: [
          {
            label: "int examples",
            code: `int apples = 5\nint temperature = -10\nint score = 0\nint year = 2025\n\nprint("Apples:", apples)\nprint("Temperature:", temperature)`,
          },
        ],
        tip: "If you try to store a decimal like 3.14 into an int, EVL will truncate (cut off) the decimal part, giving you 3.",
      },
      {
        heading: "float — Decimal Numbers",
        body: `A float (short for floating-point number) holds numbers with a decimal point. This is what you use for measurements, prices, averages, scientific values, and anything that needs precision.`,
        codeBlocks: [
          {
            label: "float examples",
            code: `float price = 9.99\nfloat pi = 3.14159\nfloat gravity = 9.81\nfloat temperature = -3.5\n\nprint("Price: $", price)\nprint("Gravity:", gravity)`,
          },
        ],
        note: "float numbers always need a decimal point in EVL. '20' is an int, but '20.0' is a float.",
      },
      {
        heading: "const — Values That Never Change",
        body: `Sometimes you have a value that should never change during your program — like the number of days in a week, or a configuration value. Using const declares it as immutable (unchangeable).\n\nThis protects you from accidentally overwriting important values and makes your code's intent clear.`,
        codeBlocks: [
          {
            label: "const examples",
            code: `const int MAX_PLAYERS = 4\nconst float TAX_RATE = 0.15\nconst int VERSION = 1\n\nprint("Max players:", MAX_PLAYERS)\nprint("Tax rate:", TAX_RATE)`,
          },
        ],
        note: "By convention, constant names are written in ALL_CAPS. This makes them visually distinct and signals to anyone reading your code that this value is fixed.",
      },
    ],
  },
  {
    id: "constants",
    title: "Built-in Constants",
    subtitle: "PI, DAYS_IN_WEEK, HOURS_IN_DAY, YEAR",
    description: "EVL ships with ready-to-use mathematical and time constants.",
    difficulty: "Beginner",
    icon: <Star size={16} />,
    accentColor: "#fb923c",
    topics: ["PI", "DAYS_IN_WEEK", "HOURS_IN_DAY", "YEAR"],
    sections: [
      {
        heading: "What are Built-in Constants?",
        body: `EVL comes with a set of pre-defined constants you can use at any time without declaring them yourself. They represent commonly needed values so you don't have to memorise or hardcode them.\n\nThink of them as cheat codes EVL gives you for free.`,
        tip: "Built-in constants always start with a capital letter. They're available everywhere in your program.",
      },
      {
        heading: "PI — The Mathematical Constant",
        body: `PI (π) is one of the most famous numbers in mathematics. It's the ratio of a circle's circumference to its diameter — approximately 3.14159.\n\nYou'll use PI whenever you're working with circles, rotations, waves, or trigonometry.`,
        codeBlocks: [
          {
            label: "Using PI",
            code: `float radius = 5.0\nfloat area = PI * radius * radius\nfloat circumference = 2 * PI * radius\n\nprint("Circle area:", area)\nprint("Circumference:", circumference)`,
          },
        ],
        note: "PI stores the value 3.14159265... EVL handles the precision for you.",
      },
      {
        heading: "DAYS_IN_WEEK, HOURS_IN_DAY, YEAR",
        body: `These time-related constants make your code more readable and self-documenting. Instead of writing '7' and hoping readers understand it means days-in-a-week, you use the constant name — the intent is crystal clear.`,
        codeBlocks: [
          {
            label: "Time constants in use",
            code: `int daysInWeek = DAYS_IN_WEEK       // 7\nint hoursInDay = HOURS_IN_DAY       // 24\nint currentYear = YEAR              // Current year\n\nint hoursInWeek = DAYS_IN_WEEK * HOURS_IN_DAY\nprint("Hours in a week:", hoursInWeek)\nprint("Current year:", currentYear)`,
          },
        ],
        tip: "Using named constants instead of 'magic numbers' (unexplained raw values) makes code much easier to understand and maintain.",
      },
    ],
  },
  {
    id: "operators",
    title: "Operators & Expressions",
    subtitle: "+, -, *, /, %, and order of operations",
    description:
      "Perform calculations and understand how EVL evaluates expressions.",
    difficulty: "Beginner",
    icon: <Calculator size={16} />,
    accentColor: "#f472b6",
    topics: ["Arithmetic", "Modulus", "PEMDAS/BODMAS", "Assignment"],
    sections: [
      {
        heading: "Arithmetic Operators",
        body: `EVL supports all the standard math operations you learned in school. Each operator works on two values and produces a result.`,
        codeBlocks: [
          {
            label: "All arithmetic operators",
            code: `int a = 20\nint b = 6\n\nint sum = a + b       // 26 — addition\nint diff = a - b      // 14 — subtraction\nint product = a * b   // 120 — multiplication\nint quotient = a / b  // 3 — integer division (no decimal)\nint remainder = a % b // 2 — modulus (remainder after division)\n\nprint("Sum:", sum)\nprint("Remainder:", remainder)`,
          },
        ],
        note: "When you divide two ints, EVL performs integer division — the decimal is dropped. 20 / 6 = 3, not 3.33. Use floats if you need the decimal.",
      },
      {
        heading: "Modulus — The Remainder Operator",
        body: `The % (modulus) operator gives you the remainder after division. It's more useful than it sounds!\n\nCommon uses: checking if a number is even or odd, cycling through values, calculating time (e.g., minutes from total seconds).`,
        codeBlocks: [
          {
            label: "Modulus in practice",
            code: `int totalSeconds = 500\nint minutes = totalSeconds / 60   // 8\nint seconds = totalSeconds % 60   // 20  (500 - 8*60 = 20)\n\nprint("Time:", minutes)\nprint("Seconds left:", seconds)\n\n// Check even or odd\nint number = 7\nint isOdd = number % 2   // 1 means odd, 0 means even\nprint("Is odd (1=yes, 0=no):", isOdd)`,
          },
        ],
      },
      {
        heading: "Order of Operations",
        body: `Just like in school mathematics, EVL follows PEMDAS/BODMAS — multiplication and division happen before addition and subtraction. Use parentheses to control the order.\n\nThis is the same as real math, so no surprises!`,
        codeBlocks: [
          {
            label: "Order of operations",
            code: `// Without parentheses — follows PEMDAS\nint result1 = 20 + 40 * 40    // = 20 + 1600 = 1620\n\n// With parentheses — grouped first\nint result2 = (20 + 40) * 40  // = 60 * 40 = 2400\n\nprint("Without parens:", result1)  // 1620\nprint("With parens:", result2)     // 2400`,
          },
        ],
        tip: "When in doubt, use parentheses! They make your intention clear and prevent calculation bugs.",
      },
    ],
  },
  {
    id: "functions",
    title: "Built-in Functions",
    subtitle: "pow, sqrt, min, max, round, cast",
    description:
      "EVL's powerful standard library of mathematical and conversion functions.",
    difficulty: "Intermediate",
    icon: <Zap size={16} />,
    accentColor: "#38bdf8",
    topics: ["pow", "sqrt", "min / max", "round", "cast"],
    sections: [
      {
        heading: "What is a Function?",
        body: `A function is a named operation that takes in one or more values (called arguments), does something with them, and gives back a result. Think of it like a machine — you put something in, and get something useful out.\n\nEVL provides several built-in functions so you don't have to write these from scratch.`,
      },
      {
        heading: "pow — Raise to a Power",
        body: `pow(base, exponent) raises a number to a given power. For example, pow(2, 8) means 2 to the power of 8, which equals 256.\n\nThis is useful in finance (compound interest), physics, graphics, and anywhere you need exponential growth.`,
        codeBlocks: [
          {
            label: "Using pow",
            code: `float square = pow(5, 2)    // 5² = 25.0\nfloat cube = pow(3, 3)      // 3³ = 27.0\nfloat growth = pow(2, 10)   // 2¹⁰ = 1024.0\n\nprint("5 squared:", square)\nprint("2 to the 10th:", growth)`,
          },
        ],
        note: "pow always returns a float, even if the result is a whole number.",
      },
      {
        heading: "sqrt — Square Root",
        body: `sqrt(number) finds the square root of a number — the value that, when multiplied by itself, equals the original number.\n\nFor example, sqrt(25) = 5 because 5 × 5 = 25. It's used heavily in geometry, physics, and graphics.`,
        codeBlocks: [
          {
            label: "Using sqrt",
            code: `int root = sqrt(25)       // 5\nint hypotenuse = sqrt(9 + 16)  // sqrt(25) = 5 — Pythagorean theorem!\n\nfloat distance = sqrt(pow(3, 2) + pow(4, 2))\nprint("Distance:", distance)   // 5.0`,
          },
        ],
      },
      {
        heading: "min and max — Smallest and Largest",
        body: `min(a, b) returns the smaller of two values. max(a, b) returns the larger. These save you from writing if-statements for simple comparisons.`,
        codeBlocks: [
          {
            label: "min and max",
            code: `int playerHealth = 85\nint maxHealth = 100\nint damage = 30\n\n// Health can't go below 0\nint newHealth = max(playerHealth - damage, 0)\nprint("Health after damage:", newHealth)   // 55\n\n// Cap at max health\nint healedHealth = min(newHealth + 10, maxHealth)\nprint("Health after heal:", healedHealth)  // 65`,
          },
        ],
        tip: "min and max are perfect for clamping values — ensuring a number stays within a valid range.",
      },
      {
        heading: "round — Rounding Decimals",
        body: `round(value) rounds a float to the nearest whole number, returning a float. Values at exactly .5 round up.`,
        codeBlocks: [
          {
            label: "round examples",
            code: `float a = round(4.3)    // 4.0\nfloat b = round(4.7)    // 5.0\nfloat c = round(4.5)    // 5.0 — .5 rounds up\nfloat d = round(-2.5)   // -2.0\n\nprint("Rounded 4.3:", a)\nprint("Rounded 4.7:", b)`,
          },
        ],
      },
      {
        heading: "cast — Explicit Type Conversion",
        body: `cast(value, type) converts a value from one type to another explicitly. While EVL does implicit conversion automatically in most cases, sometimes you want to be deliberate and clear about converting types.`,
        codeBlocks: [
          {
            label: "Using cast",
            code: `float y = 20.5\nconst int newVal = cast(y, int)  // Explicitly convert 20.5 → 20\n\nfloat price = 19.99\nint dollars = cast(price, int)   // 19 — decimal is dropped\n\nprint("Cast result:", newVal)    // 20\nprint("Dollars:", dollars)       // 19`,
          },
        ],
        note: "When casting a float to int, the decimal part is truncated (removed), NOT rounded. 19.99 becomes 19, not 20.",
      },
    ],
  },
  {
    id: "print",
    title: "Output with print",
    subtitle: "Displaying values and messages",
    description: "Learn how to output text and variable values to the console.",
    difficulty: "Beginner",
    icon: <Terminal size={16} />,
    accentColor: "#86efac",
    topics: ["print", "Strings", "Multiple values", "Formatting"],
    sections: [
      {
        heading: "The print Statement",
        body: `print is how your program communicates with the outside world — it displays text and values on the screen (or console). You can pass it a string message, a variable, or multiple values separated by commas.`,
        codeBlocks: [
          {
            label: "Basic printing",
            code: `print("Hello, World!")\n\nint score = 42\nprint("Your score:", score)\n\nfloat temp = 98.6\nprint("Temperature:", temp, "degrees")`,
          },
        ],
        tip: 'Strings in EVL are wrapped in double quotes ("). Everything inside the quotes is treated as text, including numbers — "42" is text, not a number.',
      },
      {
        heading: "Printing Multiple Values",
        body: `You can pass multiple values to print separated by commas. EVL will print them all on one line with spaces between them.`,
        codeBlocks: [
          {
            label: "Multiple values",
            code: `int x = 10\nint y = 20\nint sum = x + y\n\nprint("Sum of", x, "and", y, "is", sum)\n// Output: Sum of 10 and 20 is 30\n\nfloat g = 9.81\nprint("Gravity:", g, "m/s²")`,
          },
        ],
      },
    ],
  },
  {
    id: "error-handling",
    title: "Error Handling",
    subtitle: "try and catch",
    description:
      "Write robust code that handles errors gracefully instead of crashing.",
    difficulty: "Intermediate",
    icon: <Shield size={16} />,
    accentColor: "#f87171",
    topics: ["try", "catch", "Runtime Errors", "Safe Division"],
    sections: [
      {
        heading: "What is an Error?",
        body: `Some operations can go wrong at runtime — meaning the program is running fine, then hits something impossible. A classic example is dividing by zero, which is mathematically undefined.\n\nWithout error handling, your program would crash and stop entirely. With error handling, you can catch the problem and respond gracefully.`,
        note: "A runtime error is different from a syntax error. A syntax error is caught before your program runs (like a spelling mistake). A runtime error happens while the program is running.",
      },
      {
        heading: "try / catch Blocks",
        body: `EVL uses try and catch to handle errors. The code inside try is the risky operation. If it fails, execution jumps immediately to the catch block instead of crashing.`,
        codeBlocks: [
          {
            label: "Basic try/catch",
            code: `try {\n    int result = 100 / 0   // This would crash without try!\n    print("Result:", result)\n} catch {\n    print("Error: Division by zero!")\n}\n\nprint("Program continues running here")`,
          },
        ],
        tip: "The print statement after the try/catch block will still run — the program recovered from the error and keeps going!",
      },
      {
        heading: "When to Use try/catch",
        body: `Not every line of code needs to be wrapped in try/catch. Use it when you're performing an operation that could fail depending on input values — things like division, type conversions, or any operation where the input might be unexpected.`,
        codeBlocks: [
          {
            label: "Real-world example",
            code: `int numerator = 100\nint denominator = 0\n\ntry {\n    int safeResult = numerator / denominator\n    print("Result:", safeResult)\n} catch {\n    print("Cannot divide by zero — check your inputs!")\n}\n\n// Safe to continue here\nprint("Calculation attempt complete")`,
          },
        ],
        note: "In a real program, the denominator would come from user input or a calculation — you can't always predict if it will be zero.",
      },
    ],
  },
  {
    id: "advanced",
    title: "Putting it All Together",
    subtitle: "Real programs using everything",
    description:
      "Combine types, operators, functions, constants, and error handling into complete programs.",
    difficulty: "Advanced",
    icon: <Layers size={16} />,
    accentColor: "#a78bfa",
    topics: ["Mixed programs", "Best practices", "Readable code"],
    sections: [
      {
        heading: "A Complete EVL Program",
        body: `Let's build a real program that uses everything we've learned — variables, built-in constants, math functions, print, and error handling.`,
        codeBlocks: [
          {
            label: "Circle calculator",
            code: `// Circle Calculator in EVL\nconst int precision = 2\n\nfloat radius = 7.5\n\n// Area = π * r²\nfloat area = PI * pow(radius, 2)\nfloat rounded_area = round(area)\n\n// Circumference = 2π * r\nfloat circumference = 2 * PI * radius\n\nprint("Radius:", radius)\nprint("Area (approx):", rounded_area)\nprint("Circumference:", circumference)`,
          },
        ],
      },
      {
        heading: "Time Calculator",
        body: `Using the built-in time constants to do real calculations.`,
        codeBlocks: [
          {
            label: "Time program",
            code: `// How many hours are in a year?\nint hoursPerYear = DAYS_IN_WEEK * 52 * HOURS_IN_DAY\nprint("Hours in a year:", hoursPerYear)\n\n// How many minutes in a day?\nint minutesPerHour = 60\nint minutesPerDay = HOURS_IN_DAY * minutesPerHour\nprint("Minutes in a day:", minutesPerDay)\n\n// Safe time division with error handling\ntry {\n    int result = hoursPerYear / YEAR\n    print("Ratio hours/year:", result)\n} catch {\n    print("Error in time calculation")\n}`,
          },
        ],
      },
      {
        heading: "Physics: Free Fall",
        body: `Using floats, pow, and constants to model a physics problem.`,
        codeBlocks: [
          {
            label: "Free fall calculator",
            code: `// Distance fallen under gravity: d = ½ * g * t²\nfloat gravity = 9.81    // m/s²\nfloat time = 3.0        // seconds\n\nfloat distance = 0.5 * gravity * pow(time, 2)\nfloat velocity = gravity * time\n\nprint("Time:", time, "s")\nprint("Distance fallen:", distance, "m")\nprint("Final velocity:", velocity, "m/s")\n\n// Round for a clean output\nfloat neatDist = round(distance)\nprint("Approx distance:", neatDist, "m")`,
          },
        ],
        tip: "Notice how readable the code is because of named variables. Anyone can understand what this program does without a single comment.",
      },
    ],
  },
];

// ─────────────────────────────────────────────
// SECTION ACCORDION
// ─────────────────────────────────────────────
function SectionBlock({ section }: { section: Section }) {
  const [open, setOpen] = useState(true);

  return (
    <Box
      border="1px solid #1e1e2e"
      borderRadius="10px"
      overflow="hidden"
      mb="12px"
    >
      <Flex
        align="center"
        justify="space-between"
        px="20px"
        py="14px"
        bg="#0d0d14"
        cursor="pointer"
        onClick={() => setOpen((v) => !v)}
        _hover={{ bg: "#111118" }}
        transition="background 0.15s"
      >
        <Text
          fontFamily="'Courier New', monospace"
          fontSize="14px"
          fontWeight="700"
          color="#d4d4e8"
        >
          {section.heading}
        </Text>
        <Box color="#3a3a5e">
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </Box>
      </Flex>

      {open && (
        <Box px="20px" py="16px" bg="#07070b">
          {section.body.split("\n").map((line, i) =>
            line === "" ? (
              <Box key={i} h="8px" />
            ) : (
              <Text
                key={i}
                fontSize="13px"
                color="#8a8a9a"
                lineHeight="1.8"
                mb="4px"
              >
                {line}
              </Text>
            ),
          )}

          {section.note && <NoteBox text={section.note} type="note" />}
          {section.tip && <NoteBox text={section.tip} type="tip" />}

          {section.codeBlocks?.map((cb, i) => (
            <EVLCode key={i} code={cb.code} label={cb.label} />
          ))}
        </Box>
      )}
    </Box>
  );
}

// ─────────────────────────────────────────────
// LESSON DETAIL VIEW
// ─────────────────────────────────────────────
function LessonView({
  lesson,
  onBack,
  onOpenInEditor,
}: {
  lesson: Lesson;
  onBack: () => void;
  onOpenInEditor: (lesson: Lesson) => void;
}) {
  const diff = DIFF_COLORS[lesson.difficulty];

  return (
    <Flex h="100%" overflow="hidden" bg="#0a0a0f">
      {/* Sidebar nav */}
      <Box
        w="220px"
        flexShrink={0}
        bg="#07070b"
        borderRight="1px solid #1a1a28"
        p="20px 16px"
        overflow="auto"
      >
        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#4a4a6e",
            fontSize: "11px",
            fontFamily: "monospace",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0",
            marginBottom: "20px",
            letterSpacing: "0.05em",
          }}
        >
          ← BACK
        </button>

        <Text
          fontSize="10px"
          color="#3a3a5e"
          fontFamily="monospace"
          letterSpacing="0.1em"
          mb="12px"
        >
          ON THIS PAGE
        </Text>

        {lesson.sections.map((s, i) => (
          <Text
            key={i}
            fontSize="11.5px"
            color="#4a4a6e"
            fontFamily="monospace"
            mb="10px"
            cursor="pointer"
            lineHeight="1.5"
            _hover={{ color: lesson.accentColor }}
            transition="color 0.15s"
          >
            {s.heading}
          </Text>
        ))}

        <Box h="1px" bg="#1a1a28" my="20px" />

        <Text
          fontSize="10px"
          color="#3a3a5e"
          fontFamily="monospace"
          letterSpacing="0.1em"
          mb="10px"
        >
          TOPICS
        </Text>
        {lesson.topics.map((t) => (
          <Box
            key={t}
            px="8px"
            py="4px"
            mb="4px"
            bg="#0d0d14"
            border="1px solid #1a1a28"
            borderRadius="4px"
          >
            <Text fontSize="10.5px" color="#3a3a5e" fontFamily="monospace">
              {t}
            </Text>
          </Box>
        ))}
      </Box>

      {/* Content */}
      <Box flex="1" overflow="auto" p="32px 40px">
        {/* Header */}
        <Flex justify="space-between" align="flex-start" mb="6px">
          <Box>
            <Flex align="center" gap="8px" mb="6px">
              <Box color={lesson.accentColor}>{lesson.icon}</Box>
              <Text
                fontSize="10px"
                color={lesson.accentColor}
                fontFamily="monospace"
                letterSpacing="0.12em"
                fontWeight="700"
              >
                EVL — {lesson.subtitle.toUpperCase()}
              </Text>
              <Text
                fontSize="10px"
                fontWeight="600"
                color={diff.color}
                bg={diff.bg}
                border="1px solid"
                borderColor={diff.border}
                px="8px"
                py="2px"
                borderRadius="4px"
                letterSpacing="0.06em"
              >
                {lesson.difficulty.toUpperCase()}
              </Text>
            </Flex>
            <Text
              fontSize="26px"
              fontWeight="800"
              color="#e2e2e8"
              fontFamily="'Courier New', monospace"
              letterSpacing="-0.03em"
              lineHeight="1.2"
            >
              {lesson.title}
            </Text>
          </Box>

          <button
            onClick={() => onOpenInEditor(lesson)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              background: `rgba(${lesson.accentColor === "#38bdf8" ? "56,189,248" : "251,146,60"},0.08)`,
              border: `1px solid ${lesson.accentColor}33`,
              borderRadius: "8px",
              color: lesson.accentColor,
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              letterSpacing: "0.04em",
              fontFamily: "monospace",
              flexShrink: 0,
              transition: "all 0.2s",
            }}
          >
            <Code2 size={13} />
            Try in Editor
            <ArrowRight size={12} />
          </button>
        </Flex>

        <Text fontSize="13px" color="#5a5a7a" mb="28px" lineHeight="1.6">
          {lesson.description}
        </Text>

        {/* Sections */}
        {lesson.sections.map((s, i) => (
          <SectionBlock key={i} section={s} />
        ))}
      </Box>
    </Flex>
  );
}

// ─────────────────────────────────────────────
// LESSON CARD
// ─────────────────────────────────────────────
function LessonCard({
  lesson,
  onClick,
}: {
  lesson: Lesson;
  onClick: () => void;
}) {
  const diff = DIFF_COLORS[lesson.difficulty];

  return (
    <Box
      bg="#0a0a0f"
      border="1px solid #1a1a28"
      borderRadius="12px"
      p="22px"
      cursor="pointer"
      transition="all 0.2s ease"
      onClick={onClick}
      role="button"
      position="relative"
      overflow="hidden"
      _hover={{
        borderColor: `${lesson.accentColor}44`,
        transform: "translateY(-3px)",
        boxShadow: `0 8px 32px ${lesson.accentColor}10`,
      }}
    >
      {/* Accent glow */}
      <Box
        position="absolute"
        top="-20px"
        right="-20px"
        w="80px"
        h="80px"
        borderRadius="50%"
        bg={lesson.accentColor}
        opacity={0.03}
        filter="blur(20px)"
      />

      {/* Header */}
      <Flex justify="space-between" align="flex-start" mb="12px">
        <Box
          p="7px"
          bg={`${lesson.accentColor}10`}
          border={`1px solid ${lesson.accentColor}22`}
          borderRadius="7px"
          color={lesson.accentColor}
        >
          {lesson.icon}
        </Box>
        <Text
          fontSize="10px"
          fontWeight="600"
          color={diff.color}
          bg={diff.bg}
          border="1px solid"
          borderColor={diff.border}
          px="8px"
          py="2px"
          borderRadius="4px"
          letterSpacing="0.06em"
        >
          {lesson.difficulty.toUpperCase()}
        </Text>
      </Flex>

      <Text
        fontSize="10px"
        color={lesson.accentColor}
        fontFamily="monospace"
        letterSpacing="0.1em"
        fontWeight="700"
        mb="4px"
      >
        {lesson.subtitle.toUpperCase()}
      </Text>

      <Text
        fontSize="15px"
        fontWeight="700"
        color="#d4d4e8"
        mb="8px"
        fontFamily="'Courier New', monospace"
        letterSpacing="-0.01em"
      >
        {lesson.title}
      </Text>
      <Text fontSize="12.5px" color="#4a4a6a" mb="16px" lineHeight="1.6">
        {lesson.description}
      </Text>

      {/* Topics */}
      <Flex gap="4px" wrap="wrap" mb="18px">
        {lesson.topics.slice(0, 4).map((t) => (
          <Text
            key={t}
            fontSize="10px"
            color="#3a3a5a"
            bg="#0d0d14"
            border="1px solid #1a1a28"
            px="7px"
            py="2px"
            borderRadius="3px"
            fontFamily="monospace"
          >
            {t}
          </Text>
        ))}
        {lesson.topics.length > 4 && (
          <Text
            fontSize="10px"
            color="#3a3a5a"
            px="4px"
            py="2px"
            fontFamily="monospace"
          >
            +{lesson.topics.length - 4} more
          </Text>
        )}
      </Flex>

      <Flex align="center" gap="4px" color="#3a3a5a">
        <Text fontSize="11.5px" fontFamily="monospace">
          Start lesson
        </Text>
        <ChevronRight size={12} />
      </Flex>
    </Box>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export const LearnPage = () => {
  const navigate = useNavigate();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const openInEditor = (lesson: Lesson) => {
    const firstCode =
      lesson.sections.find((s) => s.codeBlocks?.length)?.codeBlocks?.[0]
        ?.code ?? "";
    navigate("/", { state: { code: firstCode, language: "evl" } });
  };

  // ── Lesson detail ──
  if (selectedLesson) {
    return (
      <LessonView
        lesson={selectedLesson}
        onBack={() => setSelectedLesson(null)}
        onOpenInEditor={openInEditor}
      />
    );
  }

  // ── Grid ──
  const beginnerLessons = LESSONS.filter((l) => l.difficulty === "Beginner");
  const intermediateLessons = LESSONS.filter(
    (l) => l.difficulty === "Intermediate",
  );
  const advancedLessons = LESSONS.filter((l) => l.difficulty === "Advanced");

  return (
    <Box h="100%" overflow="auto" bg="#0a0a0f">
      {/* Hero */}
      <Box
        px="40px"
        pt="40px"
        pb="32px"
        borderBottom="1px solid #1a1a28"
        position="relative"
        overflow="hidden"
      >
        {/* Background grid decoration */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          opacity={0.03}
          backgroundImage="linear-gradient(#fb923c 1px, transparent 1px), linear-gradient(90deg, #fb923c 1px, transparent 1px)"
          backgroundSize="32px 32px"
          pointerEvents="none"
        />

        <Flex align="center" gap="8px" mb="14px">
          <Box
            px="10px"
            py="4px"
            bg="rgba(251,146,60,0.08)"
            border="1px solid rgba(251,146,60,0.2)"
            borderRadius="5px"
          >
            <Flex align="center" gap="6px">
              <Cpu size={11} color="#fb923c" />
              <Text
                fontSize="10px"
                color="#fb923c"
                fontFamily="monospace"
                letterSpacing="0.12em"
                fontWeight="700"
              >
                EVL LANGUAGE
              </Text>
            </Flex>
          </Box>
          <Box w="4px" h="4px" borderRadius="50%" bg="#2a2a3e" />
          <Text fontSize="10px" color="#3a3a5e" fontFamily="monospace">
            Beginner Friendly
          </Text>
        </Flex>

        <Text
          fontSize="32px"
          fontWeight="800"
          color="#e2e2e8"
          fontFamily="'Courier New', monospace"
          letterSpacing="-0.03em"
          lineHeight="1.15"
          mb="10px"
        >
          Learn EVL
        </Text>

        <Text
          fontSize="14px"
          color="#4a4a6a"
          mb="24px"
          maxW="560px"
          lineHeight="1.7"
        >
          A complete guide to the EVL programming language — from your very
          first variable to error handling and beyond. Every lesson is designed
          for beginners with real examples and clear explanations.
        </Text>

        {/* Quick-reference token strip */}
        <Flex gap="8px" wrap="wrap">
          {[
            { label: "int", color: "#c084fc" },
            { label: "float", color: "#c084fc" },
            { label: "const", color: "#c084fc" },
            { label: "print()", color: "#c084fc" },
            { label: "pow()", color: "#38bdf8" },
            { label: "sqrt()", color: "#38bdf8" },
            { label: "min() max()", color: "#38bdf8" },
            { label: "round()", color: "#38bdf8" },
            { label: "cast()", color: "#38bdf8" },
            { label: "try / catch", color: "#f87171" },
            { label: "PI", color: "#fb923c" },
            { label: "DAYS_IN_WEEK", color: "#fb923c" },
          ].map((item) => (
            <Box
              key={item.label}
              px="9px"
              py="4px"
              bg="#0d0d14"
              border="1px solid #1a1a28"
              borderRadius="4px"
            >
              <Text
                fontSize="10.5px"
                color={item.color}
                fontFamily="'JetBrains Mono', monospace"
                fontWeight="600"
              >
                {item.label}
              </Text>
            </Box>
          ))}
        </Flex>
      </Box>

      {/* Lessons */}
      <Box px="40px" py="32px">
        {/* Beginner */}
        <Flex align="center" gap="10px" mb="16px">
          <Box w="3px" h="14px" bg="#4ade80" borderRadius="2px" />
          <Text
            fontSize="11px"
            fontWeight="700"
            color="#4ade80"
            fontFamily="monospace"
            letterSpacing="0.1em"
          >
            BEGINNER
          </Text>
          <Text fontSize="11px" color="#2a2a3e" fontFamily="monospace">
            {beginnerLessons.length} lessons
          </Text>
        </Flex>
        <Grid
          templateColumns="repeat(auto-fill, minmax(290px, 1fr))"
          gap="14px"
          mb="36px"
        >
          {beginnerLessons.map((l) => (
            <LessonCard
              key={l.id}
              lesson={l}
              onClick={() => setSelectedLesson(l)}
            />
          ))}
        </Grid>

        {/* Intermediate */}
        <Flex align="center" gap="10px" mb="16px">
          <Box w="3px" h="14px" bg="#facc15" borderRadius="2px" />
          <Text
            fontSize="11px"
            fontWeight="700"
            color="#facc15"
            fontFamily="monospace"
            letterSpacing="0.1em"
          >
            INTERMEDIATE
          </Text>
          <Text fontSize="11px" color="#2a2a3e" fontFamily="monospace">
            {intermediateLessons.length} lessons
          </Text>
        </Flex>
        <Grid
          templateColumns="repeat(auto-fill, minmax(290px, 1fr))"
          gap="14px"
          mb="36px"
        >
          {intermediateLessons.map((l) => (
            <LessonCard
              key={l.id}
              lesson={l}
              onClick={() => setSelectedLesson(l)}
            />
          ))}
        </Grid>

        {/* Advanced */}
        <Flex align="center" gap="10px" mb="16px">
          <Box w="3px" h="14px" bg="#f87171" borderRadius="2px" />
          <Text
            fontSize="11px"
            fontWeight="700"
            color="#f87171"
            fontFamily="monospace"
            letterSpacing="0.1em"
          >
            ADVANCED
          </Text>
          <Text fontSize="11px" color="#2a2a3e" fontFamily="monospace">
            {advancedLessons.length} lessons
          </Text>
        </Flex>
        <Grid
          templateColumns="repeat(auto-fill, minmax(290px, 1fr))"
          gap="14px"
          mb="36px"
        >
          {advancedLessons.map((l) => (
            <LessonCard
              key={l.id}
              lesson={l}
              onClick={() => setSelectedLesson(l)}
            />
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default LearnPage;
