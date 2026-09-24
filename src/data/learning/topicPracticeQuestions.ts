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
];

export function getTopicPracticeQuestions(topicId?: string): TopicPracticeQuestion[] {
  if (!topicId) return [];
  return topicPracticeQuestions.filter(question => question.topicId === topicId);
}
