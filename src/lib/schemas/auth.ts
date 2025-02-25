import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email('Email tidak valid'),
	password: z.string().min(6, 'Password minimal 6 karakter')
});

export type LoginSchema = typeof loginSchema;

export const registerSchema = z
	.object({
		email: z.string().email('Email tidak valid'),
		password: z.string().min(6, 'Password minimal 6 karakter'),
		confirmPassword: z.string().min(1, 'Konfirmasi password harus diisi')
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Password tidak sama',
		path: ['confirmPassword']
	});

export type RegisterSchema = typeof registerSchema;

export const resetPasswordSchema = z
	.object({
		token: z.string().uuid('Token tidak valid'),
		password: z.string().min(6, 'Password minimal 6 karakter'),
		confirmPassword: z.string().min(1, 'Konfirmasi password harus diisi')
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Password tidak sama',
		path: ['confirmPassword']
	});

export type ResetPasswordSchema = typeof resetPasswordSchema;

export const forgotPasswordSchema = z.object({
	email: z.string().email('Email tidak valid')
});

export type ForgotPasswordSchema = typeof forgotPasswordSchema;

