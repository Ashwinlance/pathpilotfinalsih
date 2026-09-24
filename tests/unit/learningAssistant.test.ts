import { describe, expect, it } from 'vitest';
import { learningModules } from '../../src/data/learning/modules';
import { initialTopics } from '../../src/data/topics/topics';
import { DeterministicLearningAssistant, gradeLearningAssistantAssessment } from '../../src/services/learning/learningAssistantService';

const topic = initialTopics.find(item => item.id === 'py-functions')!;
const module = learningModules.find(item => item.topicId === topic.id)!;

describe('learning assistant', () => {
  it('answers explain, hint and example requests in the active topic context', () => {
    const assistant = new DeterministicLearningAssistant();
    expect(assistant.respond({ message: 'Explain return', context: { topic, module } }).text.toLowerCase()).toContain('return');
    expect(assistant.respond({ message: 'Give me a hint', intent: 'HINT', context: { topic, module } }).intent).toBe('HINT');
    expect(assistant.respond({ message: 'Show an example', intent: 'EXAMPLE', context: { topic, module } }).text).toContain('def add');
  });

  it('creates a five-question practice assessment without adaptive mutation', () => {
    const assistant = new DeterministicLearningAssistant();
    const response = assistant.respond({ message: 'sample assessment', context: { topic, module } });
    expect(response.assessment?.questions).toHaveLength(5);
    const answers = Object.fromEntries(response.assessment!.questions.map(question => [question.id, question.correctOptionIndex]));
    expect(gradeLearningAssistantAssessment(response.assessment!, answers)).toEqual({ correct: 5, total: 5, score: 100 });
  });
});
