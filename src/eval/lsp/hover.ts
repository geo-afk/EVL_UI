function typeDocs() {
  return {
    int: "32-bit signed integer type used for whole numbers.",
    float: "Floating-point numeric type used for decimal values.",
    string: "Text string type for sequences of characters.",
    bool: "Boolean type representing true or false values.",
    const: "Declares an immutable variable whose value cannot be reassigned.",
  };
}

function functionDocs() {
  return {
    print: "Outputs one or more values to the standard output.",
    cast: "Explicitly converts a value from one type to another.",
    pow: "Raises a number to the power of another number.",
    sqrt: "Returns the square root of a numeric value.",
    min: "Returns the smaller of two numeric values.",
    max: "Returns the larger of two numeric values.",
    round: "Rounds a floating-point number to the nearest integer.",
    abs: "Returns the absolute (non-negative) value of a number.",
  };
}

function constantDocs() {
  return {
    PI: "Mathematical constant pi (~3.14159): ratio of a circle's circumference to its diameter.",
    DAYS_IN_WEEK: "Constant representing the number of days in a week (7).",
    HOURS_IN_DAY: "Constant representing the number of hours in a day (24).",
    YEAR: "Current year value provided by the runtime environment.",
  };
}

function controlFlowDocs() {
  return {
    if: "Executes a block of code only when a condition is true.",
    else: "Specifies a block to execute when the preceding if condition is false.",
    while:
      "Repeatedly executes a block of code as long as a condition remains true.",
    for: "Repeats a block of code a controlled number of times.",
    break: "Exits the nearest enclosing loop immediately.",
    continue:
      "Skips the rest of the current loop iteration and moves to the next one.",
    return: "Exits the current function and optionally returns a value.",
    try: "Executes a block of code that may throw a runtime error.",
    catch: "Handles errors thrown inside a try block.",
  };
}

function literalDocs() {
  return {
    true: "Boolean literal representing a logically true value.",
    false: "Boolean literal representing a logically false value.",
    null: "Represents the absence of a value.",
  };
}

function operatorDocs() {
  return {
    "+": "Adds two numeric values together.",
    "-": "Subtracts one numeric value from another.",
    "*": "Multiplies two numeric values.",
    "/": "Divides one numeric value by another.",
    "%": "Returns the remainder of dividing one value by another (modulus).",
    "=": "Assigns a value to a variable.",
    "+=": "Adds the right-hand value to the variable and reassigns it.",
    "-=": "Subtracts the right-hand value from the variable and reassigns it.",
    "*=": "Multiplies the variable by the right-hand value and reassigns it.",
    "/=": "Divides the variable by the right-hand value and reassigns it.",
    "++": "Increments a variable by 1 (post-increment).",
    "--": "Decrements a variable by 1 (post-decrement).",
    "==": "Returns true when two values are equal.",
    "!=": "Returns true when two values are not equal.",
    "<": "Returns true when the left value is less than the right.",
    ">": "Returns true when the left value is greater than the right.",
    "<=": "Returns true when the left value is less than or equal to the right.",
    ">=": "Returns true when the left value is greater than or equal to the right.",
    "&&": "Logical AND — true when both operands are true.",
    "||": "Logical OR — true when at least one operand is true.",
    "!": "Logical NOT — inverts a boolean value.",
  };
}

function appendToDocs(keywordDocs: Record<string, string>) {
  const docProviders = [
    typeDocs,
    functionDocs,
    constantDocs,
    controlFlowDocs,
    literalDocs,
    operatorDocs,
  ];

  for (const provider of docProviders) {
    Object.assign(keywordDocs, provider());
  }
}

export function hoverDocs(): Record<string, string> {
  const keywordDocs: Record<string, string> = {};
  appendToDocs(keywordDocs);
  return keywordDocs;
}
