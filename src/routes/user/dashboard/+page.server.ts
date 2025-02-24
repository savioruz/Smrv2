import { isTokenExpired } from "$lib/utils";
import type { PageServerLoad, Actions } from "./$types";
import { redirect } from "@sveltejs/kit";
import type { SchedulesResponse } from "$lib/types/schedules";
import { message } from "sveltekit-superforms";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ERROR_MESSAGES: Record<string, string> = {
    "NOT_FOUND": "user tidak ditemukan",
    "NOT_VERIFIED": "mohon reset password sesuai akun portal"
}

export const load: PageServerLoad = async ({ cookies }) => {
    const accessToken = cookies.get('access_token');
    const refreshToken = cookies.get('refresh_token');
    
    if (!accessToken || !refreshToken) {
        throw redirect(303, '/auth/login');
    }

    const isExpired = isTokenExpired(accessToken);
    if (isExpired) {
        cookies.delete('access_token', { path: '/' });
        cookies.delete('refresh_token', { path: '/' });
        throw redirect(303, '/auth/login');
    }

    try {
        const response = await fetch(`${API_URL}/user/schedules`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch schedules');
        }

        const data: SchedulesResponse = await response.json();

        return {
            accessToken,
            schedules: data.data || []
        };
    } catch (error) {
        console.error('Error fetching schedules:', error);
        return {
            accessToken,
            schedules: []
        };
    }
};

export const actions: Actions = {
    refresh: async ({ cookies }) => {
        const accessToken = cookies.get('access_token');
        const refreshToken = cookies.get('refresh_token');
        
        if (!accessToken || !refreshToken) {
            throw redirect(303, '/auth/login');
        }

        const isExpired = isTokenExpired(accessToken);
        if (isExpired) {
            cookies.delete('access_token', { path: '/' });
            cookies.delete('refresh_token', { path: '/' });
            throw redirect(303, '/auth/login');
        }

        try {
            const response = await fetch(`${API_URL}/user/schedules`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch schedules');
            }

            const data: SchedulesResponse = await response.json();

            return {
                success: true,
                schedules: data.data || []
            };
        } catch (error) {
            console.error('Error fetching schedules:', error);
            return {
                success: false,
                schedules: []
            };
        }
    },
    sync: async ({ cookies }) => {
        const accessToken = cookies.get('access_token');
        const refreshToken = cookies.get('refresh_token');
        
        if (!accessToken || !refreshToken) {
            throw redirect(303, '/auth/login');
        }

        const isExpired = isTokenExpired(accessToken);
        if (isExpired) {
            cookies.delete('access_token', { path: '/' });
            cookies.delete('refresh_token', { path: '/' });
            throw redirect(303, '/auth/login');
        }

        try {
            const response = await fetch(`${API_URL}/user/schedules/sync`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: true })
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    const errorMessage = Object.entries(data.errors)
                        .map(([field, errors]) => {
                            if (Array.isArray(errors)) {
                                return errors.map(error => ERROR_MESSAGES[error] || error).join(', ');
                            }
                            if (typeof errors === 'string') {
                                return ERROR_MESSAGES[errors] || errors;
                            }
                            return ERROR_MESSAGES[field] || 'Error tidak diketahui';
                        })
                        .join(', ');

                    return {
                        success: false,
                        message: errorMessage
                    }
                }
            }

            return {
                success: true,
                message: data.data || 'Sinkronisasi jadwal dimulai'
            };
        } catch (error) {
            console.error('Error triggering schedule sync:', error);
            return {
                success: false,
                message: 'Terjadi kesalahan saat memulai sinkronisasi'
            };
        }
    }
};
