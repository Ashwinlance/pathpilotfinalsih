import type { LearnerActivitySnapshot } from '../../types/learning';

const KEY_PREFIX = 'pathpilot:learner-activity:';

function storageAvailable() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadLearnerActivity(learnerId: string): LearnerActivitySnapshot | undefined {
  if (!storageAvailable()) return undefined;
  const raw = window.localStorage.getItem(`${KEY_PREFIX}${learnerId}`);
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as LearnerActivitySnapshot;
  } catch {
    return undefined;
  }
}

export function saveLearnerActivity(snapshot: LearnerActivitySnapshot): void {
  if (!storageAvailable()) return;
  window.localStorage.setItem(`${KEY_PREFIX}${snapshot.learnerId}`, JSON.stringify(snapshot));
}
