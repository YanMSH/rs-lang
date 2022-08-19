import { AuthMessages, serverURL } from '../../constants/loader-const';
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
        return await response.json();
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
        if (response.status === 200) {
            return await response.json();
        } else if (response.status === 403) {
            return {
                message: AuthMessages.wrongPass,
                token: undefined,
                refreshToken: undefined,
                userId: undefined,
                name: undefined,
            };
        } else if (response.status === 404) {
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
