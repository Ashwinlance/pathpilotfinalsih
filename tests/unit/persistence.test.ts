import { describe, expect, it } from 'vitest';
import { MemoryRepository } from '../../src/services/persistence/memoryRepository';

describe('repository abstraction', () => {
  it('supports save, load, update, delete and repeat-run behavior', async () => {
    const repo = new MemoryRepository<{ id: string; value: number }>();
    await repo.save({ id: 'a', value: 1 }); await repo.save({ id: 'a', value: 1 }); expect((await repo.loadAll())).toHaveLength(1);
    await repo.update('a', e => ({ ...e, value: 2 })); expect((await repo.load('a'))?.value).toBe(2);
    await repo.delete('a'); expect(await repo.load('a')).toBeUndefined();
  });
});
