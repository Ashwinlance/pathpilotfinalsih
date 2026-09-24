import { learningAssistantGuides } from '../../data/learning/assistantGuides';
import type { LearningModule, LearningAssistantAssessment, LearningAssistantAssessmentResult, LearningAssistantIntent, LearningAssistantResponse, StudyPack } from '../../types/learning';
import type { Topic } from '../../types/topic';

export interface LearningAssistantContext {
  topic: Topic;
  module?: LearningModule;
  studyPack?: StudyPack;
}

export interface LearningAssistantProvider {
  respond(input: { message: string; intent?: LearningAssistantIntent; context: LearningAssistantContext }): LearningAssistantResponse;
}

const functionAssessment: LearningAssistantAssessment = {
  id: 'coach-assessment-py-functions',
  topicId: 'py-functions',
  questions: [
    { id: 'coach-py-fn-1', topicId: 'py-functions', prompt: 'What is the key difference between a parameter and an argument?', options: ['A parameter appears in a function definition; an argument is a value passed during a call', 'A parameter is always numeric; an argument is always text', 'Arguments exist only inside the function body', 'There is no difference'], correctOptionIndex: 0 },
    { id: 'coach-py-fn-2', topicId: 'py-functions', prompt: 'What does return do in a Python function?', options: ['Sends a value back to the caller', 'Prints every local variable', 'Makes all variables global', 'Restarts the function'], correctOptionIndex: 0 },
    { id: 'coach-py-fn-3', topicId: 'py-functions', prompt: 'Which call is valid for def multiply(a, b):?', options: ['multiply(3, 4)', 'def multiply(3, 4)', 'return multiply', 'multiply = a, b'], correctOptionIndex: 0 },
    { id: 'coach-py-fn-4', topicId: 'py-functions', prompt: 'A variable created inside a function is normally:', options: ['Local to that function', 'Automatically global', 'Stored in every module', 'Always read-only'], correctOptionIndex: 0 },
    { id: 'coach-py-fn-5', topicId: 'py-functions', prompt: 'Why are small functions useful?', options: ['They make behavior easier to reuse and test', 'They eliminate all bugs', 'They remove the need for inputs', 'They make every variable global'], correctOptionIndex: 0 },
  ],
};

const dataAssessment: LearningAssistantAssessment = {
  id: 'coach-assessment-py-data',
  topicId: 'py-data',
  questions: [
    { id: 'coach-py-data-1', topicId: 'py-data', prompt: 'Which structure is best for ordered values accessed by position?', options: ['List', 'Dictionary', 'Function', 'Module'], correctOptionIndex: 0 },
    { id: 'coach-py-data-2', topicId: 'py-data', prompt: 'Which structure stores key-value pairs?', options: ['Dictionary', 'List only', 'Integer', 'Function'], correctOptionIndex: 0 },
    { id: 'coach-py-data-3', topicId: 'py-data', prompt: 'What does an index identify in a list?', options: ['An item position', 'A dictionary key only', 'A function parameter', 'A module name'], correctOptionIndex: 0 },
    { id: 'coach-py-data-4', topicId: 'py-data', prompt: 'Which expression accesses the name value in student = {"name": "Ananya"}?', options: ['student["name"]', 'student(0)', 'student.name()', 'name.student'], correctOptionIndex: 0 },
    { id: 'coach-py-data-5', topicId: 'py-data', prompt: 'A data transformation usually:', options: ['Produces a changed representation of input data', 'Deletes Python itself', 'Makes all values global', 'Prevents iteration'], correctOptionIndex: 0 },
  ],
};

function fallbackAssessment(context: LearningAssistantContext): LearningAssistantAssessment {
  const objectives = context.module?.objectives.length ? context.module.objectives : [context.topic.description, `Explain ${context.topic.name}`, `Apply ${context.topic.name}`];
  const questions = Array.from({ length: 5 }, (_, index) => {
    const objective = objectives[index % objectives.length];
    return {
      id: `coach-${context.topic.id}-${index + 1}`,
      topicId: context.topic.id,
      prompt: `Which statement best matches this learning objective: “${objective}”?`,
      options: [
        objective,
        `Ignore ${context.topic.name} concepts and guess the result`,
        `Avoid validating any work related to ${context.topic.name}`,
        `Treat ${context.topic.name} as unrelated to the current module`,
      ],
      correctOptionIndex: 0,
    };
  });
  return { id: `coach-assessment-${context.topic.id}`, topicId: context.topic.id, questions };
}

