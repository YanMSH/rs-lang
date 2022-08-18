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
    token: string;
    refreshToken: string;
    userId: string;
    name: string;
};
