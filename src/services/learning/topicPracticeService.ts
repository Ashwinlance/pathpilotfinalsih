import type { TopicPracticeAnswer, TopicPracticeQuestion, TopicPracticeResult } from '../../types/learning';

export function gradeTopicPractice(
  topicId: string,
  questions: TopicPracticeQuestion[],
  answers: TopicPracticeAnswer[],
  at = new Date().toISOString(),
): TopicPracticeResult {
  const topicQuestions = questions.filter(question => question.topicId === topicId);
  if (topicQuestions.length === 0) {
    throw new Error(`No topic practice questions configured for ${topicId}.`);
  }

  const answerMap = new Map(answers.map(answer => [answer.questionId, answer.selectedOptionIndex]));
  const correct = topicQuestions.reduce((count, question) => {
    return count + (answerMap.get(question.id) === question.correctOptionIndex ? 1 : 0);
  }, 0);

  return {
    topicId,
    correct,
    total: topicQuestions.length,
    score: Math.round((correct / topicQuestions.length) * 100),
    completedAt: at,
  };
}
