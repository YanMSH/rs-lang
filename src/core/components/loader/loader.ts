
import { AuthMessages, serverURL, StatusCodes } from '../../constants/loader-const';
import { ResponseAuth, UserAuth, UserReg } from '../../types/loader-types';

export default class Loader {
    serverURL: string;
    usersEP: string;
    wordsEP: string;
    signInEP: string;
    constructor() {
        this.serverURL = serverURL;
        this.usersEP = this.serverURL + 'users';
        this.wordsEP = this.serverURL + 'words';
        this.signInEP = this.serverURL + 'signin';
    }
    async get(endpoint: string) {
        const response = await fetch(this.serverURL + endpoint);
        if (response.ok) { return await response.json() }
        throw response.json();
    }
    // TODO: Error handling
    async createUser(user: UserReg) {
        const response = await fetch(this.usersEP, {
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

    async authUser(user: UserAuth): Promise<ResponseAuth> {
        // let response;
        // try {
        // response = await fetch(this.signInEP, {
        //     method: 'POST',
        //     headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(user),
        // });
        //     if (!response.ok) {
        //         throw await response.json();
        //     }
        //     return response.json();
        // } catch (err) {
        //     console.log('Error here', err);
        //     return { message: 'error happened' };
        // }
        const response = await fetch(this.signInEP, {
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
