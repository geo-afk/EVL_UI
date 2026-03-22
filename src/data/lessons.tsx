import {
  Star,
  Hash,
  Calculator,
  Zap,
  Terminal,
  Shield,
  Layers,
  GitBranch,
  RefreshCw,
  ToggleLeft,
  Type,
  PlusCircle,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface CodeBlock {
  label?: string;
  code: string;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;      // 0-based index
  explanation: string;
}

export interface Section {
  heading: string;
  body: string;
  codeBlocks?: CodeBlock[];
  note?: string;
  tip?: string;
  warn?: string;
  quiz?: QuizQuestion[];
}

export interface Lesson {
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

// ─── Lessons ─────────────────────────────────────────────────────────────────
export const LESSONS: Lesson[] = [
  // ── 01 ──────────────────────────────────────────────────────────────────────
  {
    id: "intro",
    title: "Welcome to EVAL",
    subtitle: "Your first steps",
    description: "What EVAL is, how it works, and why weak typing makes it flexible and beginner-friendly.",
    difficulty: "Beginner",
    icon: <Star size={16} />,
    accentColor: "#c084fc",
    topics: ["Overview", "Weak Typing", "Implicit Conversion", "Comments"],
    sections: [
      {
        heading: "What is EVAL?",
        body: `EVAL is a statically-typed, weakly-typed programming language designed for clarity and ease of learning. You declare what type your variable is, but EVAL is smart enough to convert between compatible types automatically when needed — this is called implicit conversion.\n\nThink of it like a calculator: you can add an integer (3) and a decimal number (2.5) and it just works — you don't have to do anything special.`,
        note: "Statically-typed means you write the type (int, float, etc.) when creating a variable. Weakly-typed means EVAL can bend those types when it makes sense for an operation.",
        quiz: [
          {
            q: "EVAL is described as 'weakly-typed'. What does this mean?",
            options: [
              "You never need to declare variable types",
              "EVAL can automatically convert between compatible types when needed",
              "All variables are stored as strings internally",
              "You must cast every value manually before using it",
            ],
            correct: 1,
            explanation: "Weak typing means EVAL handles implicit conversion automatically — e.g. adding an int and a float just works without you doing anything special.",
          },
          {
            q: "Which pair of terms correctly describes EVAL's type system?",
            options: [
              "Dynamically-typed and strongly-typed",
              "Statically-typed and strongly-typed",
              "Statically-typed and weakly-typed",
              "Dynamically-typed and weakly-typed",
            ],
            correct: 2,
            explanation: "EVAL is statically-typed (you declare types when creating variables) and weakly-typed (compatible types can be used together with automatic conversion).",
          },
        ],
      },
      {
        heading: "Your First EVAL Program",
        body: `Every EVAL program is a series of statements. The simplest thing you can do is store a value and print it.`,
        codeBlocks: [
          {
            label: "Hello, EVAL",
            code: `int x = 10\nfloat y = 20.5\nint sum = x + y  // Implicit conversion happens here\nprint("Sum:", sum)`,
          },
        ],
        tip: "EVAL adds x (an int) and y (a float). The result is automatically treated as an int for storage in 'sum'. This is weak typing in action!",
        quiz: [
          {
            q: "What does `print(\"Sum:\", sum)` do in EVAL?",
            options: [
              "Stores the text \"Sum:\" into the variable sum",
              "Displays the text \"Sum:\" followed by the value of sum",
              "Creates a new variable called Sum",
              "Calculates sum and discards the result",
            ],
            correct: 1,
            explanation: "print() outputs its arguments to the console. Here it prints the string \"Sum:\" and then the current value of the variable sum, separated by a space.",
          },
        ],
      },
      {
        heading: "Comments",
        body: `Comments are notes you leave in your code. EVAL ignores them entirely — they're just for humans reading the code.\n\nEVAL supports two comment styles:`,
        codeBlocks: [
          {
            label: "Comment styles",
            code: `// This is a single-line comment\n\n/* This is a\n   multi-line comment */\n\nint age = 25  // You can also put comments at the end of a line`,
          },
        ],
        note: "Good comments explain WHY you did something, not WHAT the code does (the code itself shows what).",
        quiz: [
          {
            q: "Which of the following is a valid single-line comment in EVAL?",
            options: [
              "# This is a comment",
              "-- This is a comment",
              "// This is a comment",
              "<!-- This is a comment -->",
            ],
            correct: 2,
            explanation: "EVAL uses // for single-line comments, just like JavaScript and Java. The # and -- styles belong to other languages.",
          },
          {
            q: "What happens to comments when EVAL runs your program?",
            options: [
              "They are printed to the output",
              "They cause a syntax error if too long",
              "They are stored in memory for debugging",
              "They are completely ignored by EVAL",
            ],
            correct: 3,
            explanation: "Comments are purely for humans reading the code. EVAL skips them entirely during execution — they have zero effect on how the program runs.",
          },
        ],
      },
    ],
  },

  // ── 02 ──────────────────────────────────────────────────────────────────────
  {
    id: "types",
    title: "Variables & Types",
    subtitle: "int, float, string, bool, const",
    description: "Understand all four primitive types and how to use immutable constants.",
    difficulty: "Beginner",
    icon: <Hash size={16} />,
    accentColor: "#38bdf8",
    topics: ["int", "float", "string", "bool", "const", "null", "Naming Rules"],
    sections: [
      {
        heading: "What is a Variable?",
        body: `A variable is like a labelled box that holds a value. You give the box a name, and you can look inside it or replace what's in it any time.\n\nIn EVAL, before you create a variable you must declare its type — what kind of value it will hold. This helps EVAL catch mistakes early.`,
        note: "Variable names can contain letters, numbers, and underscores, but must START with a letter or underscore. They are case-sensitive: myVal and MyVal are different variables.",
        quiz: [
          {
            q: "Which of these is a valid EVAL variable name?",
            options: [
              "2score",
              "my-value",
              "_totalCount",
              "float",
            ],
            correct: 2,
            explanation: "_totalCount is valid — it starts with an underscore and contains only letters, numbers, and underscores. 2score starts with a digit, my-value contains a hyphen, and float is a reserved keyword.",
          },
        ],
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
        tip: "If you store a decimal like 3.14 into an int, EVAL will truncate (cut off) the decimal part, giving you 3.",
        quiz: [
          {
            q: "What value is stored if you write `int x = 7.9` in EVAL?",
            options: ["7.9", "8 (rounded up)", "7 (truncated)", "An error is thrown"],
            correct: 2,
            explanation: "EVAL truncates (cuts off) the decimal part when storing a decimal into an int. 7.9 becomes 7, not 8 — it does NOT round.",
          },
        ],
      },
      {
        heading: "float — Decimal Numbers",
        body: `A float (short for floating-point number) holds numbers with a decimal point. This is what you use for measurements, prices, averages, scientific values, and anything that needs precision.`,
        codeBlocks: [
          {
            label: "float examples",
            code: `float price = 9.99\nfloat pi = 3.14159\nfloat gravity = 9.81\nfloat temp = -3.5\n\nprint("Price: $", price)\nprint("Gravity:", gravity)`,
          },
        ],
        note: "float numbers always need a decimal point in EVAL. '20' is an int, but '20.0' is a float.",
        quiz: [
          {
            q: "Which of these declarations creates a float in EVAL?",
            options: [
              "float x = 10",
              "float x = 10.0",
              "int x = 10.0",
              "number x = 10.5",
            ],
            correct: 1,
            explanation: "float x = 10.0 is correct — float literals must include a decimal point. Writing 10 without a point is an integer literal, and 'number' is not a valid EVAL type.",
          },
        ],
      },
      {
        heading: "string — Text Values",
        body: `A string holds text — any sequence of characters wrapped in double quotes. You can store names, messages, labels, or any kind of textual data in a string variable.\n\nStrings can contain letters, numbers, spaces, punctuation — basically anything you'd type.`,
        codeBlocks: [
          {
            label: "string examples",
            code: `string name = "Alice"\nstring greeting = "Hello, World!"\nstring version = "EVAL v1.0"\n\nprint("Name:", name)\nprint(greeting)\nprint("Running:", version)`,
          },
        ],
        tip: "String literals in EVAL use double quotes. You can also use escape sequences like \\n for a newline inside the string.",
        quiz: [
          {
            q: "How do you declare a string variable called `name` with the value Alice in EVAL?",
            options: [
              "string name = Alice",
              "str name = 'Alice'",
              "string name = \"Alice\"",
              "text name = \"Alice\"",
            ],
            correct: 2,
            explanation: "EVAL strings use the 'string' keyword and double quotes around the value. Single quotes are not valid in EVAL, and 'str' / 'text' are not valid type keywords.",
          },
        ],
      },
      {
        heading: "bool — True or False",
        body: `A bool (short for boolean) holds exactly one of two values: true or false. Booleans are the backbone of decision making — every if statement and every while loop depends on a bool condition.\n\nYou'll use bools constantly once you start writing control flow.`,
        codeBlocks: [
          {
            label: "bool examples",
            code: `bool isLoggedIn = true\nbool hasError = false\nbool isAdult = true\n\nprint("Logged in:", isLoggedIn)\nprint("Error:", hasError)`,
          },
        ],
        note: "true and false are keywords in EVAL — they must be lowercase. TRUE and True are not valid boolean literals.",
        quiz: [
          {
            q: "Which of these correctly declares a boolean in EVAL?",
            options: [
              "bool active = True",
              "boolean active = true",
              "bool active = true",
              "bool active = 1",
            ],
            correct: 2,
            explanation: "bool is the correct type keyword, and the literal must be lowercase true or false. 'boolean' is Java-style, 'True' with a capital is Python-style, and 1 is an integer — none of those work in EVAL.",
          },
        ],
      },
      {
        heading: "const — Values That Never Change",
        body: `Sometimes you have a value that should never change during your program — like the number of days in a week, or a configuration value. Using const declares it as immutable (unchangeable).\n\nThis protects you from accidentally overwriting important values and makes your code's intent clear.`,
        codeBlocks: [
          {
            label: "const examples",
            code: `const int MAX_PLAYERS = 4\nconst float TAX_RATE = 0.15\nconst bool DEBUG_MODE = false\nconst string APP_NAME = "MyApp"\n\nprint("Max players:", MAX_PLAYERS)\nprint("App:", APP_NAME)`,
          },
        ],
        note: "By convention, constant names are written in ALL_CAPS. This makes them visually distinct and signals to anyone reading your code that this value is fixed.",
        quiz: [
          {
            q: "What happens if you try to change the value of a const variable after declaring it?",
            options: [
              "EVAL silently ignores the change",
              "The variable is automatically converted to a regular variable",
              "EVAL produces an error — const values cannot be reassigned",
              "The new value replaces the old one normally",
            ],
            correct: 2,
            explanation: "const declares a variable as immutable — it cannot be reassigned after its initial declaration. EVAL will produce an error if you try to change it.",
          },
        ],
      },
      {
        heading: "null — The Absence of a Value",
        body: `null represents the intentional absence of a value. It's a special literal that means "this variable has no value right now".\n\nIn EVAL, null can be compared to any variable to check whether it has been assigned a meaningful value.`,
        codeBlocks: [
          {
            label: "null usage",
            code: `int result = null  // No value yet\n\n// You can check for null in conditions\nbool hasValue = result != null\nprint("Has value:", hasValue)  // false`,
          },
        ],
        warn: "Be careful with null — trying to use a null value in arithmetic or other operations will cause a runtime error. Always check for null before using a variable that might not have a value.",
        quiz: [
          {
            q: "What does `null` represent in EVAL?",
            options: [
              "The number zero",
              "An empty string \"\"",
              "The intentional absence of a value",
              "A false boolean",
            ],
            correct: 2,
            explanation: "null means 'no value has been assigned'. It is completely different from 0, \"\", or false — those are all real values. null specifically signals the absence of any value.",
          },
        ],
      },
    ],
  },

  // ── 03 ──────────────────────────────────────────────────────────────────────
  {
    id: "operators",
    title: "Operators & Expressions",
    subtitle: "+, -, *, /, %, ++ -- and compound assignment",
    description: "Perform calculations, use shorthand operators, and understand how EVAL evaluates expressions.",
    difficulty: "Beginner",
    icon: <Calculator size={16} />,
    accentColor: "#f472b6",
    topics: ["Arithmetic", "Modulus", "++/--", "+=, -=, *=, /=", "PEMDAS"],
    sections: [
      {
        heading: "Arithmetic Operators",
        body: `EVAL supports all the standard math operations you learned in school. Each operator works on two values and produces a result.`,
        codeBlocks: [
          {
            label: "All arithmetic operators",
            code: `int a = 20\nint b = 6\n\nint sum       = a + b   // 26 — addition\nint diff      = a - b   // 14 — subtraction\nint product   = a * b   // 120 — multiplication\nint quotient  = a / b   // 3  — integer division\nint remainder = a % b   // 2  — modulus\n\nprint("Sum:", sum)\nprint("Remainder:", remainder)`,
          },
        ],
        note: "When you divide two ints, EVAL performs integer division — the decimal is dropped. 20 / 6 = 3, not 3.33. Use floats if you need the decimal.",
        quiz: [
          {
            q: "What is the result of `int result = 20 / 6` in EVAL?",
            options: ["3.33", "3", "4", "An error"],
            correct: 1,
            explanation: "When dividing two integers in EVAL, the result is also an integer — the decimal part is dropped. 20 / 6 = 3.333..., which becomes 3 after truncation.",
          },
        ],
      },
      {
        heading: "Increment & Decrement (++ and --)",
        body: `EVAL provides shorthand operators to add 1 or subtract 1 from a variable. These are incredibly common — you'll see them in loops and counters all the time.\n\n++  adds 1 to the variable\n--  subtracts 1 from the variable`,
        codeBlocks: [
          {
            label: "Using ++ and --",
            code: `int counter = 0\ncounter++       // counter is now 1\ncounter++       // counter is now 2\ncounter++       // counter is now 3\n\nprint("Count:", counter)   // 3\n\ncounter--       // counter is now 2\nprint("After --:", counter)  // 2`,
          },
        ],
        tip: "Think of counter++ as a shorthand for counter = counter + 1. They do exactly the same thing — ++ is just faster to type!",
        quiz: [
          {
            q: "If `int x = 5`, what is the value of x after `x--`?",
            options: ["6", "5", "4", "-5"],
            correct: 2,
            explanation: "x-- subtracts 1 from x. So 5 - 1 = 4. The -- operator is shorthand for x = x - 1.",
          },
        ],
      },
      {
        heading: "Compound Assignment Operators",
        body: `Compound assignment operators combine arithmetic with assignment. Instead of writing x = x + 5, you can write x += 5. They're shorter and often clearer when updating a variable.\n\n  +=  add and assign\n  -=  subtract and assign\n  *=  multiply and assign\n  /=  divide and assign`,
        codeBlocks: [
          {
            label: "Compound assignment examples",
            code: `int score = 100\n\nscore += 50   // score = 100 + 50 = 150\nprint("After += 50:", score)    // 150\n\nscore -= 30   // score = 150 - 30 = 120\nprint("After -= 30:", score)    // 120\n\nscore *= 2    // score = 120 * 2 = 240\nprint("After *= 2:", score)     // 240\n\nscore /= 4    // score = 240 / 4 = 60\nprint("After /= 4:", score)     // 60`,
          },
        ],
        note: "These operators work with both int and float variables. They're especially useful inside loops where you need to accumulate or scale values.",
        quiz: [
          {
            q: "If `int score = 100`, what is score after `score *= 2` then `score -= 50`?",
            options: ["150", "200", "250", "100"],
            correct: 0,
            explanation: "First score *= 2: 100 × 2 = 200. Then score -= 50: 200 - 50 = 150. Compound operators apply in sequence.",
          },
        ],
      },
      {
        heading: "Modulus — The Remainder Operator",
        body: `The % (modulus) operator gives you the remainder after division. It's more useful than it looks!\n\nCommon uses: checking if a number is even or odd, cycling through values, calculating time (e.g., minutes from total seconds).`,
        codeBlocks: [
          {
            label: "Modulus in practice",
            code: `int totalSeconds = 500\nint minutes = totalSeconds / 60   // 8\nint seconds = totalSeconds % 60   // 20\n\nprint("Minutes:", minutes)\nprint("Seconds remaining:", seconds)\n\n// Check even or odd\nint number = 7\nint isOdd = number % 2   // 1 = odd, 0 = even\nprint("Is odd (1=yes):", isOdd)`,
          },
        ],
        quiz: [
          {
            q: "What does `17 % 5` evaluate to?",
            options: ["3", "2", "4", "1"],
            correct: 1,
            explanation: "17 divided by 5 is 3 remainder 2. The % operator returns only the remainder — so 17 % 5 = 2.",
          },
          {
            q: "How would you check if a number `n` is even using the modulus operator?",
            options: [
              "n % 2 == 1",
              "n / 2 == 0",
              "n % 2 == 0",
              "n - 2 == 0",
            ],
            correct: 2,
            explanation: "An even number divided by 2 leaves no remainder. So n % 2 == 0 is true for even numbers, and n % 2 == 1 is true for odd numbers.",
          },
        ],
      },
      {
        heading: "Order of Operations",
        body: `Just like in school mathematics, EVAL follows PEMDAS/BODMAS — multiplication and division happen before addition and subtraction. Use parentheses to control the order.\n\nThis is the same as real math, so no surprises!`,
        codeBlocks: [
          {
            label: "Order of operations",
            code: `// Without parentheses — follows PEMDAS\nint result1 = 20 + 40 * 40    // = 20 + 1600 = 1620\n\n// With parentheses — grouped first\nint result2 = (20 + 40) * 40  // = 60 * 40 = 2400\n\nprint("Without parens:", result1)  // 1620\nprint("With parens:", result2)     // 2400`,
          },
        ],
        tip: "When in doubt, use parentheses! They make your intention clear and prevent calculation bugs.",
        quiz: [
          {
            q: "What is the value of `2 + 3 * 4` in EVAL?",
            options: ["20", "14", "24", "10"],
            correct: 1,
            explanation: "Multiplication happens before addition (PEMDAS). So 3 * 4 = 12 is evaluated first, then 2 + 12 = 14.",
          },
          {
            q: "How do you make addition happen before multiplication?",
            options: [
              "Use the + operator twice",
              "Wrap the addition in parentheses: (2 + 3) * 4",
              "EVAL always evaluates left to right",
              "You cannot change the order of operations",
            ],
            correct: 1,
            explanation: "Parentheses override the default operator precedence. (2 + 3) * 4 = 5 * 4 = 20, because the parenthesised expression is evaluated first.",
          },
        ],
      },
    ],
  },

  // ── 04 ──────────────────────────────────────────────────────────────────────
  {
    id: "logical",
    title: "Logical Operators",
    subtitle: "&&, ||, ! and comparison operators",
    description: "Combine conditions, negate values, and make complex decisions with boolean logic.",
    difficulty: "Beginner",
    icon: <ToggleLeft size={16} />,
    accentColor: "#a78bfa",
    topics: ["&&  AND", "||  OR", "!  NOT", "==, !=", "<, >, <=, >="],
    sections: [
      {
        heading: "Comparison Operators",
        body: `Comparison operators compare two values and produce a boolean result — either true or false. You'll use these inside conditions for if statements and while loops.`,
        codeBlocks: [
          {
            label: "All comparison operators",
            code: `int a = 10\nint b = 20\n\nbool eq  = a == b   // false — equal to\nbool neq = a != b   // true  — not equal to\nbool lt  = a < b    // true  — less than\nbool gt  = a > b    // false — greater than\nbool lte = a <= b   // true  — less than or equal\nbool gte = a >= b   // false — greater than or equal\n\nprint("a equals b:", eq)\nprint("a less than b:", lt)`,
          },
        ],
        note: "= is assignment (set a value). == is comparison (check if two values are equal). Mixing these up is a very common beginner mistake!",
        quiz: [
          {
            q: "What is the difference between `=` and `==` in EVAL?",
            options: [
              "They are interchangeable",
              "= assigns a value; == checks if two values are equal",
              "= compares values; == assigns a value",
              "== is used only for strings",
            ],
            correct: 1,
            explanation: "= is the assignment operator (int x = 5 stores 5 in x). == is the equality comparison operator (x == 5 returns true or false). Mixing them up is one of the most common bugs in programming.",
          },
          {
            q: "If `int a = 10` and `int b = 10`, what does `a != b` return?",
            options: ["true", "false", "0", "An error"],
            correct: 1,
            explanation: "!= means 'not equal to'. Since a and b both equal 10, they ARE equal, so a != b is false.",
          },
        ],
      },
      {
        heading: "&& — Logical AND",
        body: `The && operator returns true only if BOTH conditions on its left and right are true. If either one is false, the whole expression is false.\n\nThink of it like needing TWO keys to open a lock — both keys must be present.`,
        codeBlocks: [
          {
            label: "AND operator",
            code: `int age = 25\nbool hasTicket = true\n\n// Both must be true to enter\nbool canEnter = age >= 18 && hasTicket\nprint("Can enter:", canEnter)   // true\n\nbool hasPass = false\nbool alsoCanEnter = age >= 18 && hasPass\nprint("Can enter (no pass):", alsoCanEnter)   // false`,
          },
        ],
        quiz: [
          {
            q: "When does `a && b` return true?",
            options: [
              "When either a or b is true",
              "Only when both a and b are true",
              "Only when a is true",
              "When a is false and b is true",
            ],
            correct: 1,
            explanation: "&& (AND) requires BOTH sides to be true. If either side is false, the whole expression is false.",
          },
          {
            q: "What does `true && false` evaluate to?",
            options: ["true", "false", "null", "An error"],
            correct: 1,
            explanation: "Because one side (false) is not true, && returns false. Both sides must be true for && to return true.",
          },
        ],
      },
      {
        heading: "|| — Logical OR",
        body: `The || operator returns true if AT LEAST ONE of the conditions is true. It only returns false when BOTH sides are false.\n\nThink of it like a door with two switches — either switch can open it.`,
        codeBlocks: [
          {
            label: "OR operator",
            code: `bool isAdmin = false\nbool isOwner = true\n\n// Either role grants access\nbool hasAccess = isAdmin || isOwner\nprint("Has access:", hasAccess)   // true\n\nbool isAdmin2 = false\nbool isOwner2 = false\nbool noAccess = isAdmin2 || isOwner2\nprint("Has access:", noAccess)    // false`,
          },
        ],
        tip: "|| is very useful for 'fallback' logic — accept input A or input B, whichever is available.",
        quiz: [
          {
            q: "When does `a || b` return false?",
            options: [
              "When both a and b are false",
              "When both a and b are true",
              "When only a is true",
              "When only b is false",
            ],
            correct: 0,
            explanation: "|| (OR) only returns false when BOTH sides are false. If at least one side is true, || returns true.",
          },
          {
            q: "What does `false || true` evaluate to?",
            options: ["false", "true", "null", "An error"],
            correct: 1,
            explanation: "|| returns true if at least one side is true. Here the right side is true, so the whole expression is true.",
          },
        ],
      },
      {
        heading: "! — Logical NOT",
        body: `The ! (exclamation mark) operator flips a boolean value. true becomes false, and false becomes true. It's used to invert a condition.\n\nPlaced immediately before the value or expression you want to negate.`,
        codeBlocks: [
          {
            label: "NOT operator",
            code: `bool isLoading = false\nbool isDone = !isLoading   // true — NOT false = true\n\nbool hasError = true\nbool isOk = !hasError      // false — NOT true = false\n\nprint("Is done:", isDone)\nprint("Is ok:", isOk)`,
          },
        ],
        note: "! binds very tightly — !x > 5 means (!x) > 5, not !(x > 5). Use parentheses: !(x > 5) to negate the whole condition.",
        quiz: [
          {
            q: "If `bool isReady = false`, what is `!isReady`?",
            options: ["false", "true", "0", "null"],
            correct: 1,
            explanation: "! flips the boolean. !false = true. The NOT operator always inverts the value.",
          },
          {
            q: "What does `!(5 > 3)` evaluate to?",
            options: ["true", "false", "2", "An error"],
            correct: 1,
            explanation: "First 5 > 3 evaluates to true (5 is greater than 3). Then ! flips it: !true = false.",
          },
        ],
      },
      {
        heading: "Combining Logical Operators",
        body: `You can chain multiple logical operators to create complex conditions. Use parentheses to group conditions and control evaluation order.\n\nThis is where conditions become really powerful!`,
        codeBlocks: [
          {
            label: "Complex conditions",
            code: `int score = 85\nbool submitted = true\nbool isPassing = score >= 60\n\n// Passes if submitted AND score is passing\nbool passedCourse = submitted && isPassing\nprint("Passed:", passedCourse)   // true\n\nint extraCredit = 5\nbool aBStudent = score >= 80 || score + extraCredit >= 80\nprint("B student:", aBStudent)   // true`,
          },
        ],
        quiz: [
          {
            q: "What is the result of `true && false || true`?",
            options: ["false", "true", "An error", "null"],
            correct: 1,
            explanation: "&& has higher precedence than ||. So this evaluates as (true && false) || true = false || true = true.",
          },
          {
            q: "Which condition checks that score is between 60 and 90 (inclusive)?",
            options: [
              "score >= 60 || score <= 90",
              "score >= 60 && score <= 90",
              "score > 60 && score < 90",
              "score == 60 || score == 90",
            ],
            correct: 1,
            explanation: "You need BOTH conditions to be true simultaneously — score must be at least 60 AND at most 90. That requires &&, not ||.",
          },
        ],
      },
    ],
  },

  // ── 05 ──────────────────────────────────────────────────────────────────────
  {
    id: "if-else",
    title: "Conditionals: if / else",
    subtitle: "Making decisions in code",
    description: "Branch your program's execution based on conditions with if, else if, and else.",
    difficulty: "Beginner",
    icon: <GitBranch size={16} />,
    accentColor: "#34d399",
    topics: ["if", "else", "else if", "Nesting", "Boolean Conditions"],
    sections: [
      {
        heading: "What is an if Statement?",
        body: `An if statement lets your program make a decision. It evaluates a condition — an expression that produces true or false — and runs its block of code only if the condition is true.\n\nThis is the most fundamental way to add decision-making to your programs.`,
        codeBlocks: [
          {
            label: "Basic if",
            code: `int temperature = 32\n\nif (temperature <= 0) {\n    print("It's freezing!")\n}\n\nprint("Check complete")   // always runs`,
          },
        ],
        note: "The condition inside if (...) must be wrapped in parentheses. The code block runs only when the condition is true.",
        quiz: [
          {
            q: "When does the code inside an `if` block run?",
            options: [
              "Always, every time the program runs",
              "Only when the condition is true",
              "Only when the condition is false",
              "Only once at the start of the program",
            ],
            correct: 1,
            explanation: "The code inside an if block runs only when its condition evaluates to true. If the condition is false, the entire block is skipped.",
          },
        ],
      },
      {
        heading: "if / else — Two Paths",
        body: `An else block runs when the if condition is false. Together, if and else cover both possible outcomes — the code always takes one of the two paths.`,
        codeBlocks: [
          {
            label: "if / else",
            code: `int score = 72\n\nif (score >= 60) {\n    print("You passed!")\n} else {\n    print("You failed. Try again.")\n}\n\n// No matter what score is, exactly one branch runs`,
          },
        ],
        tip: "The else branch does NOT have a condition — it runs whenever the if condition is false. Only one branch ever runs.",
        quiz: [
          {
            q: "In an if/else block, how many branches can run for a single condition?",
            options: ["Both branches always run", "Neither branch runs", "Exactly one branch runs", "It depends on the value"],
            correct: 2,
            explanation: "Exactly one branch always runs — either the if block (when condition is true) or the else block (when condition is false). They are mutually exclusive.",
          },
          {
            q: "Does the `else` block have its own condition in EVAL?",
            options: [
              "Yes, it has a required condition",
              "No — else runs whenever the if condition is false",
              "Yes, but the condition is optional",
              "else is only used with else if",
            ],
            correct: 1,
            explanation: "The else block has no condition. It automatically runs when the if condition is false. Only else if has its own condition.",
          },
        ],
      },
      {
        heading: "else if — Multiple Paths",
        body: `When you have more than two possible outcomes, use else if to chain additional conditions. EVAL checks them from top to bottom and runs the first one that is true.`,
        codeBlocks: [
          {
            label: "Grade classifier",
            code: `int score = 85\n\nif (score >= 90) {\n    print("Grade: A")\n} else if (score >= 80) {\n    print("Grade: B")   // This branch runs\n} else if (score >= 70) {\n    print("Grade: C")\n} else if (score >= 60) {\n    print("Grade: D")\n} else {\n    print("Grade: F")\n}`,
          },
        ],
        note: "EVAL stops checking once a matching condition is found — it will not run multiple else if blocks even if several conditions are true.",
        quiz: [
          {
            q: "If score = 85 and the chain checks >= 90, >= 80, >= 70 in order, which branch runs?",
            options: ["Both >= 80 and >= 70", ">= 90", ">= 80", ">= 70"],
            correct: 2,
            explanation: "EVAL checks top to bottom and stops at the first true condition. 85 is not >= 90, but it IS >= 80, so that branch runs and the rest are skipped.",
          },
          {
            q: "What is the purpose of `else if` compared to a separate `if`?",
            options: [
              "They are identical — no difference",
              "else if only runs if the previous condition was false, making branches mutually exclusive",
              "else if runs after the previous if regardless of its result",
              "else if can only be used once per chain",
            ],
            correct: 1,
            explanation: "else if is chained — it only checks its condition if all previous conditions were false. A separate if statement always checks its condition independently.",
          },
        ],
      },
      {
        heading: "Nested if Statements",
        body: `You can put an if statement inside another if statement — this is called nesting. This lets you check multiple independent conditions in sequence.`,
        codeBlocks: [
          {
            label: "Nested conditions",
            code: `int age = 20\nbool hasId = true\n\nif (age >= 18) {\n    if (hasId) {\n        print("Welcome in!")\n    } else {\n        print("Need to show ID")\n    }\n} else {\n    print("Sorry, you must be 18+")\n}`,
          },
        ],
        tip: "When nesting gets deep (3+ levels), it's usually a sign to rethink the logic. Try using && or || to combine conditions instead.",
        quiz: [
          {
            q: "In the age/ID example, what prints if age = 20 and hasId = false?",
            options: [
              "Welcome in!",
              "Need to show ID",
              "Sorry, you must be 18+",
              "Nothing prints",
            ],
            correct: 1,
            explanation: "age = 20 passes the outer check (>= 18), so we enter the outer if. Inside, hasId = false, so the inner else runs and prints 'Need to show ID'.",
          },
        ],
      },
      {
        heading: "Conditions with Logical Operators",
        body: `You can use && and || directly inside if conditions to create compound checks without nesting.`,
        codeBlocks: [
          {
            label: "Combined conditions",
            code: `int speed = 85\nbool inSchoolZone = true\n\n// Compound AND condition\nif (speed > 30 && inSchoolZone) {\n    print("WARNING: Speeding in school zone!")\n}\n\nbool isWeekend = true\nbool isHoliday = false\n\n// Compound OR condition\nif (isWeekend || isHoliday) {\n    print("Office is closed today")\n}`,
          },
        ],
        quiz: [
          {
            q: "What does this print if speed = 25 and inSchoolZone = true?\n`if (speed > 30 && inSchoolZone) { print(\"Warning\") }`",
            options: [
              "Warning",
              "Nothing — the condition is false",
              "An error occurs",
              "Warning is printed twice",
            ],
            correct: 1,
            explanation: "speed > 30 is false (25 is not greater than 30). With &&, both sides must be true. Since the left side is false, the whole condition is false and nothing prints.",
          },
          {
            q: "Which is better style for 'must be over 18 AND have a licence'?",
            options: [
              "if (age > 18) { if (hasLicence) { ... } }",
              "if (age > 18 && hasLicence) { ... }",
              "if (age > 18 || hasLicence) { ... }",
              "if (age > 18) { } if (hasLicence) { }",
            ],
            correct: 1,
            explanation: "Combining with && in a single condition is cleaner and more readable than nesting two if statements. It also correctly expresses that BOTH conditions must be true simultaneously.",
          },
        ],
      },
    ],
  },

  // ── 06 ──────────────────────────────────────────────────────────────────────
  {
    id: "while",
    title: "While Loops",
    subtitle: "Repeating code with while, break, continue",
    description: "Execute a block of code repeatedly as long as a condition remains true.",
    difficulty: "Intermediate",
    icon: <RefreshCw size={16} />,
    accentColor: "#facc15",
    topics: ["while", "break", "continue", "Counters", "Infinite Loop Warning"],
    sections: [
      {
        heading: "What is a Loop?",
        body: `A loop lets you run the same block of code multiple times without rewriting it. The while loop keeps running as long as its condition stays true.\n\nOnce the condition becomes false, the loop ends and the program continues with the next statement.`,
        codeBlocks: [
          {
            label: "Basic while loop",
            code: `int count = 1\n\nwhile (count <= 5) {\n    print("Count:", count)\n    count++\n}\n\nprint("Done!")`,
          },
        ],
        note: "The condition is checked BEFORE each iteration. If the condition is already false when the loop starts, the body never runs at all.",
        quiz: [
          {
            q: "When does a `while` loop stop running?",
            options: [
              "After a fixed number of iterations",
              "When the condition becomes false",
              "After it runs once",
              "When print() is called inside it",
            ],
            correct: 1,
            explanation: "A while loop keeps executing its body as long as the condition remains true. As soon as the condition evaluates to false, the loop stops and execution continues after it.",
          },
          {
            q: "If `while (count <= 5)` starts with count = 1, how many times does the body run?",
            options: ["4", "5", "6", "1"],
            correct: 1,
            explanation: "The body runs for count = 1, 2, 3, 4, 5 — five times. When count reaches 6, the condition 6 <= 5 is false, so the loop stops.",
          },
        ],
      },
      {
        heading: "Countdown with while",
        body: `Loops don't have to count up — you can count down, or step by any amount. The key is that the loop variable must change each iteration so the condition eventually becomes false.`,
        codeBlocks: [
          {
            label: "Countdown timer",
            code: `int seconds = 10\n\nwhile (seconds > 0) {\n    print("T-minus:", seconds)\n    seconds--\n}\n\nprint("Blast off! 🚀")`,
          },
        ],
        tip: "Notice how seconds-- changes the loop variable every iteration. Without this, the loop would run forever!",
        quiz: [
          {
            q: "What is the danger of forgetting to update the loop variable inside a while loop?",
            options: [
              "The loop runs zero times",
              "The condition is never checked",
              "The loop runs forever (infinite loop)",
              "EVAL throws an error immediately",
            ],
            correct: 2,
            explanation: "If the loop variable never changes, the condition never becomes false and the loop runs forever — freezing the program. Always make sure something inside the loop moves it toward the exit condition.",
          },
          {
            q: "Starting with `int seconds = 3`, how many times does `while (seconds > 0) { seconds-- }` run?",
            options: ["2", "3", "4", "0"],
            correct: 1,
            explanation: "seconds starts at 3. The loop runs at 3 (→2), at 2 (→1), at 1 (→0). When seconds = 0, the condition 0 > 0 is false, so it stops. Three iterations total.",
          },
        ],
      },
      {
        heading: "break — Exit the Loop Early",
        body: `The break statement immediately stops the loop and jumps to the code after it — even if the while condition is still true.\n\nUseful when you've found what you were looking for and don't need to keep looping.`,
        codeBlocks: [
          {
            label: "Using break",
            code: `int number = 1\n\nwhile (number <= 100) {\n    if (number == 7) {\n        print("Found 7! Stopping.")\n        break   // Exit the loop immediately\n    }\n    print("Checking:", number)\n    number++\n}\n\nprint("Search complete")`,
          },
        ],
        quiz: [
          {
            q: "After `break` executes, where does the program continue?",
            options: [
              "Back to the top of the loop",
              "At the next iteration of the loop",
              "At the code immediately after the loop",
              "At the beginning of the program",
            ],
            correct: 2,
            explanation: "break immediately exits the entire loop. Execution jumps to the first statement after the closing } of the while block — in the example, that's `print(\"Search complete\")`.",
          },
          {
            q: "In the number example, does `print(\"Search complete\")` ever run?",
            options: [
              "No — break stops the whole program",
              "Yes — it always runs after the loop, whether break was used or not",
              "Only if number never equals 7",
              "Only if the loop finishes without break",
            ],
            correct: 1,
            explanation: "break only exits the loop — not the program. Code after the loop always runs. `print(\"Search complete\")` runs regardless of whether break was triggered.",
          },
        ],
      },
      {
        heading: "continue — Skip to Next Iteration",
        body: `The continue statement skips the rest of the current iteration and jumps straight back to the while condition check — without stopping the loop.\n\nUseful for skipping certain values while still processing the rest.`,
        codeBlocks: [
          {
            label: "Skipping even numbers",
            code: `int i = 0\n\nwhile (i < 10) {\n    i++\n    if (i % 2 == 0) {\n        continue   // Skip even numbers\n    }\n    print("Odd:", i)   // Only prints 1, 3, 5, 7, 9\n}`,
          },
        ],
        tip: "The difference: break exits the loop entirely. continue only skips the current iteration and checks the condition again.",
        quiz: [
          {
            q: "What does `continue` do inside a while loop?",
            options: [
              "Stops the loop immediately",
              "Exits the entire program",
              "Skips the rest of the current iteration and re-checks the condition",
              "Jumps to the next line after the loop",
            ],
            correct: 2,
            explanation: "continue skips any remaining code in the current iteration and goes back to the while condition check. The loop itself keeps running — only that one iteration is cut short.",
          },
          {
            q: "What is the key difference between `break` and `continue`?",
            options: [
              "break skips one iteration; continue exits the loop",
              "break exits the loop entirely; continue only skips the current iteration",
              "They do the same thing",
              "continue exits the program; break exits the loop",
            ],
            correct: 1,
            explanation: "break exits the loop completely — no more iterations. continue only skips the rest of the current iteration; the loop continues checking the condition and running the next one.",
          },
        ],
      },
      {
        heading: "Accumulator Pattern",
        body: `A very common loop pattern is accumulating a result — adding values up, multiplying, or building something incrementally across iterations.`,
        codeBlocks: [
          {
            label: "Sum 1 to 10",
            code: `int sum = 0\nint n = 1\n\nwhile (n <= 10) {\n    sum += n   // Accumulate: add n to running total\n    n++\n}\n\nprint("Sum of 1 to 10:", sum)   // 55`,
          },
        ],
        warn: "Always make sure your loop variable changes in a way that eventually makes the condition false. An infinite loop will freeze your program!",
        quiz: [
          {
            q: "Why must `sum` be initialised to 0 before the accumulator loop?",
            options: [
              "EVAL requires all variables to start at 0",
              "So the first addition starts from a known baseline of zero",
              "Otherwise the loop won't run",
              "0 is a reserved value in EVAL",
            ],
            correct: 1,
            explanation: "sum needs to start at 0 so the first `sum += n` adds n to zero, giving n. Starting from a wrong value would corrupt every result.",
          },
          {
            q: "What is the value of `sum` after accumulating 1 + 2 + 3 + 4 + 5?",
            options: ["10", "15", "25", "5"],
            correct: 1,
            explanation: "1 + 2 + 3 + 4 + 5 = 15. The accumulator adds each iteration's value to the running total.",
          },
        ],
      },
    ],
  },

  // ── 07 ──────────────────────────────────────────────────────────────────────
  {
    id: "constants",
    title: "Built-in Constants",
    subtitle: "PI, DAYS_IN_WEEK, HOURS_IN_DAY, YEAR",
    description: "EVAL ships with ready-to-use mathematical and time constants you can use anywhere.",
    difficulty: "Beginner",
    icon: <Star size={16} />,
    accentColor: "#fb923c",
    topics: ["PI", "DAYS_IN_WEEK", "HOURS_IN_DAY", "YEAR"],
    sections: [
      {
        heading: "What are Built-in Constants?",
        body: `EVAL comes with a set of pre-defined constants you can use at any time without declaring them yourself. They represent commonly needed values so you don't have to memorise or hardcode them.\n\nThink of them as cheat codes EVAL gives you for free.`,
        tip: "Built-in constants are written in ALL_CAPS. They're available everywhere in your program — no import needed.",
        quiz: [
          {
            q: "What is the advantage of using `DAYS_IN_WEEK` instead of the number `7` directly in your code?",
            options: [
              "It runs faster",
              "It makes the code more readable and self-documenting",
              "It uses less memory",
              "EVAL requires it",
            ],
            correct: 1,
            explanation: "Using named constants instead of unexplained 'magic numbers' makes your intent crystal clear to anyone reading the code. DAYS_IN_WEEK is immediately understandable; a bare 7 is not.",
          },
        ],
      },
      {
        heading: "PI — The Mathematical Constant",
        body: `PI (π) is one of the most famous numbers in mathematics — approximately 3.14159265...\n\nYou'll use PI whenever you're working with circles, rotations, waves, or trigonometry.`,
        codeBlocks: [
          {
            label: "Using PI",
            code: `float radius = 5.0\nfloat area = PI * radius * radius\nfloat circumference = 2 * PI * radius\n\nprint("Circle area:", area)\nprint("Circumference:", circumference)`,
          },
        ],
        note: "PI stores the value 3.14159265... EVAL handles the precision for you.",
        quiz: [
          {
            q: "Which formula correctly calculates the area of a circle with radius `r` using EVAL?",
            options: [
              "float area = 2 * PI * r",
              "float area = PI * r * r",
              "float area = PI + r * r",
              "float area = PI / r * r",
            ],
            correct: 1,
            explanation: "Area of a circle = π × r². In EVAL that's PI * r * r (or pow(r, 2)). The formula 2 * PI * r is the circumference, not the area.",
          },
        ],
      },
      {
        heading: "DAYS_IN_WEEK, HOURS_IN_DAY, YEAR",
        body: `These time-related constants make your code more readable and self-documenting. Instead of writing '7' and hoping readers understand it means days-in-a-week, you use the constant name — the intent is crystal clear.`,
        codeBlocks: [
          {
            label: "Time constants in use",
            code: `int daysInWeek  = DAYS_IN_WEEK    // 7\nint hoursInDay  = HOURS_IN_DAY    // 24\nint currentYear = YEAR            // Current year\n\nint hoursInWeek = DAYS_IN_WEEK * HOURS_IN_DAY\nprint("Hours in a week:", hoursInWeek)   // 168\n\nint daysInYear = DAYS_IN_WEEK * 52\nprint("Days in a year (approx):", daysInYear)`,
          },
        ],
        tip: "Using named constants instead of 'magic numbers' (unexplained raw values) makes code much easier to understand and maintain.",
        quiz: [
          {
            q: "What does `DAYS_IN_WEEK * HOURS_IN_DAY` evaluate to?",
            options: ["31", "168", "24", "52"],
            correct: 1,
            explanation: "DAYS_IN_WEEK = 7, HOURS_IN_DAY = 24. 7 × 24 = 168 hours in a week.",
          },
          {
            q: "Do you need to declare DAYS_IN_WEEK before using it in your program?",
            options: [
              "Yes, you must declare it as const int DAYS_IN_WEEK = 7",
              "No — it is a built-in constant available everywhere automatically",
              "Yes, but only for the first use",
              "Only if you import the math library",
            ],
            correct: 1,
            explanation: "Built-in constants like DAYS_IN_WEEK, HOURS_IN_DAY, YEAR, and PI are pre-defined by EVAL. You can use them anywhere without declaring them yourself.",
          },
        ],
      },
    ],
  },

  // ── 08 ──────────────────────────────────────────────────────────────────────
  {
    id: "functions",
    title: "Built-in Functions",
    subtitle: "pow, sqrt, abs, min, max, round, cast",
    description: "EVAL's powerful standard library of mathematical and type conversion functions.",
    difficulty: "Intermediate",
    icon: <Zap size={16} />,
    accentColor: "#38bdf8",
    topics: ["pow", "sqrt", "abs", "min / max", "round", "cast"],
    sections: [
      {
        heading: "What is a Function?",
        body: `A function is a named operation that takes one or more values (called arguments), does something with them, and gives back a result. Think of it like a machine — you put something in, and get something useful out.\n\nEVAL provides several built-in functions so you don't have to write these from scratch.`,
        quiz: [
          {
            q: "What is an 'argument' in the context of a function?",
            options: [
              "A variable declared inside a function",
              "A value passed into a function for it to work with",
              "The result returned by a function",
              "A type of error",
            ],
            correct: 1,
            explanation: "An argument (also called a parameter) is the value you pass into a function. For example, in pow(2, 8), the arguments are 2 and 8 — the values the function works with.",
          },
        ],
      },
      {
        heading: "pow — Raise to a Power",
        body: `pow(base, exponent) raises a number to a given power.\n\nFor example, pow(2, 8) means 2 to the power of 8, which equals 256. This is useful in finance (compound interest), physics, graphics, and anywhere you need exponential calculations.`,
        codeBlocks: [
          {
            label: "Using pow",
            code: `float square = pow(5, 2)    // 5² = 25.0\nfloat cube   = pow(3, 3)    // 3³ = 27.0\nfloat growth = pow(2, 10)   // 2¹⁰ = 1024.0\n\nprint("5 squared:", square)\nprint("2 to the 10th:", growth)`,
          },
        ],
        note: "pow always returns a float, even if the result is a whole number.",
        quiz: [
          {
            q: "What does `pow(3, 4)` return?",
            options: ["12.0", "81.0", "64.0", "7.0"],
            correct: 1,
            explanation: "pow(3, 4) means 3 to the power of 4: 3 × 3 × 3 × 3 = 81. pow always returns a float, so the result is 81.0.",
          },
          {
            q: "What type does `pow()` always return?",
            options: ["int", "bool", "float", "string"],
            correct: 2,
            explanation: "pow always returns a float, even when the result is a whole number like 25.0 or 1024.0.",
          },
        ],
      },
      {
        heading: "sqrt — Square Root",
        body: `sqrt(number) finds the square root of a number — the value that, when multiplied by itself, equals the original.\n\nFor example, sqrt(25) = 5 because 5 × 5 = 25. Used heavily in geometry, physics, and graphics.`,
        codeBlocks: [
          {
            label: "Using sqrt",
            code: `float root       = sqrt(25)          // 5.0\nfloat hypotenuse = sqrt(9 + 16)      // sqrt(25) = 5.0\n\n// Pythagorean theorem: a² + b² = c²\nfloat a = 3.0\nfloat b = 4.0\nfloat c = sqrt(pow(a, 2) + pow(b, 2))\nprint("Hypotenuse:", c)   // 5.0`,
          },
        ],
        quiz: [
          {
            q: "What does `sqrt(144)` return?",
            options: ["11.0", "12.0", "72.0", "14.0"],
            correct: 1,
            explanation: "The square root of 144 is 12, because 12 × 12 = 144.",
          },
          {
            q: "Using the Pythagorean theorem, what is `sqrt(pow(3,2) + pow(4,2))`?",
            options: ["7.0", "5.0", "25.0", "6.0"],
            correct: 1,
            explanation: "pow(3,2) = 9, pow(4,2) = 16. 9 + 16 = 25. sqrt(25) = 5.0. This is the classic 3-4-5 right triangle.",
          },
        ],
      },
      {
        heading: "abs — Absolute Value",
        body: `abs(number) returns the absolute value of a number — that is, it removes any negative sign. The result is always non-negative.\n\nUseful when you care about the magnitude (size) of a number but not its direction (sign).`,
        codeBlocks: [
          {
            label: "Using abs",
            code: `float a = abs(-42.5)   // 42.5\nfloat b = abs(17.0)    // 17.0 — positive stays positive\nfloat c = abs(-0.001)  // 0.001\n\n// Calculate distance between two points on a line\nfloat pos1 = 3.0\nfloat pos2 = 10.0\nfloat distance = abs(pos2 - pos1)\nprint("Distance:", distance)   // 7.0`,
          },
        ],
        tip: "abs is perfect for measuring differences where you don't know which value will be larger.",
        quiz: [
          {
            q: "What does `abs(-99.5)` return?",
            options: ["-99.5", "99.5", "0.0", "100.0"],
            correct: 1,
            explanation: "abs removes the negative sign. abs(-99.5) = 99.5. The result is always non-negative.",
          },
          {
            q: "Why is `abs(pos2 - pos1)` better than just `pos2 - pos1` for distance?",
            options: [
              "abs makes it run faster",
              "Without abs, the result could be negative if pos2 < pos1",
              "abs is required for float subtraction",
              "There is no difference",
            ],
            correct: 1,
            explanation: "Distance is always positive. If pos2 < pos1, pos2 - pos1 gives a negative number. abs() ensures the result is always non-negative regardless of which point is larger.",
          },
        ],
      },
      {
        heading: "min and max — Smallest and Largest",
        body: `min(a, b) returns the smaller of two values. max(a, b) returns the larger. These save you from writing if-statements for simple comparisons.`,
        codeBlocks: [
          {
            label: "min and max in a game",
            code: `int playerHealth = 85\nint maxHealth    = 100\nint damage       = 30\n\n// Health can't go below 0\nint newHealth = max(playerHealth - damage, 0)\nprint("After damage:", newHealth)    // 55\n\n// Cap at max health when healed\nint healed = min(newHealth + 60, maxHealth)\nprint("After healing:", healed)      // 100`,
          },
        ],
        tip: "min and max are perfect for clamping values — keeping a number inside a valid range.",
        quiz: [
          {
            q: "What does `max(playerHealth - damage, 0)` ensure when damage = 200 and playerHealth = 50?",
            options: [
              "Health becomes -150",
              "Health is clamped to 0 — it can't go below zero",
              "Health stays at 50",
              "An error is thrown",
            ],
            correct: 1,
            explanation: "50 - 200 = -150, but max(-150, 0) returns 0. max() prevents health from going negative by always choosing the larger of the two values.",
          },
          {
            q: "What does `min(value, 100)` do when value = 150?",
            options: ["Returns 150", "Returns 100", "Returns 50", "Returns 0"],
            correct: 1,
            explanation: "min returns the smaller of the two. min(150, 100) = 100. This is the 'cap at maximum' pattern — the value can never exceed 100.",
          },
        ],
      },
      {
        heading: "round — Rounding Decimals",
        body: `round(value) rounds a float to the nearest whole number, returning a float. Values at exactly .5 round up.`,
        codeBlocks: [
          {
            label: "round examples",
            code: `float a = round(4.3)    // 4.0\nfloat b = round(4.7)    // 5.0\nfloat c = round(4.5)    // 5.0 — .5 rounds up\nfloat d = round(-2.5)   // -2.0\n\nfloat average = 8.666\nfloat neat = round(average)\nprint("Rounded average:", neat)   // 9.0`,
          },
        ],
        quiz: [
          {
            q: "What does `round(4.5)` return?",
            options: ["4.0", "5.0", "4.5", "An error"],
            correct: 1,
            explanation: "Values at exactly .5 round UP in EVAL. So round(4.5) = 5.0.",
          },
          {
            q: "What type does `round()` return?",
            options: ["int", "float", "string", "bool"],
            correct: 1,
            explanation: "round() always returns a float, even though the decimal part becomes .0. Use cast() if you need an actual int from the rounded result.",
          },
        ],
      },
      {
        heading: "cast — Explicit Type Conversion",
        body: `cast(value, type) converts a value from one type to another explicitly. While EVAL does implicit conversion automatically in most cases, sometimes you want to be deliberate and clear.`,
        codeBlocks: [
          {
            label: "Using cast",
            code: `float y = 20.5\nconst int newVal = cast(y, int)  // 20.5 → 20\n\nfloat price = 19.99\nint dollars = cast(price, int)   // 19 — decimal dropped\n\nbool flag = true\nint numFlag = cast(flag, int)    // true → 1\n\nprint("Cast result:", newVal)\nprint("Dollars:", dollars)`,
          },
        ],
        note: "When casting a float to int, the decimal part is truncated (removed), NOT rounded. 19.99 becomes 19, not 20.",
        quiz: [
          {
            q: "What does `cast(9.99, int)` return?",
            options: ["10", "9", "9.99", "An error"],
            correct: 1,
            explanation: "cast truncates (does not round) when converting float to int. The decimal .99 is simply dropped, giving 9.",
          },
          {
            q: "What does `cast(true, int)` return?",
            options: ["0", "1", "true", "An error"],
            correct: 1,
            explanation: "In EVAL, true cast to int gives 1, and false cast to int gives 0. This is the boolean-to-integer convention.",
          },
        ],
      },
    ],
  },

  // ── 09 ──────────────────────────────────────────────────────────────────────
  {
    id: "print",
    title: "Output with print",
    subtitle: "Displaying values, strings, and mixed output",
    description: "Learn how to output text, variable values, and formatted messages to the console.",
    difficulty: "Beginner",
    icon: <Terminal size={16} />,
    accentColor: "#86efac",
    topics: ["print", "Strings", "Multiple values", "Mixing types"],
    sections: [
      {
        heading: "The print Statement",
        body: `print is how your program communicates with the outside world — it displays text and values on the screen. You can pass it a string message, a variable, or multiple values separated by commas.`,
        codeBlocks: [
          {
            label: "Basic printing",
            code: `print("Hello, World!")\n\nint score = 42\nprint("Your score:", score)\n\nfloat temp = 98.6\nprint("Temperature:", temp, "degrees")`,
          },
        ],
        tip: 'Strings in EVAL are wrapped in double quotes ("). Everything inside the quotes is treated as text.',
        quiz: [
          {
            q: "What does `print(\"Score:\", 42)` output?",
            options: [
              "Score:42",
              "Score: 42",
              "\"Score:\" 42",
              "An error — you can't mix strings and numbers",
            ],
            correct: 1,
            explanation: "print separates multiple arguments with a space. So print(\"Score:\", 42) outputs: Score: 42.",
          },
        ],
      },
      {
        heading: "Printing Multiple Values",
        body: `You can pass multiple values to print separated by commas. EVAL will display them all on one line with spaces between them — mix strings, ints, floats, and bools freely.`,
        codeBlocks: [
          {
            label: "Multiple values",
            code: `int x = 10\nint y = 20\nint sum = x + y\n\nprint("Sum of", x, "and", y, "is", sum)\n// Output: Sum of 10 and 20 is 30\n\nbool active = true\nstring status = "online"\nprint("Status:", status, "| Active:", active)`,
          },
        ],
        quiz: [
          {
            q: "What does `print(\"a\", 1, true)` output?",
            options: [
              "a1true",
              "a 1 true",
              "\"a\" 1 true",
              "An error — cannot mix types in print",
            ],
            correct: 1,
            explanation: "print places a space between each argument regardless of type. The output is: a 1 true. EVAL's print handles mixed types freely.",
          },
        ],
      },
      {
        heading: "Printing Results of Expressions",
        body: `You can print the result of any expression directly — you don't need to store it in a variable first.`,
        codeBlocks: [
          {
            label: "Inline expressions",
            code: `print("5 * 5 =", 5 * 5)         // 25\nprint("2 to the 8th:", pow(2, 8)) // 256.0\nprint("Is 7 odd:", 7 % 2 == 1)    // true\nprint("PI =", PI)`,
          },
        ],
        quiz: [
          {
            q: "What does `print(\"Result:\", 10 + 5 * 2)` output?",
            options: [
              "Result: 30",
              "Result: 20",
              "Result: 15",
              "Result: 10 + 5 * 2",
            ],
            correct: 1,
            explanation: "Multiplication has higher precedence: 5 * 2 = 10, then 10 + 10 = 20. So the output is: Result: 20.",
          },
          {
            q: "Do you need to store the result of `pow(2, 8)` in a variable before printing it?",
            options: [
              "Yes — you must always store results first",
              "No — you can pass expressions directly to print",
              "Only for float results",
              "Only if using built-in functions",
            ],
            correct: 1,
            explanation: "print accepts any expression as an argument. print(\"Result:\", pow(2, 8)) works perfectly — no intermediate variable needed.",
          },
        ],
      },
    ],
  },

  // ── 10 ──────────────────────────────────────────────────────────────────────
  {
    id: "error-handling",
    title: "Error Handling",
    subtitle: "try and catch",
    description: "Write robust code that handles runtime errors gracefully instead of crashing.",
    difficulty: "Intermediate",
    icon: <Shield size={16} />,
    accentColor: "#f87171",
    topics: ["try", "catch", "Runtime Errors", "Safe Division", "Recovery"],
    sections: [
      {
        heading: "What is a Runtime Error?",
        body: `Some operations can go wrong while your program is running — even if the code looks perfectly written. A classic example is dividing by zero, which is mathematically undefined.\n\nWithout error handling, your program would crash and stop entirely. With error handling, you can catch the problem and respond gracefully.`,
        note: "A runtime error is different from a syntax error. A syntax error is caught before your program runs (like a spelling mistake). A runtime error happens only while executing.",
        quiz: [
          {
            q: "What is the difference between a syntax error and a runtime error?",
            options: [
              "They are the same thing",
              "A syntax error happens while running; a runtime error is a typo",
              "A syntax error is caught before running; a runtime error happens during execution",
              "Runtime errors only occur in loops",
            ],
            correct: 2,
            explanation: "A syntax error (like a misspelling) is caught before the program runs. A runtime error happens while the program is executing — for example, dividing by zero at a specific moment.",
          },
        ],
      },
      {
        heading: "try / catch Blocks",
        body: `EVAL uses try and catch to handle errors. The code inside try is the risky operation. If it fails, execution jumps immediately to the catch block — the program does NOT crash.`,
        codeBlocks: [
          {
            label: "Basic try/catch",
            code: `try {\n    int result = 100 / 0   // Would crash without try!\n    print("Result:", result)\n} catch (err) {\n    print("Error caught:", err)\n}\n\nprint("Program continues running here")`,
          },
        ],
        tip: "The print statement after the try/catch block STILL runs — the program recovered from the error and keeps going!",
        quiz: [
          {
            q: "What happens when an error occurs inside a `try` block?",
            options: [
              "The program crashes immediately",
              "The rest of the try block is skipped and execution jumps to the catch block",
              "The error is silently ignored",
              "The try block runs again from the beginning",
            ],
            correct: 1,
            explanation: "When an error occurs in a try block, EVAL immediately stops executing the try block and jumps to the catch block. The program does not crash.",
          },
          {
            q: "Does code after the entire try/catch block still run?",
            options: [
              "No — the program stops after catch",
              "Only if no error occurred",
              "Yes — execution continues normally after the try/catch",
              "Only if the catch block is empty",
            ],
            correct: 2,
            explanation: "Code after the try/catch block always runs — that's the whole point. The try/catch recovers from the error and lets the program continue normally.",
          },
        ],
      },
      {
        heading: "Catching the Error Variable",
        body: `The catch block receives the error message in a variable — by convention named 'err' or 'e'. You can print it to understand what went wrong, or use it in your recovery logic.`,
        codeBlocks: [
          {
            label: "Using the error variable",
            code: `int numerator = 100\nint denominator = 0\n\ntry {\n    int safeResult = numerator / denominator\n    print("Result:", safeResult)\n} catch (err) {\n    print("Cannot proceed:", err)\n    print("Defaulting to 0")\n    int safeResult = 0\n    print("Safe result:", safeResult)\n}\n\nprint("Calculation attempt complete")`,
          },
        ],
        note: "In a real program, the denominator would come from user input or a calculation — you can't always predict if it will be zero.",
        quiz: [
          {
            q: "What does the variable `err` contain inside the catch block?",
            options: [
              "The line number where the error occurred",
              "A description of what went wrong",
              "The value that caused the error",
              "The name of the variable that failed",
            ],
            correct: 1,
            explanation: "The catch variable (named err by convention) contains a message describing what went wrong — for example 'division by zero'. You can print it or use it in your recovery logic.",
          },
        ],
      },
      {
        heading: "When to Use try/catch",
        body: `Not every line of code needs to be wrapped in try/catch. Use it when you're performing an operation that COULD fail depending on input values — division, type conversions, or any operation with unpredictable inputs.`,
        codeBlocks: [
          {
            label: "Defensive programming",
            code: `// Safe type conversion with recovery\nstring maybeNumber = "abc"\n\ntry {\n    int parsed = cast(maybeNumber, int)\n    print("Parsed:", parsed)\n} catch (e) {\n    print("Could not convert to int:", e)\n    int parsed = 0   // Use a sensible default\n    print("Using default:", parsed)\n}`,
          },
        ],
        quiz: [
          {
            q: "Which of these operations is the best candidate for a try/catch?",
            options: [
              "int x = 5",
              "print(\"Hello\")",
              "int result = userInputValue / anotherUserValue",
              "const int MAX = 100",
            ],
            correct: 2,
            explanation: "Division by an unknown user input could be zero — that's an unpredictable runtime failure. Simple declarations and print calls cannot fail, so they don't need try/catch.",
          },
          {
            q: "What is 'defensive programming'?",
            options: [
              "Writing code that runs faster",
              "Anticipating potential failures and handling them gracefully",
              "Using const for all variables",
              "Avoiding the use of loops",
            ],
            correct: 1,
            explanation: "Defensive programming means writing code that anticipates things that could go wrong and handles them gracefully — using try/catch, checking for null, and validating inputs before using them.",
          },
        ],
      },
    ],
  },

  // ── 11 ──────────────────────────────────────────────────────────────────────
  {
    id: "advanced",
    title: "Putting it All Together",
    subtitle: "Real programs using everything",
    description: "Combine types, operators, control flow, functions, and error handling into complete programs.",
    difficulty: "Advanced",
    icon: <Layers size={16} />,
    accentColor: "#a78bfa",
    topics: ["Mixed programs", "Best practices", "Readable code", "Physics", "Game logic"],
    sections: [
      {
        heading: "Circle Calculator",
        body: `Let's build a real program that uses variables, built-in constants, math functions, and print together.`,
        codeBlocks: [
          {
            label: "Circle calculator",
            code: `// Circle Calculator in EVAL\nfloat radius = 7.5\n\n// Area = π * r²\nfloat area = PI * pow(radius, 2)\nfloat roundedArea = round(area)\n\n// Circumference = 2πr\nfloat circumference = 2 * PI * radius\n\nprint("Radius:", radius)\nprint("Area (approx):", roundedArea)\nprint("Circumference:", circumference)`,
          },
        ],
        quiz: [
          {
            q: "In the circle calculator, why is `round(area)` used before printing?",
            options: [
              "round() is required before print()",
              "To get a cleaner output without many decimal places",
              "PI cannot be used without rounding",
              "To convert float to int",
            ],
            correct: 1,
            explanation: "PI * pow(radius, 2) produces a long decimal like 176.71458... Using round() gives a cleaner number like 177.0 for display — easier to read.",
          },
          {
            q: "Which functions and constants are used together in this program?",
            options: [
              "Only PI",
              "pow, round, PI, and print",
              "sqrt, abs, and YEAR",
              "cast, min, and HOURS_IN_DAY",
            ],
            correct: 1,
            explanation: "The circle calculator combines PI (built-in constant), pow() to square the radius, round() to clean up the output, and print() to display results — showing how multiple features work together.",
          },
        ],
      },
      {
        heading: "Grade Classifier with Loop",
        body: `Using a while loop, conditionals, and compound assignment to process multiple scores.`,
        codeBlocks: [
          {
            label: "Grade average calculator",
            code: `// Accumulate scores and calculate average\nint totalScore = 0\nint count = 0\n\n// Simulate 5 test scores\nint scores = 5\nint current = 80\n\nwhile (count < scores) {\n    totalScore += current\n    current += 2   // Each score goes up by 2\n    count++\n}\n\nfloat average = totalScore / scores\nprint("Total:", totalScore)\nprint("Average:", average)\n\nif (average >= 90) {\n    print("Grade: A")\n} else if (average >= 80) {\n    print("Grade: B")\n} else {\n    print("Grade: C or below")\n}`,
          },
        ],
        quiz: [
          {
            q: "What does `totalScore += current` do on each loop iteration?",
            options: [
              "Sets totalScore to current",
              "Adds current to the running total in totalScore",
              "Multiplies totalScore by current",
              "Resets current to zero",
            ],
            correct: 1,
            explanation: "+= accumulates — it adds the right side to the existing value of the left side. After each iteration totalScore grows by the value of current.",
          },
          {
            q: "Which three language features does this program combine?",
            options: [
              "try/catch, sqrt, and PI",
              "while loop, if/else if/else, and compound assignment",
              "abs, min, and constants",
              "cast, break, and continue",
            ],
            correct: 1,
            explanation: "The grade calculator uses a while loop to accumulate scores, += compound assignment to add to the total, and if/else if/else to classify the final average.",
          },
        ],
      },
      {
        heading: "Physics: Free Fall",
        body: `Using floats, pow, and built-in constants to model a physics problem with error handling.`,
        codeBlocks: [
          {
            label: "Free fall calculator",
            code: `// Distance fallen under gravity: d = ½ * g * t²\nfloat gravity = 9.81    // m/s²\nfloat time = 3.0        // seconds\n\ntry {\n    float distance = 0.5 * gravity * pow(time, 2)\n    float velocity = gravity * time\n\n    print("Time:", time, "s")\n    print("Distance:", round(distance), "m")\n    print("Final velocity:", round(velocity), "m/s")\n} catch (err) {\n    print("Physics calculation error:", err)\n}`,
          },
        ],
        tip: "Notice how readable the code is because of named variables and error handling. Anyone can understand this program's purpose instantly.",
        quiz: [
          {
            q: "Why is the calculation wrapped in a try/catch block?",
            options: [
              "pow() always throws errors",
              "To guard against unexpected runtime errors during the calculation",
              "try/catch is required around all float operations",
              "It isn't necessary — it's just good style",
            ],
            correct: 1,
            explanation: "Wrapping calculations in try/catch is defensive programming — if something unexpected goes wrong during the maths, the program catches it gracefully rather than crashing.",
          },
          {
            q: "What does `pow(time, 2)` calculate in the free fall formula?",
            options: [
              "time × 2",
              "time squared (time × time)",
              "2 to the power of time",
              "The square root of time",
            ],
            correct: 1,
            explanation: "pow(time, 2) raises time to the power of 2 — i.e. time². The free fall formula is d = ½ × g × t², so we need t squared.",
          },
        ],
      },
      {
        heading: "Time Calculator",
        body: `Using built-in time constants with loops and logical operators for practical time math.`,
        codeBlocks: [
          {
            label: "Time breakdown program",
            code: `// Hours in a year\nint hoursPerYear = DAYS_IN_WEEK * 52 * HOURS_IN_DAY\nprint("Hours in a year:", hoursPerYear)\n\n// Count weeks until a milestone\nint weeksLeft = 0\nint daysLeft = 365\n\nwhile (daysLeft >= DAYS_IN_WEEK) {\n    daysLeft -= DAYS_IN_WEEK\n    weeksLeft++\n}\n\nprint("Full weeks:", weeksLeft)\nprint("Remaining days:", daysLeft)`,
          },
        ],
        quiz: [
          {
            q: "What is the value of `DAYS_IN_WEEK * 52 * HOURS_IN_DAY`?",
            options: ["365", "8736", "168", "2190"],
            correct: 1,
            explanation: "DAYS_IN_WEEK = 7, HOURS_IN_DAY = 24. So 7 × 52 × 24 = 8736 hours in a year (52-week approximation).",
          },
          {
            q: "After the while loop, what does `daysLeft` represent?",
            options: [
              "The total number of days in a year",
              "The number of complete weeks",
              "The leftover days after removing full weeks from 365",
              "Zero — the loop runs until daysLeft is 0",
            ],
            correct: 2,
            explanation: "The loop subtracts DAYS_IN_WEEK (7) each iteration until fewer than 7 days remain. daysLeft holds the remainder — the days that don't complete a full extra week.",
          },
        ],
      },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
export const LESSONS_BY_DIFFICULTY = {
  Beginner:     LESSONS.filter((l) => l.difficulty === "Beginner"),
  Intermediate: LESSONS.filter((l) => l.difficulty === "Intermediate"),
  Advanced:     LESSONS.filter((l) => l.difficulty === "Advanced"),
};