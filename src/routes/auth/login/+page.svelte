<script lang="ts">
	import type { PageData } from './$types.js';
	import Login from '$lib/components/widgets/login.svelte';
	import Navbar from '$lib/components/ui/navbar/navbar.svelte';
	let { data }: { data: PageData } = $props();
</script>

<Navbar />
<Login {data} />
