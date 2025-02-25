<script lang="ts">
	import Root from './root.svelte';
	import BorderBeam from '$lib/components/ui/border-beam/border-beam.svelte';
	import { loginSchema, type LoginSchema } from '$lib/schemas/auth';
	import * as Form from '$lib/components/ui/form';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Loader2, Eye, EyeOff, CircleAlert } from 'lucide-svelte';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { goto } from '$app/navigation';

	let isShowPassword = false;

	interface Props {
		data: {
			form: SuperValidated<Infer<LoginSchema>>;
			error?: string;
		};
	}

	export let data: Props['data'];

	const form = superForm(data.form, {
		validators: zodClient(loginSchema),
		onResult: ({ result }) => {
			if (result.type === 'success' && result.data?.location) {
				goto(result.data.location);
			} else if (result.type === 'failure') {
				error = result.data?.error || 'An error occurred';
			}
		},
		onError: ({ result }) => {
			error = result.error?.message || 'An error occurred';
		},
		onSubmit: () => {
			error = undefined;
		},
		resetForm: false,
		taintedMessage: null
	});

	const { form: formData, enhance, submitting } = form;
	let error = data.error;

	$: if (data.error) {
		error = data.error;
	}
</script>

<Root>
	<div
		class="relative flex max-w-lg flex-col items-start justify-between gap-4 rounded-3xl border border-gray-700/70 bg-background p-7"
	>
		<BorderBeam size={150} duration={12} colorFrom="#9c40ff" colorTo="#f8fafc" />
		<div class="my-4 flex gap-2">
			<div class="flex flex-col items-center justify-center gap-2">
				<h1 class="text-4xl font-bold">Login</h1>
				<p class="text-md text-muted-foreground">
					Login untuk mengakses fitur-fitur yang ada di smrv2
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
			{/if}

			<form method="POST" use:enhance class="flex flex-col gap-4">
				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Email</Form.Label>
							<Input type="email" {...props} bind:value={$formData.email} />
						{/snippet}
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="password">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="flex items-center justify-between">
								Password
								<Button
									variant="ghost"
									size="icon"
									onclick={() => {
										isShowPassword = !isShowPassword;
										setTimeout(() => {
											isShowPassword = false;
										}, 1500);
									}}
								>
									{#if isShowPassword}
										<EyeOff class="size-4" />
									{:else}
										<Eye class="size-4" />
									{/if}
								</Button>
							</Form.Label>
							<Input
								type={isShowPassword ? 'text' : 'password'}
								{...props}
								bind:value={$formData.password}
							/>
						{/snippet}
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>
				<Button type="submit" disabled={$submitting} class="w-full">
					{#if $submitting}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						<span>Loading...</span>
					{:else}
						Login
					{/if}
				</Button>
			</form>
		</div>

		<div class="flex flex-col gap-2">
			<p class="text-md text-muted-foreground">
				Belum punya akun? <a
					href="/auth/register"
					data-sveltekit-preload-data
					class="relative inline-block text-lg text-slate-900 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 after:bg-gradient-to-r after:from-purple-500 after:to-white after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100 dark:text-slate-100"
					>Daftar</a
				>
			</p>
		</div>
	</div>
</Root>
