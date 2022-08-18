import { serverURL } from '../../constants/loader-const';
import { UserAuth, UserReg } from '../../types/loader-types';

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

    async authUser(user: UserAuth) {
        const response = await fetch(this.signInEP, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        return await response.json();
    }
}
