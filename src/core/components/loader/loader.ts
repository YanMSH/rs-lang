import {
    ALL_WORDS_PER_GROUP,
    AuthMessages,
    Endpoints,
    Requests,
    serverURL,
    StatusCodes,
} from '../../constants/loader-const';
import { UserWord } from '../../types/controller-types';
import { ResponseAggregatedWords, ResponseAuth, UserAuth, UserReg } from '../../types/loader-types';
import Storage from '../service/storage/storage';
import { buildAuthorizedEndpoint } from '../service/utils/utils';

export default class Loader {
    store: Storage;
    constructor() {
        this.store = new Storage();
    }
    async get(endpoint: string) {
        const response = await fetch(serverURL + endpoint);
        if (response.ok) {
            return await response.json();
        }
        throw response.json();
    }

    async getAuthorizedData(endpoint: string, wordId: string) {
        // TODO Handle case when token is outdated!
        const token = (this.store.get('user') as ResponseAuth).token;
        const response = await fetch(serverURL + buildAuthorizedEndpoint(endpoint) + wordId, {
            method: Requests.get,
            //       credentials: 'include',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            return await response.json();
        } else {
            console.log('resp status', response.status);
            throw await response.text();
        }
    }

    async postAuthorisedData(endpoint: string, wordId: string, body: UserWord) {
        const token = (this.store.get('user') as ResponseAuth).token;
        const response = await fetch(serverURL + buildAuthorizedEndpoint(endpoint) + wordId, {
            method: Requests.post,
            //       credentials: 'include',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (response.ok) {
            return await response.json();
        } else {
            throw await response.text();
        }
    }

    async getHardWords() {
        const token = (this.store.get('user') as ResponseAuth).token;
        const response = await fetch(
            serverURL + buildAuthorizedEndpoint('aggregatedwords') + '?&filter={"userWord.difficulty":"hard"}',
            {
                method: Requests.get,
                //       credentials: 'include',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.ok) {
            return await response.json();
        } else {
            console.log('resp status', response.status);
            throw await response.text();
        }
    }

    async getLearnedWords() {
        const token = (this.store.get('user') as ResponseAuth).token;
        const group = this.store.get('group') as number;
        const page = this.store.get('page') as number;
        const response = await fetch(
            serverURL +
                buildAuthorizedEndpoint('aggregatedwords') +
                `?&group=${group}&wordsPerPage=${ALL_WORDS_PER_GROUP}&filter={"$and":[{"userWord.optional.learned":true,"page":${page}}]}`,
            {
                method: Requests.get,
                //       credentials: 'include',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.ok) {
            const responseArray = (await response.json()) as ResponseAggregatedWords;
            const result = responseArray[0];
            const aggregatedWords = result.paginatedResults;
            return aggregatedWords;
        } else {
            console.log('resp status', response.status);
            throw await response.text();
        }
    }

    // async getNewTokens(){
    //     const userData = this.store.get('user') as ResponseAuth;
    //     const response = await fetch(serverURL + Endpoints.users + userData.userId, {
    //         method: 'GET',
    //         headers: {
    //             'Authorization': `Bearer ${userData.refreshToken}`,
    // 	'Accept': 'application/json',
    // 	'Content-Type': 'application/json'
    //         }
    //     })
    // }
    // TODO:MOVE TO A SEPARATE FILE
    async createUser(user: UserReg) {
        const response = await fetch(serverURL + Endpoints.users, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        if (response.status === StatusCodes.ok) {
            return await response.json();
        } else if (response.status === StatusCodes.expectationFailed) {
            return {
                id: response.status.toString(),
                name: undefined,
                email: undefined,
            };
        } else if (response.status === StatusCodes.incorrectAuthInput) {
            return {
                id: response.status.toString(),
                name: undefined,
                email: undefined,
            };
        }
    }
    // TODO:MOVE TO A SEPARATE FILE
    async authUser(user: UserAuth): Promise<ResponseAuth> {
        const response = await fetch(serverURL + Endpoints.signIn, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (response.status === StatusCodes.ok) {
            return await response.json();
        } else if (response.status === StatusCodes.incorrectAuthTry) {
            return {
                message: AuthMessages.wrongPass,
                token: undefined,
                refreshToken: undefined,
                userId: undefined,
                name: undefined,
            };
        } else if (response.status === StatusCodes.notFound) {
            return {
                message: AuthMessages.notFound,
                token: undefined,
                refreshToken: undefined,
                userId: undefined,
                name: undefined,
            };
        }
        return {
            message: AuthMessages.timeout,
            token: undefined,
            refreshToken: undefined,
            userId: undefined,
            name: undefined,
        };
    }
}
