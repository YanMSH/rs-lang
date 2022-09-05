import { ALL_WORDS_PER_GROUP, Requests, serverURL, StatusCodes } from '../../constants/loader-const';
import { UserWord, GlobalStat } from '../../types/controller-types';
import { AWPaginatedResults, ResponseAggregatedWords, ResponseAuth } from '../../types/loader-types';
import Storage from '../service/storage/storage';
import { buildAuthorizedEndpoint } from '../service/utils/utils';

export default class Loader {
    store: Storage;
    constructor() {
        this.store = new Storage();
    }
    public async get(endpoint: string) {
        const response = await fetch(serverURL + endpoint);
        if (response.ok) {
            return await response.json();
        }
        throw response.json();
    }
    public async post(endpoint: string, body: object): Promise<Response> {
        return await fetch(serverURL + endpoint, {
            method: Requests.post,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
    }
    private async requestAuth(path: string, method: Requests, bodyObj?: object) {
        const token = (this.store.get('user') as ResponseAuth).token;
        return await fetch(path, {
            method: method,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: bodyObj ? JSON.stringify(bodyObj) : undefined,
        });
    }

    public async getAuthorizedData(endpoint: string, wordId: string) {
        // TODO Handle case when token is outdated!
        const path = serverURL + buildAuthorizedEndpoint(endpoint) + wordId;
        const response = await this.requestAuth(path, Requests.get);
        if (response.ok) {
            return await response.json();
        } else {
            console.log('resp status', response.status);
            throw await response.text();
        }
    }
    public async getStatistic(endpoint: string) {
        const path = serverURL + buildAuthorizedEndpoint(endpoint);
        const response = await this.requestAuth(path, Requests.get);
        if (response.ok) {
            return await response.json();
        } else {
            console.log('resp status', response.status);
            throw await response.text();
        }
        // const token = (this.store.get('user') as ResponseAuth).token;
        // const path = serverURL + buildAuthorizedEndpoint(endpoint);
        // return await fetch(path, {
        //     method: "GET",
        //     headers: {
        //         'Authorization': `Bearer ${token}`,
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json'
        //     },
        // }).then(resp => resp.json()).then(data => console.log(data));
    }
    public putStatistic(endpoint: string, data: GlobalStat, number: number) {
        const token = (this.store.get('user') as ResponseAuth).token;
        const path = serverURL + buildAuthorizedEndpoint(endpoint);
        fetch(path, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                learnedWords: number,
                optional: data,
            }),
        })
            .then((resp) => resp.json())
            .then((data) => console.log(data));
    }
    public async postAuthorisedData(endpoint: string, wordId: string, body: UserWord) {
        const path = serverURL + buildAuthorizedEndpoint(endpoint) + wordId;
        const response = await this.requestAuth(path, Requests.post, body);
        if (response.ok) {
            return await response.json();
        } else {
            if (response.status === StatusCodes.expectationFailed) {
                this.putAuthorisedData(endpoint, wordId, body);
            }
            throw await response.text();
        }
    }

    private async putAuthorisedData(endpoint: string, wordId: string, body: UserWord) {
        const path = serverURL + buildAuthorizedEndpoint(endpoint) + wordId;
        const response = await this.requestAuth(path, Requests.put, body);
        if (response.ok) {
            return await response.json();
        } else {
            throw await response.text();
        }
    }

    public async getAllFilteredWords(filterQuery: string) {
        const path =
            serverURL + buildAuthorizedEndpoint('aggregatedwords') + `?wordsPerPage=600&filter={${filterQuery}}`;
        const response = await this.requestAuth(path, Requests.get);
        return await this.pullAggregatedResult(response);
    }

    public async getFilteredWords(queryString: string) {
        const token = (this.store.get('user') as ResponseAuth).token;
        const group = this.store.get('group') as number;
        const page = this.store.get('page') as number;
        const response = await fetch(
            serverURL +
                buildAuthorizedEndpoint('aggregatedwords') +
                `?&group=${group}&wordsPerPage=${ALL_WORDS_PER_GROUP}&filter={"$and":[{${queryString},"page":${page}}]}`,
            {
                method: Requests.get,
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        );
        return await this.pullAggregatedResult(response);
    }

    private async pullAggregatedResult(response: Response): Promise<AWPaginatedResults> {
        if (response.ok) {
            const responseArray = (await response.json()) as ResponseAggregatedWords;
            const result = responseArray[0];
            const aggregatedWords = result.paginatedResults;
            return aggregatedWords;
        } else {
            console.log('resp status', response.status);
            if (response.status === StatusCodes.unauthorized) {
                this.store.remove('auth');
            }
            throw await response.text();
        }
    }

    public async getAmountOfFilteredWords(filterQuery: string) {
        const path =
            serverURL + buildAuthorizedEndpoint('aggregatedwords') + `?wordsPerPage=600&filter={${filterQuery}}`;
        const response = await this.requestAuth(path, Requests.get);
        return await this.pullAmountOfFilteredWords(response);
    }

    private async pullAmountOfFilteredWords(response: Response): Promise<number> {
        if (response.ok) {
            const responseArray = (await response.json()) as ResponseAggregatedWords;
            const result = responseArray[0];
            const countArray = result.totalCount;
            return countArray[0].count;
        } else {
            console.log('resp status', response.status);
            if (response.status === StatusCodes.unauthorized) {
                this.store.remove('auth');
            }
            throw await response.text();
        }
    }
}
