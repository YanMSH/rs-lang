import { Word } from '../../types/controller-types';
import Loader from '../loader/loader';

export default class Controller {
    load: Loader;
    constructor() {
        this.load = new Loader();
    }
    async getWords(page = 0, group = 0): Promise<Word[]> {
        return await this.load.get(`words?page=${page}&group=${group}`);
    }
}
