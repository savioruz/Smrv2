import type { PageServerLoad, Actions } from '../../$types';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { forgotPasswordSchema } from '$lib/schemas/auth';
import { zod } from 'sveltekit-superforms/adapters';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const ERROR_MESSAGES: Record<string, string> = {
	INVALID_EMAIL: 'Format email tidak valid',
	NOT_FOUND: 'Pengguna tidak ditemukan'
};

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(forgotPasswordSchema));

	return {
		form
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(forgotPasswordSchema));
		if (!form.valid) {
			return fail(400, {
				form,
				error: 'Mohon periksa kembali input Anda'
			});
		}

		try {
			const response = await fetch(`${API_URL}/auth/reset/request`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: form.data.email
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
						error: errorMessage || 'Gagal mengirim email, silakan coba lagi'
					});
				}

				return fail(response.status, {
					form,
					error: data.message || 'Gagal mengirim email, silakan coba lagi'
				});
			}

			if (data.data) {
				await delay(500);
				return {
					form,
					message: 'Email dikirim, cek inbox atau spam folder Anda.'
				};
			}

			return fail(500, {
				form,
				error: 'Format response tidak sesuai'
			});
		} catch (error) {
			console.error('Forgot password error:', error);
			return fail(500, {
				form,
				error: 'Terjadi kesalahan, silakan coba lagi nanti'
			});
		}
	}
};
