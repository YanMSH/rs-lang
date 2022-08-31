export type Word = {
    audio: string;
    audioExample: string;
    audioMeaning: string;
    group: number;
    id: string;
    image: string;
    page: number;
    textExample: string;
    textExampleTranslate: string;
    textMeaning: string;
    textMeaningTranslate: string;
    transcription: string;
    word: string;
    wordTranslate: string;
    _id: string | undefined;
};

export type UserWord = {
    difficulty: 'hard' | 'nothard' | undefined;
    optional: {
        learned: boolean;
        guessedRight: number;
        guessedWrong: number;
    };
};

export type UserWordServer = UserWord & {
    id: string;
    wordId: string;
};

type OneStat = {
    local: number,
    global: number,
    general: number,
    option: string[],
    inThisGame: boolean
}

export type Stat = {
    [answerStat: string]: OneStat | Record<string, never>;
}