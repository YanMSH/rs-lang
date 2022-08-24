import { UserWord, Word } from './controller-types';

export type UserReg = {
    name: string;
    email: string;
    password: string;
};

export type UserAuth = {
    email: string;
    password: string;
};

export type ResponseReg = {
    id: string;
    name: string | undefined;
    email: string | undefined;
};

export type ResponseAuth = {
    message: string;
    token: string | undefined;
    refreshToken: string | undefined;
    userId: string | undefined;
    name: string | undefined;
};

export type ResponseAggregatedWords = {
    paginatedResults: AWPaginatedResults;
    totalCount: { count: number }[];
}[];

export type AWPaginatedResults = (Word & { userWord: UserWord; group: number; page: number })[];

// export type UserWord = {
//     difficulty: 'weak' | 'medium' | 'hard',
//     optional: object
// }
