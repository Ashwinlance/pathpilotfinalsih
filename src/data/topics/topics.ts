import type { Topic } from '../../types/topic';

export const initialTopics: Topic[] = [
  { id: 'py-basics', competencyId: 'comp-python', name: 'Python Basics', description: 'Variables, control flow and basic types.', order: 1, mastery: 82, prerequisites: [] },
  { id: 'py-functions', competencyId: 'comp-python', name: 'Python Functions', description: 'Functions, parameters, return values and scope.', order: 2, mastery: 42, prerequisites: [{ topicId: 'py-basics', requiredMastery: 70 }] },
  { id: 'py-data', competencyId: 'comp-python', name: 'Python Data Structures', description: 'Lists, dictionaries and data transformations.', order: 3, mastery: 38, prerequisites: [{ topicId: 'py-functions', requiredMastery: 70 }] },
  { id: 'py-analysis', competencyId: 'comp-python', name: 'Analytical Python', description: 'Composable analysis workflows.', order: 4, mastery: 24, prerequisites: [{ topicId: 'py-data', requiredMastery: 65 }] },
  { id: 'stats-descriptive', competencyId: 'comp-stats', name: 'Descriptive Statistics', description: 'Center, spread and distributions.', order: 1, mastery: 72, prerequisites: [] },
  { id: 'stats-probability', competencyId: 'comp-stats', name: 'Probability Reasoning', description: 'Events, conditional probability and uncertainty.', order: 2, mastery: 61, prerequisites: [{ topicId: 'stats-descriptive', requiredMastery: 65 }] },
  { id: 'viz-principles', competencyId: 'comp-viz', name: 'Visualization Principles', description: 'Encoding, perception and chart selection.', order: 1, mastery: 74, prerequisites: [] },
  { id: 'viz-story', competencyId: 'comp-viz', name: 'Data Storytelling', description: 'Narrative structure and decision-focused presentation.', order: 2, mastery: 68, prerequisites: [{ topicId: 'viz-principles', requiredMastery: 70 }] },
];
