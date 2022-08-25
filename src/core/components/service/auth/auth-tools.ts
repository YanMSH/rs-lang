import { AuthMessages, Endpoints, StatusCodes } from '../../../constants/loader-const';
import { ResponseAuth, UserAuth, UserReg } from '../../../types/loader-types';
import Loader from '../../loader/loader';

export default class AuthTools {
    load: Loader;
    constructor() {
        this.load = new Loader();
    }
    async createUser(user: UserReg) {
        const response = await this.load.post(Endpoints.users, user);
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
        const response = await this.load.post(Endpoints.signIn, user);
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
