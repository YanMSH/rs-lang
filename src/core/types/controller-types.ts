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
type WordStat = {
    right: number,
    mistakes: number
}
export type WordString = {
    [words: string]: WordStat | Record<string, never>;
}
export type DataStat = {
    learnedWordsAudio: number,
    learnedWordsSprint: number,
    audioCall: WordString | Record<string, never>,
    sprint: WordString | Record<string, never>
}
export type GlobalStat = {
    [gStat: string]: DataStat | Record<string, never>
}
export type Stat = {
    [answerStat: string]: OneStat | Record<string, never>;
}
export type NumStat = {
    [a: string]: number | number[];
}
export type renderStat = {
    rightDayWords?: NumStat | Record<string, never>,
    rightAudio?: NumStat | Record<string, never>,
    mistakesAudio?: NumStat | Record<string, never>,
    rightSprint?: NumStat | Record<string, never>,
    mistakesSprint?: NumStat | Record<string, never>,
}