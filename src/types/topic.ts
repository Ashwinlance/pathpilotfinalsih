export interface Prerequisite {
  topicId: string;
  requiredMastery: number;
}

export interface Topic {
  id: string;
  competencyId: string;
  name: string;
  description: string;
  order: number;
  mastery: number;
  prerequisites: Prerequisite[];
}
