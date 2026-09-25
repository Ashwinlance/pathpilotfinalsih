import type { Competency } from '../../types/competency';

export const competencies: Competency[] = [
  { id: 'comp-python', name: 'Python Programming', description: 'Write reliable Python for analysis and automation.', topicIds: ['py-basics', 'py-functions', 'py-data', 'py-analysis'] },
  { id: 'comp-stats', name: 'Statistics', description: 'Use descriptive and inferential statistical reasoning.', topicIds: ['stats-descriptive', 'stats-probability'] },
  { id: 'comp-viz', name: 'Data Visualization', description: 'Communicate quantitative insights clearly.', topicIds: ['viz-principles', 'viz-story'] },
];
