interface IEntity {
    id: string;
}

export class Library<T extends IEntity> {
    private items: T[] = [];

    constructor(initialItems: T[] = []) {
        this.items = initialItems;
    }

    public add(item: T): void {
        this.items.push(item);
    }

    public remove(id: string): void {
        this.items = this.items.filter((item) => item.id !== id);
    }

    public findById(id: string): T | undefined {
        return this.items.find((item) => item.id === id);
    }

    public getAll(): T[] {
        return this.items;
    }

    public search(predicate: (item: T) => boolean): T[] {
        return this.items.filter(predicate);
    }
}
