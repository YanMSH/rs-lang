import Loader from '../../core/components/loader/loader';
import Storage from '../../core/components/service/storage/storage';
import { toggleHardNothard } from '../../core/components/service/utils/utils';
import { GlobalStat, TBWords, UserWord } from '../../core/types/controller-types';
import { AWPaginatedResults, Statistic } from '../../core/types/loader-types';

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
                    notNew: true,
                },
            };
        } else {
            body = {
                difficulty: toggleHardNothard(oldData.difficulty),
                optional: {
                    learned: false,
                    guessedRight: oldData.optional.guessedRight,
                    guessedWrong: oldData.optional.guessedWrong,
                    notNew: true,
                },
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
                    notNew: true,
                },
            };
        } else {
            body = {
                difficulty: 'nothard',
                optional: {
                    learned: !oldData.optional.learned,
                    guessedRight: oldData.optional.guessedRight,
                    guessedWrong: oldData.optional.guessedWrong,
                    notNew: true,
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

    public async getAmountOfNewWords() {
        try {
            const result = (await this.load.getAmountOfFilteredWords('"userWord.optional.notNew":true')) as number;
            return result;
        } catch (e) {
            console.log(e);
        }
    }

    public async getAmountOfHardWords() {
        try {
            const result = (await this.load.getAmountOfFilteredWords('"userWord.difficulty":"hard"')) as number;
            return result;
        } catch (e) {
            console.log(e);
        }
    }

    public async getAmountOfLearnedWords() {
        try {
            const result = (await this.load.getAmountOfFilteredWords('"userWord.optional.learned":true')) as number;
            return result;
        } catch (e) {
            console.log(e);
        }
    }

    public async updateTextbookStats() {
        const today = new Date(Date.now());
        const todayString = today.toLocaleDateString();
        try {
            const fetchStat = (await this.load.getStatistic('statistics')) as Statistic;
            const optionalStat = fetchStat.optional as GlobalStat;
            const todayStats = optionalStat[todayString];
            const textbookData = {
                new: await this.getAmountOfNewWords(),
                hard: await this.getAmountOfHardWords(),
                learned: await this.getAmountOfLearnedWords(),
            } as TBWords;
            todayStats.textbook = textbookData;
            this.load.putStatistic('statistics', optionalStat, 0);
        } catch (e) {
            console.log(e);
        }
    }

    public async getAmountOfGuessedWords(gameName: string, guess?: 'right' | 'mistakes') {
        const today = new Date(Date.now());
        const todayString = today.toLocaleDateString();
        try {
            const result = await this.load.getStatistic('statistics');

            const gameWords = result['optional'][todayString][gameName] as object;
            if (guess === undefined) {
                return Object.values(gameWords).length;
            }
            return Object.values(gameWords).filter((item) => item[guess]).length;
        } catch (e) {
            console.log(e);
        }
    }

    public async getStreakInfo(gameName: 'sprint' | 'audioCall') {
        const today = new Date(Date.now());
        const todayString = today.toLocaleDateString();
        try {
            const result = await this.load.getStatistic('statistics');
            if (gameName === 'sprint') {
                return result['optional'][todayString]['longSessionSprint'];
            } else {
                return result['optional'][todayString]['longSessionAudio'];
            }
        } catch (e) {
            console.log(e);
        }
    }

    public async getTextbookData() {
        const today = new Date(Date.now());
        const todayString = today.toLocaleDateString();
        try {
            const result = await this.load.getStatistic('statistics');
            return result['optional'][todayString]['textbook'];
        } catch (e) {
            console.log(e);
        }
    }

    public async getCurrentStatData() {
        const today = new Date(Date.now());
        const todayString = today.toLocaleDateString();
        try {
            const result = await this.load.getStatistic('statistics');
            return result['optional'][todayString];
        } catch (e) {
            console.log(e);
            const emptyData: GlobalStat = {};
            emptyData[todayString] = {
                learnedWordsAudio: 0,
                learnedWordsSprint: 0,
                longSessionAudio: 0,
                longSessionSprint: 0,
                audioCall: { empty: { right: 0, mistakes: 0 } },
                sprint: { empty: { right: 0, mistakes: 0 } },
                textbook: {
                    new: 0,
                    hard: 0,
                    learned: 0,
                }
            }
            return await this.load.putStatistic('statistics', emptyData, 0);
        }
    }
}
