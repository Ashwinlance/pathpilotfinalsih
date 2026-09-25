import type { TopicPracticeAnswer, TopicPracticeQuestion, RecapOffer, RecapResult, RecapTopicResult } from '../../types/learning';

export const DEFAULT_RECAP_INACTIVITY_DAYS = 7;
export const DEFAULT_RECAP_QUESTION_COUNT = 5;

export function createManualRecapOffer(learnedTopicIds: string[]): RecapOffer | undefined {
  const topicIds = [...new Set(learnedTopicIds)];
  if (topicIds.length === 0) return undefined;
  return { daysAway: 0, topicIds, status: 'OFFERED' };
}

export function detectRecapOffer(input: {
  lastActiveAt?: string;
  learnedTopicIds: string[];
  now?: string;
  inactivityDays?: number;
}): RecapOffer | undefined {
  if (!input.lastActiveAt || input.learnedTopicIds.length === 0) return undefined;
  const nowMs = new Date(input.now ?? new Date().toISOString()).getTime();
  const lastMs = new Date(input.lastActiveAt).getTime();
  if (!Number.isFinite(nowMs) || !Number.isFinite(lastMs) || nowMs <= lastMs) return undefined;
  const daysAway = Math.floor((nowMs - lastMs) / 86_400_000);
  const threshold = input.inactivityDays ?? DEFAULT_RECAP_INACTIVITY_DAYS;
  if (daysAway < threshold) return undefined;
  return {
    daysAway,
    topicIds: [...new Set(input.learnedTopicIds)],
    status: 'OFFERED',
  };
}

export function buildRecapQuestions(
  topicIds: string[],
  questionBank: TopicPracticeQuestion[],
  count = DEFAULT_RECAP_QUESTION_COUNT,
  seed = 'pathpilot-recap',
): TopicPracticeQuestion[] {
  const eligible = topicIds
    .map(topicId => questionBank
      .filter(question => question.topicId === topicId)
      .sort((a, b) => seededRank(a.id, seed) - seededRank(b.id, seed)))
    .filter(group => group.length > 0);
  if (eligible.length === 0) return [];

  const selected: TopicPracticeQuestion[] = [];
  let offset = 0;
  while (selected.length < count) {
    let added = false;
    for (const group of eligible) {
      const question = group[offset % group.length];
      if (question && !selected.some(existing => existing.id === question.id)) {
        selected.push(question);
        added = true;
        if (selected.length === count) break;
      }
    }
    offset += 1;
    if (!added || offset > 20) break;
  }
  return selected;
}

function levelFor(score: number): RecapTopicResult['level'] {
  if (score < 70) return 'WEAK';
  if (score < 85) return 'DEVELOPING';
  return 'RETAINED';
}

export function gradeRecap(
  questions: TopicPracticeQuestion[],
  answers: TopicPracticeAnswer[],
  at = new Date().toISOString(),
): RecapResult {
  if (questions.length === 0) throw new Error('Recap requires at least one question.');
  const answerMap = new Map(answers.map(answer => [answer.questionId, answer.selectedOptionIndex]));
  const topicIds = [...new Set(questions.map(question => question.topicId))];

  const topicResults = topicIds.map(topicId => {
    const topicQuestions = questions.filter(question => question.topicId === topicId);
    const correct = topicQuestions.reduce((sum, question) => sum + (answerMap.get(question.id) === question.correctOptionIndex ? 1 : 0), 0);
    const score = Math.round((correct / topicQuestions.length) * 100);
    return { topicId, correct, total: topicQuestions.length, score, level: levelFor(score) } satisfies RecapTopicResult;
  });

  const correct = questions.reduce((sum, question) => sum + (answerMap.get(question.id) === question.correctOptionIndex ? 1 : 0), 0);
  const score = Math.round((correct / questions.length) * 100);
  return {
    correct,
    total: questions.length,
    score,
    topicResults,
    weakTopicIds: topicResults.filter(result => result.level === 'WEAK').map(result => result.topicId),
    completedAt: at,
  };
}

function seededRank(value: string, seed: string) {
  const input = `${seed}:${value}`;
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
