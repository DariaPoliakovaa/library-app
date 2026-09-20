export class Storage {
    public static save<T>(key: string, data: T): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    public static get<T>(key: string): T | null {
        const data = localStorage.getItem(key);
        if (!data) return null;

        try {
            return JSON.parse(data) as T;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(`Помилка парсингу даних для ключа ${key}:`, error);
            return null;
        }
    }

    public static remove(key: string): void {
        localStorage.removeItem(key);
    }

    public static clear(): void {
        localStorage.clear();
    }
}
