import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

interface JWTPayload {
    exp: number;
    iat: number;
    sub: string;
}

export function isTokenExpired(token: string): boolean {
    try {
        const payload = token.split('.')[1];
        if (!payload) return true;

        const decodedPayload = JSON.parse(atob(payload)) as JWTPayload;
        
        const currentTime = Math.floor(Date.now() / 1000);
        return decodedPayload.exp < currentTime;
    } catch (error) {
        return true;
    }
}
