import type {
  AssessmentAnswer,
  DiagnosticAssessment,
  DiagnosticConfig,
  DiagnosticResult,
  Question,
  TopicAnalysis,
  TopicStrength,
} from '../../types/assessment';

export function createInitialDiagnostic(input: {
  id: string;
  learnerId: string;
  config: DiagnosticConfig;
  questions: Question[];
  createdAt?: string;
}): DiagnosticAssessment {
  const selected = input.config.questionIds
    .map(id => input.questions.find(question => question.id === id))
    .filter((question): question is Question => Boolean(question));

  if (selected.length !== input.config.questionIds.length) {
    throw new Error('Initial diagnostic question configuration is incomplete.');
  }
  if (selected.some(question => question.competencyId !== input.config.competencyId)) {
    throw new Error('Initial diagnostic contains a question from a different competency.');
  }

  return {
    id: input.id,
    kind: 'INITIAL_DIAGNOSTIC',
    learnerId: input.learnerId,
    competencyId: input.config.competencyId,
    questionIds: selected.map(question => question.id),
    createdAt: input.createdAt ?? new Date().toISOString(),
  };
}

export function gradeInitialDiagnostic(input: {
  assessment: DiagnosticAssessment;
  answers: AssessmentAnswer[];
  questions: Question[];
  config: DiagnosticConfig;
  completedAt?: string;
}): DiagnosticResult {
  const { assessment, answers, questions, config } = input;
  if (assessment.competencyId !== config.competencyId) {
    throw new Error('Diagnostic configuration does not match assessment competency.');
  }

  const selected = assessment.questionIds
    .map(id => questions.find(question => question.id === id))
    .filter((question): question is Question => Boolean(question));
  if (selected.length !== assessment.questionIds.length) {
    throw new Error('Diagnostic question set is incomplete.');
  }

  const answerMap = new Map(answers.map(answer => [answer.questionId, answer.selectedOptionIndex]));
  if (selected.some(question => !answerMap.has(question.id))) {
    throw new Error('All initial diagnostic questions must be answered.');
  }

  const topicIds = [...new Set(selected.map(question => question.topicId))];
  const topicAnalysis: TopicAnalysis[] = topicIds.map(topicId => {
    const topicQuestions = selected.filter(question => question.topicId === topicId);
    const correct = topicQuestions.filter(question => answerMap.get(question.id) === question.correctOptionIndex).length;
    const percentage = topicQuestions.length ? Math.round((correct / topicQuestions.length) * 100) : 0;
    return {
      topicId,
      correct,
      total: topicQuestions.length,
      percentage,
      strength: classifyTopic(percentage),
    };
  });

  const configuredWeightTotal = topicAnalysis.reduce((total, topic) => total + (config.topicWeights[topic.topicId] ?? 0), 0);
  if (configuredWeightTotal <= 0) throw new Error('Diagnostic topic weights must total more than zero.');
  const weightedScore = topicAnalysis.reduce((total, topic) => {
    const normalizedWeight = (config.topicWeights[topic.topicId] ?? 0) / configuredWeightTotal;
    return total + topic.percentage * normalizedWeight;
  }, 0);

  return {
    assessmentId: assessment.id,
    learnerId: assessment.learnerId,
    competencyId: assessment.competencyId,
    answers,
    score: Math.round(weightedScore),
    topicAnalysis,
    completedAt: input.completedAt ?? new Date().toISOString(),
  };
}

function classifyTopic(score: number): TopicStrength {
  return score >= 80 ? 'STRONG' : score >= 55 ? 'DEVELOPING' : 'PRIORITY_GAP';
}
