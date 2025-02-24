<script lang="ts">
	import { page } from '$app/stores';
	import ThemeToggle from '$lib/components/ui/navbar/theme-toggle.svelte';
	import User from 'lucide-svelte/icons/user';
	import { Button } from '$lib/components/ui/button/index.js';
	import LogOut from 'lucide-svelte/icons/log-out';
	import { goto } from '$app/navigation';
	import { invalidateAll } from '$app/navigation';

	async function handleLogout() {
		const response = await fetch('/auth/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			await invalidateAll();
			await goto('/auth/login');
		}
	}
</script>

<header
	class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<nav class="container flex h-14 items-center justify-between">
		<div class="flex items-center md:gap-6">
			<a href="/" class="text-md font-bold md:text-lg" data-sveltekit-preload-data>smrv2</a>
		</div>
		<div class="flex items-center gap-1 md:gap-4">
			{#if $page.data.isAuthenticated}
				<Button
					href="/user/dashboard"
					size="icon"
					variant={$page.url.pathname === '/user/dashboard' ? 'outline' : 'ghost'}
					data-sveltekit-preload-data="hover"
				>
					<User />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					data-sveltekit-preload-data="hover"
					onclick={handleLogout}
				>
					<LogOut />
				</Button>
			{:else}
				<Button
					href="/auth/login"
					variant={$page.url.pathname === '/auth/login' ? 'outline' : 'ghost'}
					data-sveltekit-preload-data="hover"
				>
					<User />
				</Button>
			{/if}
			<ThemeToggle />
		</div>
	</nav>
</header>
