export interface LearningAssistantGuide {
  topicId: string;
  explanation: string;
  simplified: string;
  hint: string;
  example: string;
  keyTerms: Record<string, string>;
}

export const learningAssistantGuides: LearningAssistantGuide[] = [
  {
    topicId: 'py-basics',
    explanation: 'Python basics cover variables, core data types, conditions and loops. These concepts are the foundation required before functions and data transformations can be used reliably.',
    simplified: 'Python basics are the building blocks: store values in variables, make decisions with if, and repeat work with loops.',
    hint: 'Identify whether the problem needs a value, a decision, or repetition. That usually points to a variable, an if statement, or a loop.',
    example: 'Example:\n\nscore = 72\nif score >= 70:\n    print("Pass")\n\nfor attempt in range(3):\n    print(attempt)\n\nThis uses a variable, a condition and a loop.',
    keyTerms: {
      variable: 'A variable is a name that refers to a value, such as score = 72.',
      boolean: 'A Boolean value is either True or False and is often produced by comparisons.',
      condition: 'A condition is an expression used by if/elif to decide which code should run.',
      loop: 'A loop repeats a block of code, for example once for each item in a collection.',
    },
  },
  {
    topicId: 'py-functions',
    explanation: 'A Python function is a reusable block of code that performs one focused task. Parameters receive input, the function body processes that input, return sends a result back to the caller, and local variables normally stay inside the function scope.',
    simplified: 'Think of a function like a small machine: give it inputs, let it do one job, and get an output back. Parameters are the inputs and return is the output.',
    hint: 'When you are stuck, identify three things in order: the inputs (parameters), the transformation inside the function, and the value that should be returned.',
    example: 'Example:\n\ndef add(a, b):\n    total = a + b\n    return total\n\nresult = add(4, 6)  # result is 10\n\nHere a and b are parameters, total is local to the function, and return sends 10 back to the caller.',
    keyTerms: {
      parameter: 'A parameter is a named input in a function definition, such as name in def greet(name):.',
      argument: 'An argument is the actual value passed when calling a function, such as "Ananya" in greet("Ananya").',
      return: 'return ends the current function call and sends a value back to the caller. Printing displays a value, but returning makes the value available to other code.',
      scope: 'Scope describes where a name can be accessed. A variable created inside a function is normally local to that function.',
      function: 'A function packages reusable behavior behind a name so the same logic can be called from multiple places.',
    },
  },
  {
    topicId: 'py-data',
    explanation: 'Python data structures organize values so programs can store, retrieve and transform data. Lists are ordered sequences, while dictionaries map keys to values.',
    simplified: 'Use a list when order matters and you mainly work with positions. Use a dictionary when you want to look up a value by a meaningful key.',
    hint: 'Ask what access pattern you need: position-based access usually suggests a list; named key-value access usually suggests a dictionary.',
    example: 'Example:\n\nscores = [72, 88, 91]\nstudent = {"name": "Ananya", "score": 88}\n\nThe list keeps ordered scores. The dictionary connects labels such as name and score to values.',
    keyTerms: {
      list: 'A list is an ordered, mutable collection written with square brackets.',
      dictionary: 'A dictionary stores key-value pairs and is useful for labeled data.',
      index: 'An index is the numeric position used to access an item in an ordered sequence.',
      key: 'A dictionary key identifies the value associated with it.',
      transformation: 'A transformation produces a changed representation of data, for example filtering or mapping a collection.',
    },
  },
  {
    topicId: 'py-analysis',
    explanation: 'Analytical Python combines small, testable transformation steps into a clear workflow: load data, clean it, transform it, validate intermediate results and produce an analysis output.',
    simplified: 'Break analysis into small steps instead of one large script. Check the output after each important step.',
    hint: 'If an analysis is hard to debug, split it into named transformations and validate the shape or values after each transformation.',
    example: 'Example workflow: load rows → remove invalid values → calculate a metric → validate totals → present the result. Keeping each step separate makes errors easier to locate.',
    keyTerms: {
      pipeline: 'A pipeline is an ordered sequence of data-processing stages.',
      validation: 'Validation checks that intermediate or final outputs satisfy expected conditions.',
      transformation: 'A transformation converts input data into a new representation.',
    },
  },
  {
    topicId: 'py-testing',
    explanation: 'Python testing and validation check that functions and analytical outputs behave as expected. Assertions compare actual behavior with expected behavior, while representative test cases cover normal inputs, edge cases and failure conditions.',
    simplified: 'Testing means checking that your Python code gives the result you expect, including unusual inputs.',
    hint: 'Write down the expected result first, then create one normal case and one edge case and compare the actual output with those expectations.',
    example: 'Example:\n\ndef add(a, b):\n    return a + b\n\nassert add(2, 3) == 5\nassert add(0, 0) == 0\n\nEach assertion checks a specific expected behavior.',
    keyTerms: {
      assertion: 'An assertion checks that a condition is true and surfaces a failure when the condition is false.',
      test: 'A test runs a defined case and compares observed behavior with an expected result.',
      validation: 'Validation checks that code or analytical output satisfies explicit rules or expectations.',
      edge: 'An edge case is an unusual or boundary input that can reveal behavior missed by typical examples.',
    },
  },
  {
    topicId: 'sql-select',
    explanation: 'SQL SELECT chooses columns or expressions from a data source. It is the foundation for reading and shaping query output before adding filters, grouping or joins.',
    simplified: 'SELECT tells SQL what values you want to see in the result.',
    hint: 'Start with the smallest query: identify the table, then list only the columns you need in SELECT.',
    example: 'Example:\n\nSELECT name, score\nFROM learners;\n\nThis returns only the name and score columns from learners.',
    keyTerms: {
      select: 'SELECT defines the expressions or columns returned by a query.',
      alias: 'An alias gives a column or table a temporary readable name in a query.',
      expression: 'A SQL expression computes a value from columns, literals or functions.',
    },
  },
  {
    topicId: 'sql-filter',
    explanation: 'SQL filtering uses WHERE predicates to keep only rows that satisfy conditions. Multiple conditions can be combined with AND or OR, and ORDER BY controls presentation order.',
    simplified: 'WHERE decides which rows stay in the result.',
    hint: 'Translate the requirement into one condition at a time, then combine conditions explicitly with AND or OR.',
    example: 'Example:\n\nSELECT name, score\nFROM learners\nWHERE score >= 70\nORDER BY score DESC;',
    keyTerms: {
      where: 'WHERE filters rows before they appear in the result.',
      predicate: 'A predicate is a condition that evaluates to true, false or unknown.',
      order: 'ORDER BY sorts the result by one or more expressions.',
    },
  },
  {
    topicId: 'sql-joins',
    explanation: 'A SQL join combines rows from related tables using a relationship between keys. Choosing the correct join type and join condition prevents missing rows or accidental duplication.',
    simplified: 'A join connects records from two tables when their key values match.',
    hint: 'Before writing the JOIN, identify the relationship: which column in table A matches which column in table B?',
    example: 'Example:\n\nSELECT l.name, r.role_name\nFROM learners l\nJOIN roles r ON l.role_id = r.id;',
    keyTerms: {
      join: 'A join combines related rows from multiple tables.',
      key: 'A join key is the column or expression used to connect related rows.',
      inner: 'An INNER JOIN keeps only rows with matching records on both sides.',
    },
  },
  {
    topicId: 'stats-probability',
    explanation: 'Probability describes uncertainty using values from 0 to 1. Conditional probability focuses on the chance of an event when some information is already known.',
    simplified: 'Probability tells you how likely something is. Conditional probability updates that likelihood when you learn something new.',
    hint: 'Clearly define the event and the condition before calculating. Ask: probability of what, given what?',
    example: 'If 30 of 100 learners pass, P(pass)=0.30. If 20 of 40 learners who practiced pass, then P(pass | practiced)=20/40=0.50.',
    keyTerms: {
      event: 'An event is a set of outcomes of interest.',
      conditional: 'Conditional probability measures one event under the assumption that another event has occurred.',
      uncertainty: 'Uncertainty represents incomplete knowledge about which outcome will occur.',
    },
  },
  {
    topicId: 'viz-story',
    explanation: 'Data storytelling connects a quantitative finding to a clear message and decision. Good storytelling reduces visual noise, highlights the important evidence and states why the evidence matters.',
    simplified: 'Show the important insight first, support it with evidence, and explain what the audience should understand or do next.',
    hint: 'Write the one-sentence takeaway before designing the chart. Then remove anything that does not support that takeaway.',
    example: 'Instead of a generic title such as “Monthly Sales,” use a message title such as “Sales fell 18% after June, driven by the South region.”',
    keyTerms: {
      insight: 'An insight is the meaningful conclusion supported by the data.',
      narrative: 'A narrative organizes evidence so the audience can follow the reasoning.',
      noise: 'Visual noise is information or decoration that competes with the main message.',
    },
  },
];
