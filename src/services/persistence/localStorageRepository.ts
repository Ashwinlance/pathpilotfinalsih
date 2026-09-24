import type { Repository } from './repository';

export class LocalStorageRepository<T extends { id: string }> implements Repository<T> {
  constructor(private readonly namespace: string) {}
  private key(id: string) { return `${this.namespace}:${id}`; }
  async save(entity: T) { localStorage.setItem(this.key(entity.id), JSON.stringify(entity)); return entity; }
  async load(id: string) { const raw = localStorage.getItem(this.key(id)); return raw ? JSON.parse(raw) as T : undefined; }
  async loadAll() {
    const items: T[] = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i); if (key?.startsWith(`${this.namespace}:`)) { const raw = localStorage.getItem(key); if (raw) items.push(JSON.parse(raw) as T); }
    }
    return items;
  }
  async update(id: string, updater: (entity: T) => T) { const current = await this.load(id); if (!current) throw new Error(`Entity ${id} not found.`); return this.save(updater(current)); }
  async delete(id: string) { localStorage.removeItem(this.key(id)); }
}
