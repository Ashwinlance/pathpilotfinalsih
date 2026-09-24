import { describe, expect, it } from 'vitest';
import { calculateRoleSkillReadiness } from '../../src/services/competency/roleReadinessService';
import { demoLearnerState } from '../../src/data/learners/demoLearner';
import { demoRole } from '../../src/data/roles/demoRole';
import { competencies } from '../../src/data/competencies/competencies';

describe('role readiness', () => {
  it('derives required skills and gaps from the selected target role', () => {
    const readiness = calculateRoleSkillReadiness({ learnerState: demoLearnerState, targetRole: demoRole, competencies });
    const python = readiness.find(item => item.competencyId === 'comp-python');
    const sql = readiness.find(item => item.competencyId === 'comp-sql');
    expect(readiness).toHaveLength(demoRole.competencyRequirements.length);
    expect(python).toMatchObject({ competencyName: 'Python Programming', currentLevel: 48, requiredLevel: 80, gap: 32, status: 'PRIORITY_GAP' });
    expect(sql).toMatchObject({ currentLevel: 54, requiredLevel: 78, gap: 24 });
  });

  it('uses updated target-role requirements without changing learner competency', () => {
    const governedRole = { ...demoRole, competencyRequirements: demoRole.competencyRequirements.map(item => item.competencyId === 'comp-python' ? { ...item, requiredLevel: 85 } : item) };
    const readiness = calculateRoleSkillReadiness({ learnerState: demoLearnerState, targetRole: governedRole, competencies });
    const python = readiness.find(item => item.competencyId === 'comp-python')!;
    expect(python.currentLevel).toBe(48);
    expect(python.requiredLevel).toBe(85);
    expect(python.gap).toBe(37);
  });
});
