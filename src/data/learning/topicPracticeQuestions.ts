import type { TopicPracticeQuestion } from '../../types/learning';

export const topicPracticeQuestions: TopicPracticeQuestion[] = [
  {
    id: 'practice-py-basics-1',
    topicId: 'py-basics',
    prompt: 'Which statement correctly assigns the number 10 to a Python variable named score?',
    options: ['score = 10', '10 = score', 'let score = 10', 'score :=: 10'],
    correctOptionIndex: 0,
  },
  {
    id: 'practice-py-basics-2',
    topicId: 'py-basics',
    prompt: 'Which Python type is used to represent True or False values?',
    options: ['bool', 'str', 'list', 'float'],
    correctOptionIndex: 0,
  },
  {
    id: 'practice-py-basics-3',
    topicId: 'py-basics',
    prompt: 'What is the purpose of an if statement in Python?',
    options: ['Run code conditionally', 'Create a package', 'Import every module', 'Convert all values to text'],
    correctOptionIndex: 0,
  },
  {
    id: 'practice-py-basics-4',
    topicId: 'py-basics',
    prompt: 'Which construct is appropriate for repeating an action for every item in a list?',
    options: ['for loop', 'class declaration', 'import statement', 'return statement'],
    correctOptionIndex: 0,
  },
  {
    id: 'practice-py-basics-5',
    topicId: 'py-basics',
    prompt: 'What does len([10, 20, 30]) return?',
    options: ['3', '30', '60', '0'],
    correctOptionIndex: 0,
  },
  {
    id: 'practice-py-functions-1',
    topicId: 'py-functions',
    prompt: 'What is the main purpose of the return statement inside a Python function?',
    options: [
      'Send a value back to the code that called the function',
      'Print every local variable automatically',
      'Restart the function from the beginning',
      'Make every variable global',
    ],
    correctOptionIndex: 0,
  },
  {
    id: 'practice-py-functions-2',
    topicId: 'py-functions',
    prompt: 'In def greet(name):, what is name?',
    options: [
      'A parameter',
      'A return value',
      'A module',
      'A global constant',
    ],
    correctOptionIndex: 0,
  },
  {
    id: 'practice-py-functions-3',
    topicId: 'py-functions',
    prompt: 'What is normally true about a variable created inside a Python function?',
    options: [
      'It is local to that function unless scope rules explicitly make it otherwise',
      'It is automatically available in every file',
      'It can only store numbers',
      'It always replaces a variable with the same name outside the function',
    ],
    correctOptionIndex: 0,
  },
  {
    id: 'practice-py-functions-4',
    topicId: 'py-functions',
    prompt: 'Which call correctly passes 10 and 20 to def add(a, b):?',
    options: [
      'add(10, 20)',
      'add = 10, 20',
      'return add',
      'def add(10, 20)',
    ],
    correctOptionIndex: 0,
  },
  {
    id: 'practice-py-functions-5',
    topicId: 'py-functions',
    prompt: 'Why are small reusable functions useful in a program?',
    options: [
      'They separate responsibilities and make behavior easier to test and reuse',
      'They remove the need for inputs and outputs',
      'They make all program state global',
      'They guarantee that code cannot contain errors',
    ],
    correctOptionIndex: 0,
  },
  {
    id: 'practice-py-data-1', topicId: 'py-data',
    prompt: 'Which Python collection stores key-value pairs?',
    options: ['dictionary', 'list', 'tuple', 'string'], correctOptionIndex: 0,
  },
  {
    id: 'practice-py-data-2', topicId: 'py-data',
    prompt: 'Which expression gets the first item from values = [4, 8, 12]?',
    options: ['values[0]', 'values[1]', 'values.first()', 'values{0}'], correctOptionIndex: 0,
  },
  {
    id: 'practice-py-data-3', topicId: 'py-data',
    prompt: 'Which list method adds one item to the end of a list?',
    options: ['append()', 'push()', 'insertEnd()', 'addLast()'], correctOptionIndex: 0,
  },
  {
    id: 'practice-py-data-4', topicId: 'py-data',
    prompt: 'Why are dictionaries useful in data work?',
    options: ['They associate named keys with values', 'They only store one value', 'They automatically sort every dataset', 'They can only contain text'], correctOptionIndex: 0,
  },
  {
    id: 'practice-py-data-5', topicId: 'py-data',
    prompt: 'Which operation creates a new list containing doubled values from nums?',
    options: ['[n * 2 for n in nums]', 'nums * * 2', 'double(nums) only', '{n * 2 in nums}'], correctOptionIndex: 0,
  },
  {
    id: 'practice-py-analysis-1', topicId: 'py-analysis',
    prompt: 'What is a good first step in a repeatable analysis workflow?',
    options: ['Define the input and expected output', 'Hide the source data', 'Mix every transformation into one line', 'Skip validation'], correctOptionIndex: 0,
  },
  {
    id: 'practice-py-analysis-2', topicId: 'py-analysis',
    prompt: 'Why separate data cleaning from analysis logic?',
    options: ['It makes each stage easier to test and understand', 'It guarantees perfect data', 'It removes the need for functions', 'It makes validation unnecessary'], correctOptionIndex: 0,
  },
  {
    id: 'practice-py-analysis-3', topicId: 'py-analysis',
    prompt: 'What should validation check after a transformation?',
    options: ['Whether the output matches expected rules and shape', 'Only whether the file has a name', 'Whether code contains comments', 'Only whether execution was fast'], correctOptionIndex: 0,
  },
  {
    id: 'practice-py-analysis-4', topicId: 'py-analysis',
    prompt: 'What makes an analysis pipeline easier to maintain?',
    options: ['Small composable stages with clear inputs and outputs', 'One very large global function', 'Removing all intermediate checks', 'Using unnamed variables everywhere'], correctOptionIndex: 0,
  },
  {
    id: 'practice-py-analysis-5', topicId: 'py-analysis',
    prompt: 'Why record assumptions in an analysis?',
    options: ['So results can be interpreted and reviewed correctly', 'So tests can be skipped', 'So outputs never change', 'So inputs are no longer required'], correctOptionIndex: 0,
  },
  {
    id: 'practice-py-testing-1', topicId: 'py-testing',
    prompt: 'What is the main purpose of an assertion in a Python test?',
    options: ['Check that an observed result matches an expected condition', 'Import every installed package', 'Make all variables global', 'Skip validation when code changes'], correctOptionIndex: 0,
  },
  {
    id: 'practice-py-testing-2', topicId: 'py-testing',
    prompt: 'Why should a test include representative edge cases?',
    options: ['To check behavior at unusual or boundary inputs', 'To guarantee no future requirement changes', 'To avoid defining expected results', 'To replace all learning evidence'], correctOptionIndex: 0,
  },
  {
    id: 'practice-py-testing-3', topicId: 'py-testing',
    prompt: 'Which test is most useful for a function that should return 5 when given 2 and 3?',
    options: ['Assert that add(2, 3) == 5', 'Print add without checking its result', 'Rename the function after every run', 'Only test whether the file exists'], correctOptionIndex: 0,
  },
  {
    id: 'practice-py-testing-4', topicId: 'py-testing',
    prompt: 'What should happen when a validation check detects an unexpected analytical result?',
    options: ['The problem should be surfaced so it can be investigated', 'The result should always be silently accepted', 'All previous evidence should be deleted', 'The required competency should automatically become zero'], correctOptionIndex: 0,
  },
  {
    id: 'practice-py-testing-5', topicId: 'py-testing',
    prompt: 'Why are small deterministic tests valuable after a governed knowledge update?',
    options: ['They provide repeatable evidence that expected behavior still holds', 'They automatically approve governance proposals', 'They replace human review', 'They make prerequisites unnecessary'], correctOptionIndex: 0,
  },

  {
    id: 'practice-sql-select-1', topicId: 'sql-select',
    prompt: 'Which SQL clause specifies the columns or expressions returned by a query?',
    options: ['SELECT', 'WHERE', 'JOIN', 'ORDER BY'], correctOptionIndex: 0,
  },
  {
    id: 'practice-sql-select-2', topicId: 'sql-select',
    prompt: 'What does an alias do in a SELECT query?',
    options: ['Gives a temporary readable name to a column or table', 'Deletes the original column', 'Creates a permanent database user', 'Automatically filters rows'], correctOptionIndex: 0,
  },
  {
    id: 'practice-sql-select-3', topicId: 'sql-select',
    prompt: 'Which query returns only name and score from learners?',
    options: ['SELECT name, score FROM learners;', 'SELECT * WHERE learners;', 'FROM learners GET name, score;', 'SHOW name, score IN learners;'], correctOptionIndex: 0,
  },
  {
    id: 'practice-sql-select-4', topicId: 'sql-select',
    prompt: 'Why is selecting only required columns often preferable to SELECT *?',
    options: ['It makes the intended output clearer and can reduce unnecessary data transfer', 'It guarantees every query is faster', 'It removes the need for a FROM clause', 'It automatically creates indexes'], correctOptionIndex: 0,
  },
  {
    id: 'practice-sql-select-5', topicId: 'sql-select',
    prompt: 'What is a SQL expression in a SELECT list used for?',
    options: ['Compute a value from columns, literals or functions', 'Approve governance proposals', 'Create a new database server', 'Replace every table key'], correctOptionIndex: 0,
  },
  {
    id: 'practice-sql-filter-1', topicId: 'sql-filter',
    prompt: 'Which clause filters rows based on a condition?',
    options: ['WHERE', 'SELECT', 'FROM', 'AS'], correctOptionIndex: 0,
  },
  {
    id: 'practice-sql-filter-2', topicId: 'sql-filter',
    prompt: 'Which operator requires both conditions to be true?',
    options: ['AND', 'OR', 'AS', 'DESC'], correctOptionIndex: 0,
  },
  {
    id: 'practice-sql-filter-3', topicId: 'sql-filter',
    prompt: 'What does ORDER BY score DESC do?',
    options: ['Sorts score from highest to lowest', 'Filters out low scores', 'Groups identical scores', 'Renames the score column'], correctOptionIndex: 0,
  },
  {
    id: 'practice-sql-filter-4', topicId: 'sql-filter',
    prompt: 'Which predicate correctly keeps rows with score at least 70?',
    options: ['score >= 70', 'score => 70', 'score IS 70+', 'score ATLEAST 70'], correctOptionIndex: 0,
  },
  {
    id: 'practice-sql-filter-5', topicId: 'sql-filter',
    prompt: 'Why should complex filters be built one condition at a time?',
    options: ['It makes the logic easier to validate and debug', 'It removes the need for SQL syntax', 'It always changes OR into AND', 'It guarantees no NULL values'], correctOptionIndex: 0,
  },
  {
    id: 'practice-sql-joins-1', topicId: 'sql-joins',
    prompt: 'What is the primary purpose of a SQL JOIN?',
    options: ['Combine related rows from multiple tables', 'Sort a single table only', 'Rename a database', 'Delete duplicate columns automatically'], correctOptionIndex: 0,
  },
  {
    id: 'practice-sql-joins-2', topicId: 'sql-joins',
    prompt: 'What should a JOIN condition normally identify?',
    options: ['The relationship between matching key columns', 'Only the table with more rows', 'The display order of columns', 'A random row from each table'], correctOptionIndex: 0,
  },
  {
    id: 'practice-sql-joins-3', topicId: 'sql-joins',
    prompt: 'What does an INNER JOIN return?',
    options: ['Rows with matching records on both sides', 'Every row from both tables regardless of matches', 'Only unmatched rows', 'Only columns with numeric values'], correctOptionIndex: 0,
  },
  {
    id: 'practice-sql-joins-4', topicId: 'sql-joins',
    prompt: 'What can happen when a JOIN uses a non-unique or incorrect key?',
    options: ['Rows can be duplicated or incorrectly matched', 'SQL automatically repairs the schema', 'The query becomes a SELECT *', 'All NULL values disappear'], correctOptionIndex: 0,
  },
  {
    id: 'practice-sql-joins-5', topicId: 'sql-joins',
    prompt: 'Before writing a JOIN, what should you determine first?',
    options: ['Which columns represent the relationship between the tables', 'Which column has the longest name', 'Whether ORDER BY is required', 'Whether every table has the same row count'], correctOptionIndex: 0,
  },
  {
    id: 'practice-sql-window-1', topicId: 'sql-window',
    prompt: 'What does a SQL window function allow you to do?',
    options: ['Calculate across related rows while keeping individual rows in the result', 'Delete rows outside a date range', 'Create a new database automatically', 'Replace every JOIN with a subquery'], correctOptionIndex: 0,
  },
  {
    id: 'practice-sql-window-2', topicId: 'sql-window',
    prompt: 'Which keyword defines the window used by functions such as RANK or ROW_NUMBER?',
    options: ['OVER', 'HAVING', 'VALUES', 'ALTER'], correctOptionIndex: 0,
  },
  {
    id: 'practice-sql-window-3', topicId: 'sql-window',
    prompt: 'What does PARTITION BY do inside a window definition?',
    options: ['Splits rows into groups for independent window calculations', 'Deletes duplicate partitions', 'Creates a physical table partition automatically', 'Sorts the entire database'], correctOptionIndex: 0,
  },
  {
    id: 'practice-sql-window-4', topicId: 'sql-window',
    prompt: 'Which function is appropriate for assigning an ordered row number within a window?',
    options: ['ROW_NUMBER()', 'COUNT_TABLE()', 'ROW_SORT()', 'INDEX_ROW()'], correctOptionIndex: 0,
  },
  {
    id: 'practice-sql-window-5', topicId: 'sql-window',
    prompt: 'Why should analytical window-query results be validated?',
    options: ['To confirm partitioning, ordering, row counts and calculated values match the intended analysis', 'To make human review unnecessary', 'To guarantee all future queries are correct', 'To remove the need for prerequisites'], correctOptionIndex: 0,
  },
];

export function getTopicPracticeQuestions(topicId?: string): TopicPracticeQuestion[] {
  if (!topicId) return [];
  return topicPracticeQuestions.filter(question => question.topicId === topicId);
}