function assessmentFor(context: LearningAssistantContext): LearningAssistantAssessment {
  if (context.topic.id === 'py-functions') return functionAssessment;
  if (context.topic.id === 'py-data') return dataAssessment;
  return fallbackAssessment(context);
}

function inferIntent(message: string): LearningAssistantIntent {
  const normalized = message.toLowerCase();
  if (/\b(sample|practice|quiz|assessment|test)\b/.test(normalized)) return 'SAMPLE_ASSESSMENT';
  if (/\bhint\b/.test(normalized)) return 'HINT';
  if (/\b(example|code|demo)\b/.test(normalized)) return 'EXAMPLE';
  if (/\b(simple|simplify|easy|eli5)\b/.test(normalized)) return 'SIMPLIFY';
  if (/\b(explain|what is|what are|how does|why)\b/.test(normalized)) return 'EXPLAIN';
  return 'QUESTION';
}

function findTermAnswer(message: string, topicId: string): string | undefined {
  const guide = learningAssistantGuides.find(item => item.topicId === topicId);
  if (!guide) return undefined;
  const normalized = message.toLowerCase();
  const entry = Object.entries(guide.keyTerms).find(([term]) => normalized.includes(term));
  return entry?.[1];
}

export class DeterministicLearningAssistant implements LearningAssistantProvider {
  respond({ message, intent, context }: { message: string; intent?: LearningAssistantIntent; context: LearningAssistantContext }): LearningAssistantResponse {
    const resolvedIntent = intent ?? inferIntent(message);
    const guide = learningAssistantGuides.find(item => item.topicId === context.topic.id);
    const objectives = context.module?.objectives.join(', ') ?? context.topic.description;
    const studyContext = context.studyPack?.material.topicId === context.topic.id
      ? ` Your uploaded study pack emphasizes: ${context.studyPack.keyPoints.slice(0, 2).join('; ')}.`
      : '';

    if (resolvedIntent === 'SAMPLE_ASSESSMENT') {
      return { intent: resolvedIntent, text: `Here is a 5-question sample assessment for ${context.topic.name}. It is practice only and does not change competency or the adaptive roadmap.`, assessment: assessmentFor(context) };
    }
    if (resolvedIntent === 'HINT') {
      return { intent: resolvedIntent, text: guide?.hint ?? `Focus on the current objectives: ${objectives}. Break the problem into one objective at a time.${studyContext}` };
    }
    if (resolvedIntent === 'EXAMPLE') {
      return { intent: resolvedIntent, text: guide?.example ?? `A useful example should demonstrate ${objectives}. Try creating one small input, applying the topic rule, and checking the output.${studyContext}` };
    }
    if (resolvedIntent === 'SIMPLIFY') {
      return { intent: resolvedIntent, text: guide?.simplified ?? `${context.topic.name}, in simple terms: ${context.topic.description}${studyContext}` };
    }
    if (resolvedIntent === 'EXPLAIN') {
      const termAnswer = findTermAnswer(message, context.topic.id);
      return { intent: resolvedIntent, text: termAnswer ?? guide?.explanation ?? `${context.topic.name}: ${context.topic.description} The current module focuses on ${objectives}.${studyContext}` };
    }

    const termAnswer = findTermAnswer(message, context.topic.id);
    return {
      intent: resolvedIntent,
      text: termAnswer ?? `I’m focused on ${context.topic.name}. ${guide?.explanation ?? context.topic.description} Ask me to explain a concept, give a hint, show an example, simplify it, or create a sample assessment.${studyContext}`,
    };
  }
}

export function gradeLearningAssistantAssessment(assessment: LearningAssistantAssessment, answers: Record<string, number>): LearningAssistantAssessmentResult {
  const correct = assessment.questions.reduce((total, question) => total + (answers[question.id] === question.correctOptionIndex ? 1 : 0), 0);
  return { correct, total: assessment.questions.length, score: assessment.questions.length ? Math.round((correct / assessment.questions.length) * 100) : 0 };
}
