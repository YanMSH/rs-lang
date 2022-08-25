import Loader from '../../core/components/loader/loader';
import Storage from '../../core/components/service/storage/storage';
import { toggleHardNothard } from '../../core/components/service/utils/utils';
import { UserWord } from '../../core/types/controller-types';
import { AWPaginatedResults } from '../../core/types/loader-types';

export default class TextbookController {
    store: Storage;
    load: Loader;
    constructor() {
        this.store = new Storage();
        this.load = new Loader();
    }

    public async postHardWord(id: string): Promise<void> {
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

    public async postLearnedWord(id: string): Promise<void> {
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

    public async getLearnedAggregatedWords(): Promise<AWPaginatedResults | undefined> {
        try {
            const result = (await this.load.getFilteredWords('"userWord.optional.learned":true')) as AWPaginatedResults;
            return result;
        } catch (e) {
            console.log(e);
        }
    }

    public async getHardAggregatedWords(): Promise<AWPaginatedResults | undefined> {
        try {
            const result = (await this.load.getFilteredWords('"userWord.difficulty":"hard"')) as AWPaginatedResults;
            return result;
        } catch (e) {
            console.log(e);
        }
    }

    public async getAllHardAggregatedWords(): Promise<AWPaginatedResults | undefined> {
        try {
            const result = (await this.load.getAllFilteredWords('"userWord.difficulty":"hard"')) as AWPaginatedResults;
            return result;
        } catch (e) {
            console.log(e);
        }
    }

    public async getAllLearnedAggregatedWords(): Promise<AWPaginatedResults | undefined> {
        try {
            const result = (await this.load.getAllFilteredWords(
                '"userWord.optional.learned":true'
            )) as AWPaginatedResults;
            return result;
        } catch (e) {
            console.log(e);
        }
    }
}
