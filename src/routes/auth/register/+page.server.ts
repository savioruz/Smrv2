import type { PageServerLoad, Actions } from '../../$types';
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from 'sveltekit-superforms';
import { registerSchema } from '$lib/schemas/auth';
import { zod } from 'sveltekit-superforms/adapters';
import { isTokenExpired } from '$lib/utils';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const ERROR_MESSAGES: Record<string, string> = {
    'INVALID_EMAIL': 'Format email tidak valid',
    'EMAIL_EXISTS': 'Email sudah terdaftar',
    'INVALID_DOMAIN': 'Domain email harus uad.ac.id',
    'PASSWORD_MISMATCH': 'Password tidak sama',
    'ALREADY_EXISTS': 'Email sudah terdaftar'
};

export const load: PageServerLoad = async ({ cookies }) => {
    const accessToken = cookies.get('access_token');
    const refreshToken = cookies.get('refresh_token');
    
    if (accessToken && refreshToken) {
        const isExpired = isTokenExpired(accessToken);
        
        if (!isExpired) {
            throw redirect(303, '/user/dashboard');
        } else {
            cookies.delete('access_token', { path: '/' });
            cookies.delete('refresh_token', { path: '/' });
        }
    } else if (accessToken || refreshToken) {
        cookies.delete('access_token', { path: '/' });
        cookies.delete('refresh_token', { path: '/' });
    }

    return {
        form: await superValidate(zod(registerSchema))
    };
};

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(registerSchema));
        if (!form.valid) {
            return fail(400, {
                form,
                error: 'Mohon periksa kembali input Anda'
            });
        }

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: form.data.email,
                    password: form.data.password,
                    confirmPassword: form.data.confirmPassword
                }),
                mode: 'cors'
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

                    return fail(response.status, { 
                        form, 
                        error: errorMessage || 'Gagal mendaftar, silakan coba lagi' 
                    });
                }

                return fail(response.status, {
                    form,
                    error: data.message || 'Gagal mendaftar, silakan coba lagi'
                });
            }

            if (data.data?.email) {
                await delay(500);
                
                return {
                    form,
                    message: 'Berhasil mendaftar, silakan verifikasi email'
                };
            }

            return fail(500, {
                form,
                error: 'Format response tidak sesuai'
            });

        } catch (error) {
            console.error('Register error:', error);
            return fail(500, {
                form,
                error: 'Terjadi kesalahan, silakan coba lagi nanti'
            });
        }
    },
};
