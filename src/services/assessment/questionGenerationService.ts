import type { Question } from '../../types/assessment';

export interface QuestionGenerationService {
  generateFromApprovedMaterial(competencyId: string, topicIds: string[], count: number): Question[];
}

export class DeterministicQuestionGenerator implements QuestionGenerationService {
  generateFromApprovedMaterial(competencyId: string, topicIds: string[], count: number): Question[] {
    if (topicIds.length === 0 || count <= 0) return [];
    return Array.from({ length: count }, (_, index) => ({
      id: `generated-${competencyId}-${index + 1}`,
      competencyId,
      topicId: topicIds[index % topicIds.length],
      prompt: `Deterministic prototype question ${index + 1}`,
      options: ['Approved concept', 'Distractor A', 'Distractor B', 'Distractor C'],
      correctOptionIndex: 0,
      difficulty: index < Math.ceil(count / 3) ? 'FOUNDATION' : index < Math.ceil((2 * count) / 3) ? 'INTERMEDIATE' : 'ADVANCED',
      sourceId: 'mock-approved-material',
    }));
  }
}
