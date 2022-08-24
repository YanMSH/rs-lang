import Loader from '../../core/components/loader/loader';
import Storage from '../../core/components/service/storage/storage';
import { toggleHardNothard } from '../../core/components/service/utils/utils';
import { UserWord, UserWordServer } from '../../core/types/controller-types';
import { AWPaginatedResults } from '../../core/types/loader-types';

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
                difficulty: toggleHardNothard(oldData.difficulty),
                optional: (oldData as UserWord).optional,
            };
        }
        try {
            await this.load.postAuthorisedData('words', id, body as UserWord);
        } catch (e) {
            console.log(e);
        }
    }

    async postLearnedWord(id: string) {
        let oldData;
        try {
            oldData = (await this.load.getAuthorizedData('words', id)) as UserWord;
        } catch (e) {
            console.log(e);
            oldData = undefined;
        }
        let body;
        if (oldData === undefined) {
            body = {
                difficulty: undefined,
                optional: {
                    learned: true,
                    guessedRight: 0,
                    guessedWrong: 0,
                },
            };
        } else {
            body = {
                difficulty: oldData.difficulty,
                optional: {
                    learned: !oldData.optional.learned,
                    guessedRight: oldData.optional.guessedRight,
                    guessedWrong: oldData.optional.guessedWrong,
                },
            };
        }
        try {
            await this.load.postAuthorisedData('words', id, body as UserWord);
        } catch (e) {
            console.log(e);
        }
    }

    async getAllUserWords(): Promise<UserWordServer[] | undefined> {
        try {
            const result = (await this.load.getAuthorizedData('words', '')) as UserWordServer[];
            return result;
        } catch (e) {
            console.log(e);
        }
    }

    async getFilteredWords(wordsIds: string[]) {
        const userWords = (await this.getAllUserWords()) as UserWordServer[];
        if (userWords === undefined) {
            return;
        }
        const userWordsIds = userWords.map((item) => {
            return item.wordId;
        });
        const filteredWordsIds = wordsIds.filter((id) => userWordsIds.includes(id));
        return filteredWordsIds;
    }

    async getLearnedAggregatedWords() {
        try {
            const result = (await this.load.getLearnedWords()) as AWPaginatedResults;
            return result;
        } catch (e) {
            console.log(e);
        }
    }

    async getHardAggregatedWords() {
        try {
            const result = (await this.load.getPageHardWords()) as AWPaginatedResults;
            return result;
        } catch (e) {
            console.log(e);
        }
    }

    async getAllHardWords() {
        try {
            const result = (await this.load.getAllHardWords()) as AWPaginatedResults;
            return result;
        } catch (e) {
            console.log(e);
        }
    }

    async getAllLearnedWords() {
        try {
            const result = (await this.load.getAllLearnedWords()) as AWPaginatedResults;
            return result;
        } catch (e) {
            console.log(e);
        }
    }
}
