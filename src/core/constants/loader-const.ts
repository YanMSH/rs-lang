export enum StatusCodes {
    ok = 200,
    created = 201,
    notModified = 304,
    unauthorized = 401,
    badToken = 402,
    incorrectAuthTry = 403,
    notFound = 404,
    expectationFailed = 417,
    incorrectAuthInput = 422,
    tooManyRequests = 429,
    internalError = 500,
}

export enum Requests {
    post = 'POST',
    get = 'GET',
    put = 'PUT',
    delete = 'DELETE',
    patch = 'PATCH',
}

export enum AuthMessages {
    success = 'Authenticated',
    wrongPass = 'Incorrect password',
    notFound = 'User not found',
    timeout = 'Connection timeout',
}

export enum Endpoints {
    users = 'users',
    words = 'words',
    signIn = 'signin',
    aggregatedWords = 'aggregatedwords',
    settings = 'settings',
}

export const serverURL = 'https://rs-back.herokuapp.com/';
