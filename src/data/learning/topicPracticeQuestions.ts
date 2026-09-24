import type { TopicPracticeQuestion } from '../../types/learning';

export const topicPracticeQuestions: TopicPracticeQuestion[] = [
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
];

export function getTopicPracticeQuestions(topicId?: string): TopicPracticeQuestion[] {
  if (!topicId) return [];
  return topicPracticeQuestions.filter(question => question.topicId === topicId);
}
