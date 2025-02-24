import type { Response } from './api';

export type LoginResponse = Response<{
	access_token: string;
	refresh_token: string;
}>;

export type RegisterResponse = Response<{
	email: string;
}>;
