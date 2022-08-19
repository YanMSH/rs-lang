import { ResponseAuth } from '../../../types/loader-types';

export default class Storage {
    public inStore(fieldName: string): boolean {
        return !!localStorage.getItem(fieldName);
    }
    public set(fieldName: string, value: string | ResponseAuth): void {
        localStorage.setItem(fieldName, JSON.stringify(value));
    }
    public get(fieldName: string): string | null {
        if (this.inStore(fieldName)) {
            return JSON.parse(localStorage.getItem(fieldName) as string);
        } else {
            return null;
        }
    }
}
