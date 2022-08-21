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
    name: string;
    email: string;
};

export type ResponseAuth = {
    message: string;
    token: string | undefined;
    refreshToken: string | undefined;
    userId: string | undefined;
    name: string | undefined;
};
