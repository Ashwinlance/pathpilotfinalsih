export interface Repository<T extends { id: string }> {
  save(entity: T): Promise<T>;
  load(id: string): Promise<T | undefined>;
  loadAll(): Promise<T[]>;
  update(id: string, updater: (entity: T) => T): Promise<T>;
  delete(id: string): Promise<void>;
}
