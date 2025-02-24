<script lang="ts">
	import type { PageData } from './$types.js';
	import Navbar from '$lib/components/ui/navbar/navbar.svelte';
	import Register from '$lib/components/widgets/register.svelte';
	let { data }: { data: PageData } = $props();
</script>

<Navbar />
<Register {data} />
