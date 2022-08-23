import Loader from '../../core/components/loader/loader';
import Storage from '../../core/components/service/storage/storage';
import { UserWord, UserWordServer } from '../../core/types/controller-types';

export default class TextbookController {
    store: Storage;
    load: Loader;
    constructor() {
        this.store = new Storage();
        this.load = new Loader();
    }

    // getToken(): string{
    //   const userData = this.store.get('user') as ResponseAuth;
    //   return userData.token as string;
    // }

    async postHardWord(id: string) {
        let oldData;
        try {
            oldData = await this.load.getAuthorizedData('words', id);
        } catch (e) {
            console.log(e);
            oldData = undefined;
        }
        let body;
        if (oldData === undefined) {
            body = {
                difficulty: 'hard',
                optional: {
                    learned: false,
                    guessedRight: 0,
                    guessedWrong: 0,
                },
            };
        } else {
            body = {
                difficulty: 'hard',
                optional: (oldData as UserWord).optional,
            };
        }
        try {
            await this.load.postAuthorisedData('words', id, body as UserWord);
        } catch (e) {
            console.log(e);
        }
    }

    async getAllUserWords(): Promise<UserWordServer[]> {
        const result = (await this.load.getAuthorizedData('words', '')) as UserWordServer[];
        return result;
    }

    async getFilteredWords(wordsIds: string[]) {
        const userWords = await this.getAllUserWords();
        const userWordsIds = userWords.map((item) => {
            return item.wordId;
        });
        const filteredWordsIds = wordsIds.filter((id) => userWordsIds.includes(id));
        return filteredWordsIds;
    }
}
