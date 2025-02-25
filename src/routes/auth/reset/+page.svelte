<script lang="ts">
	import type { PageData } from './$types.js';
	import Reset from '$lib/components/widgets/reset.svelte';
	import Navbar from '$lib/components/ui/navbar/navbar.svelte';
	let { data }: { data: PageData } = $props();
</script>

<Navbar />
<Reset {data} />
