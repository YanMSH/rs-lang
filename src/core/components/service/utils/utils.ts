import { ResponseAuth } from "../../../types/loader-types";
import Storage from "../storage/storage";

const store = new Storage();

export const buildAuthorizedEndpoint = (endpoint: string) => {
    const userId = (store.get('user') as ResponseAuth).userId;
    return `users/${userId}/${endpoint}/`
}