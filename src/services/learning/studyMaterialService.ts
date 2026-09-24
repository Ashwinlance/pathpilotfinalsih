import type {
  LearnerStudyMaterial,
  StudyPack,
  StudyQuizAnswer,
  StudyQuizQuestion,
  StudyQuizResult,
} from '../../types/learning';

const STOP_WORDS = new Set([
  'about', 'after', 'again', 'also', 'because', 'before', 'being', 'between', 'could', 'each', 'from', 'have', 'into', 'more', 'most', 'other', 'should', 'than', 'that', 'their', 'there', 'these', 'they', 'this', 'through', 'using', 'when', 'where', 'which', 'while', 'with', 'would', 'your',
]);

export function generateStudyPack(material: LearnerStudyMaterial): StudyPack {
  const content = normalize(material.content);
  if (!content) throw new Error('Study material is empty.');

  const sentences = splitSentences(content);
  const keywordFrequency = buildKeywordFrequency(content);
  const ranked = sentences
    .map((sentence, index) => ({ sentence, index, score: sentenceScore(sentence, keywordFrequency) }))
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const summaryItems = ranked.slice(0, Math.min(3, ranked.length)).sort((a, b) => a.index - b.index);
  const summary = summaryItems.map(item => item.sentence).join(' ');
  const keyPoints = uniqueStrings(ranked.map(item => tidyPoint(item.sentence))).slice(0, 5);
  const questions = buildQuestions(material, sentences, keywordFrequency, 7);

  return {
    id: `study-pack-${material.id}`,
    material,
    summary,
    keyPoints,
    questions,
    generatedAt: new Date().toISOString(),
  };
}

export function gradeStudyQuiz(questions: StudyQuizQuestion[], answers: StudyQuizAnswer[]): StudyQuizResult {
  const answerMap = new Map(answers.map(answer => [answer.questionId, answer.selectedOptionIndex]));
  const correct = questions.reduce((count, question) => count + (answerMap.get(question.id) === question.correctOptionIndex ? 1 : 0), 0);
  return {
    correct,
    total: questions.length,
    score: questions.length ? Math.round((correct / questions.length) * 100) : 0,
    completedAt: new Date().toISOString(),
  };
}

function buildQuestions(
  material: LearnerStudyMaterial,
  sentences: string[],
  keywordFrequency: Map<string, number>,
  count: number,
): StudyQuizQuestion[] {
  const globalKeywords = [...keywordFrequency.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([word]) => word);

  const candidates = sentences.flatMap((sentence, sentenceIndex) => {
    const terms = sentence
      .match(/[A-Za-z][A-Za-z0-9_-]{3,}/g)
      ?.map(term => term.toLowerCase())
      .filter(term => !STOP_WORDS.has(term)) ?? [];
    return uniqueStrings(terms)
      .sort((a, b) => (keywordFrequency.get(b) ?? 0) - (keywordFrequency.get(a) ?? 0) || b.length - a.length)
      .slice(0, 2)
      .map(term => ({ sentence, sentenceIndex, term }));
  });

  const usable = candidates.length ? candidates : [{ sentence: sentences[0] ?? material.title, sentenceIndex: 0, term: 'concept' }];

  return Array.from({ length: count }, (_, index) => {
    const candidate = usable[index % usable.length];
    const correct = candidate.term;
    const prompt = makeClozePrompt(candidate.sentence, correct, material.title);
    const distractors = chooseDistractors(correct, globalKeywords, index);
    const correctOptionIndex = index % 4;
    const options = [...distractors];
    options.splice(correctOptionIndex, 0, correct);

    return {
      id: `${material.id}-study-q${index + 1}`,
      topicId: material.topicId,
      prompt,
      options,
      correctOptionIndex,
      sourceMaterialId: material.id,
    };
  });
}

function makeClozePrompt(sentence: string, term: string, title: string): string {
  const expression = new RegExp(`\\b${escapeRegExp(term)}\\b`, 'i');
  const replaced = sentence.replace(expression, '_____');
  if (replaced !== sentence) return `Based on “${title}”, choose the word that best completes: ${replaced}`;
  return `Based on “${title}”, which concept is emphasized in this material?`;
}

function chooseDistractors(correct: string, globalKeywords: string[], seed: number): string[] {
  const pool = globalKeywords.filter(word => word !== correct);
  const fallback = ['workflow', 'evidence', 'analysis', 'practice', 'result', 'method'];
  const merged = uniqueStrings([...pool, ...fallback]).filter(word => word !== correct);
  const start = merged.length ? seed % merged.length : 0;
  const rotated = [...merged.slice(start), ...merged.slice(0, start)];
  return rotated.slice(0, 3).map(word => word || 'concept');
}

function buildKeywordFrequency(content: string): Map<string, number> {
  const frequency = new Map<string, number>();
  const words = content.toLowerCase().match(/[a-z][a-z0-9_-]{3,}/g) ?? [];
  for (const word of words) {
    if (STOP_WORDS.has(word)) continue;
    frequency.set(word, (frequency.get(word) ?? 0) + 1);
  }
  return frequency;
}

function sentenceScore(sentence: string, frequency: Map<string, number>): number {
  const words = sentence.toLowerCase().match(/[a-z][a-z0-9_-]{3,}/g) ?? [];
  const keywordScore = words.reduce((sum, word) => sum + (frequency.get(word) ?? 0), 0);
  const lengthBonus = Math.min(words.length, 24) / 24;
  return keywordScore + lengthBonus;
}

function splitSentences(content: string): string[] {
  const sentences = content
    .split(/(?<=[.!?])\s+|\n+/)
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 20);
  return sentences.length ? sentences : [content];
}

function normalize(content: string) {
  return content.replace(/\r/g, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

function tidyPoint(sentence: string) {
  const trimmed = sentence.trim().replace(/^[-•\d.)\s]+/, '');
  return trimmed.length > 180 ? `${trimmed.slice(0, 177)}...` : trimmed;
}

function uniqueStrings(values: string[]) {
  const seen = new Set<string>();
  return values.filter(value => {
    const key = value.toLowerCase().trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
