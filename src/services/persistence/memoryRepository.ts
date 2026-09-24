import type { Repository } from './repository';

export class MemoryRepository<T extends { id: string }> implements Repository<T> {
  private readonly data = new Map<string, T>();
  constructor(seed: T[] = []) { seed.forEach(item => this.data.set(item.id, structuredClone(item))); }
  async save(entity: T) { this.data.set(entity.id, structuredClone(entity)); return structuredClone(entity); }
  async load(id: string) { const item = this.data.get(id); return item ? structuredClone(item) : undefined; }
  async loadAll() { return [...this.data.values()].map(item => structuredClone(item)); }
  async update(id: string, updater: (entity: T) => T) {
    const current = this.data.get(id); if (!current) throw new Error(`Entity ${id} not found.`);
    const next = updater(structuredClone(current)); this.data.set(id, structuredClone(next)); return structuredClone(next);
  }
  async delete(id: string) { this.data.delete(id); }
}
