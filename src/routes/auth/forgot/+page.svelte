<script lang="ts">
	import type { PageData } from './$types.js';
	import Forgot from '$lib/components/widgets/forgot.svelte';
	import Navbar from '$lib/components/ui/navbar/navbar.svelte';
	let { data }: { data: PageData } = $props();
</script>

<Navbar />
<Forgot {data} />
