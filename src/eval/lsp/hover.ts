function typeDocs() {
  return {
    'int': '32-bit signed integer type used for whole numbers.',
    'float': 'Floating-point numeric type used for decimal values.',
    'const': 'Declares an immutable variable whose value cannot be reassigned.',
  }
}



function functionDocs() {
  return {
    'print': 'Outputs one or more values to the standard output.',
    'cast': 'Explicitly converts a value from one type to another.',
    'pow': 'Raises a number to the power of another number.',
    'sqrt': 'Returns the square root of a numeric value.',
    'min': 'Returns the smaller of two numeric values.',
    'max': 'Returns the larger of two numeric values.',
    'round': 'Rounds a floating-point number to the nearest integer.',
  }
}



function constantDocs() {
  return {
    'PI': 'Mathematical constant representing the ratio of a circle’s circumference to its diameter.',
    'DAYS_IN_WEEK': 'Constant representing the number of days in a week.',
    'HOURS_IN_DAY': 'Constant representing the number of hours in a day.',
    'Year': 'Current year value provided by the runtime environment.',
  }
}



function controlFlowDocs() {
  return {
    'try': 'Executes a block of code that may throw a runtime error.',
    'catch': 'Handles errors thrown inside a try block.',
  }
}



function operatorDocs() {
  return {
    '+': 'Adds two numeric values together.',
    '-': 'Subtracts one numeric value from another.',
    '*': 'Multiplies two numeric values.',
    '/': 'Divides one numeric value by another.',
    '=': 'Assigns a value to a variable.',
  }
}


function appendToDocs(keywordDocs: Record<string, string>) {
  const docProviders = [
    typeDocs,
    functionDocs,
    constantDocs,
    controlFlowDocs,
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

