<script lang="ts">
	import Root from './root.svelte';
	import BorderBeam from '$lib/components/ui/border-beam/border-beam.svelte';
	import { registerSchema, type RegisterSchema } from '$lib/schemas/auth';
	import * as Form from '$lib/components/ui/form';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Loader2 } from 'lucide-svelte';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { goto } from '$app/navigation';

	let isOpen = false;

	interface Props {
		data: {
			form: SuperValidated<Infer<RegisterSchema>>;
			error?: string;
			message?: string;
		};
	}

	export let data: Props['data'];

	const form = superForm(data.form, {
		validators: zodClient(registerSchema),
		onResult: ({ result }) => {
			if (result.type === 'success') {
				if (result.data?.location) {
					goto(result.data.location);
				} else if (result.data?.message) {
					message = result.data.message;
					error = undefined;
					$formData.email = '';
					$formData.password = '';
					$formData.confirmPassword = '';
				}
			} else if (result.type === 'failure') {
				error = result.data?.error || 'An error occurred';
				message = undefined;
			}
		},
		onError: ({ result }) => {
			error = result.error?.message || 'An error occurred';
			message = undefined;
		},
		onSubmit: () => {
			error = undefined;
			message = undefined;
		},
		resetForm: false,
		taintedMessage: null
	});

	const { form: formData, enhance, submitting } = form;
	let error = data.error;
	let message = data.message;

	$: if (data.error) {
		error = data.error;
		message = undefined;
	}
	$: if (data.message) {
		message = data.message;
		error = undefined;
	}
</script>

<Root>
	<div
		class="relative flex max-w-lg flex-col items-start justify-between gap-4 rounded-3xl border border-gray-700/70 bg-background p-7"
	>
		<BorderBeam size={150} duration={12} colorFrom="#9c40ff" colorTo="#f8fafc" />
		<div class="my-4 flex gap-2">
			<div class="flex flex-col items-center justify-center gap-2">
				<h1 class="text-4xl font-bold">Daftar</h1>
				<p class="text-md text-muted-foreground">
					Daftar untuk mengakses fitur-fitur yang ada di smrv2
				</p>
			</div>
		</div>

		<div class="my-4 flex w-full flex-col gap-4">
			{#if error}
				<Alert.Root variant="destructive">
					<CircleAlert class="size-4" />
					<Alert.Title>Error</Alert.Title>
					<Alert.Description>{error}</Alert.Description>
				</Alert.Root>
			{:else if message}
				<Alert.Root variant="default">
					<CircleAlert class="size-4" />
					<Alert.Title>Berhasil</Alert.Title>
					<Alert.Description>{message}</Alert.Description>
				</Alert.Root>
			{/if}

			<form method="POST" use:enhance class="flex flex-col gap-4" on:submit|preventDefault>
				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Email</Form.Label>
							<Input type="email" {...props} bind:value={$formData.email} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="password">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Password</Form.Label>
							<Input type="password" {...props} bind:value={$formData.password} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="confirmPassword">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Konfirmasi Password</Form.Label>
							<Input type="password" {...props} bind:value={$formData.confirmPassword} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<AlertDialog.Root bind:open={isOpen}>
					<AlertDialog.Trigger>
						<Button disabled={$submitting} class="w-full">
							{#if $submitting}
								<Loader2 class="mr-2 h-4 w-4 animate-spin" />
								<span>Loading...</span>
							{:else}
								Daftar
							{/if}
						</Button>
					</AlertDialog.Trigger>
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title>Apakah Anda yakin?</AlertDialog.Title>
							<AlertDialog.Description>
								Pastikan data yang Anda masukkan sudah sesuai dengan data yang ada di portal. Karena
								sistem smrv2 dibangun berdasarkan data dari portal,<strong>
									maka data yang Anda masukkan harus sesuai dengan data yang ada di portal</strong
								>.
							</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel>Batal</AlertDialog.Cancel>
							<AlertDialog.Action
								onclick={() => {
									isOpen = false;
									form.submit();
								}}
							>
								Daftar
							</AlertDialog.Action>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>
			</form>
		</div>

		<div class="flex flex-col gap-2">
			<p class="text-md text-muted-foreground">
				Sudah punya akun? <a
					href="/auth/login"
					data-sveltekit-preload-data
					class="relative inline-block text-lg text-slate-900 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 after:bg-gradient-to-r after:from-purple-500 after:to-white after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100 dark:text-slate-100"
					>Login</a
				>
			</p>
		</div>
	</div>
</Root>
