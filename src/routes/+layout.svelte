<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { page } from '$app/stores';
	import Errors from '$lib/components/widgets/errors.svelte';
	import { siteConfig } from '$lib/metadata';

	let { children } = $props();
</script>

<svelte:head>
	<title>{siteConfig.name}</title>
	<meta name="description" content={siteConfig.description} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta charset="utf-8" />

	<meta name="keywords" content={siteConfig.keywords} />
	<meta name="author" content={siteConfig.name} />

	<meta property="og:title" content={siteConfig.name} />
	<meta property="og:description" content={siteConfig.description} />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:url" content={siteConfig.url.toString()} />
	{#if siteConfig.ogImage}
		<meta property="og:image" content={siteConfig.ogImage.toString()} />
	{/if}
	<meta name="robots" content="index, follow" />
	<meta
		name="googlebot"
		content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1"
	/>

	<link rel="canonical" href={siteConfig.url.toString()} />
	<meta name="google-site-verification" content={siteConfig.googleVerification} />
	<meta name="yandex-verification" content={siteConfig.yandexVerification} />
</svelte:head>

<ModeWatcher />

{#if $page.error?.message}
	<Errors status={$page.status} message={$page.error.message} />
{:else}
	{@render children()}
{/if}
