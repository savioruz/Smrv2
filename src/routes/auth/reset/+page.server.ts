import type { PageServerLoad, Actions } from '../../$types';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { resetPasswordSchema } from '$lib/schemas/auth';
import { zod } from 'sveltekit-superforms/adapters';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const ERROR_MESSAGES: Record<string, string> = {
	PASSWORD_MISMATCH: 'Password tidak sama',
	INVALID: 'Token tidak valid',
    NOT_FOUND: 'User tidak ditemukan',
    REQUIRED: 'Token tidak boleh kosong'
};

export const load: PageServerLoad = async ({ url }) => {
	const form = await superValidate(zod(resetPasswordSchema));
    const token = url.searchParams.get('id');

    if (!token) {
        throw fail(400, {
            form,
            error: 'Token tidak valid'
        });
    }

	return {
        form: {
            ...form,
            data: {
                ...form.data,
                token: token
            }
        }
    };
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(resetPasswordSchema));

		if (!form.valid) {
			return fail(400, {
				form,
				error: 'Mohon periksa kembali input Anda'
			});
		}

		try {
			const response = await fetch(`${API_URL}/auth/reset`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					token: form.data.token,
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
								return errors.map((error) => ERROR_MESSAGES[error] || error).join(', ');
							}
							if (typeof errors === 'string') {
								return ERROR_MESSAGES[errors] || errors;
							}
							return ERROR_MESSAGES[field] || 'Error tidak diketahui';
						})
						.join(', ');

					return fail(response.status, {
						form,
						error: errorMessage || 'Gagal mereset password, silakan coba lagi'
					});
				}

				return fail(response.status, {
					form,
					error: data.message || 'Gagal mereset password, silakan coba lagi'
				});
			}

			if (data.data) {
				await delay(500);

				return {
					form,
					message: 'Berhasil mereset password, silakan login'
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
	}
};
