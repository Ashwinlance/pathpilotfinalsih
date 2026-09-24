import type { AssessmentMaterial, Question } from '../../types/assessment';

export interface AssessmentTopicReference {
  id: string;
  name: string;
  description: string;
}

export interface QuestionGenerationRequest {
  material: AssessmentMaterial;
  topics: AssessmentTopicReference[];
  count: number;
}

export interface QuestionGenerationService {
  generateFromApprovedMaterial(input: QuestionGenerationRequest): Question[];
}

export class DeterministicQuestionGenerator implements QuestionGenerationService {
  generateFromApprovedMaterial(input: QuestionGenerationRequest): Question[] {
    const { material, topics, count } = input;
    if (topics.length === 0 || count <= 0 || !material.content.trim()) return [];

    const snippets = splitMaterial(material.content);
    return Array.from({ length: count }, (_, index) => {
      const topic = topics[index % topics.length];
      const snippet = snippets[index % snippets.length];
      const difficulty = difficultyFor(index, count);
      const correct = `${topic.name}: apply the governed concept explicitly and verify the result.`;
      const distractors = [
        `Skip the ${topic.name} concept and rely on hidden behavior.`,
        `Mix unrelated responsibilities without checking the outcome.`,
        `Ignore the approved material and assume the result is correct.`,
      ];
      const correctOptionIndex = index % 4;
      const options = insertAt(distractors, correctOptionIndex, correct);

      return {
        id: `generated-${material.id}-${index + 1}`,
        competencyId: material.competencyId,
        topicId: topic.id,
        prompt: `${difficultyLabel(difficulty)} · ${topic.name}: Based on the approved material excerpt “${snippet}”, which choice best demonstrates ${topic.description.toLowerCase()}?`,
        options,
        correctOptionIndex,
        difficulty,
        sourceId: material.id,
      };
    });
  }
}

function splitMaterial(content: string): string[] {
  const chunks = content
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map(chunk => chunk.trim())
    .filter(Boolean)
    .map(chunk => chunk.length > 135 ? `${chunk.slice(0, 132)}...` : chunk);
  return chunks.length ? chunks : ['Approved learning material'];
}

function difficultyFor(index: number, count: number): Question['difficulty'] {
  const position = index / Math.max(count, 1);
  if (position < 1 / 3) return 'FOUNDATION';
  if (position < 2 / 3) return 'INTERMEDIATE';
  return 'ADVANCED';
}

function difficultyLabel(difficulty: Question['difficulty']) {
  return difficulty.charAt(0) + difficulty.slice(1).toLowerCase();
}

function insertAt(items: string[], index: number, value: string) {
  const copy = [...items];
  copy.splice(index, 0, value);
  return copy;
}
