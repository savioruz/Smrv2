<script lang="ts">
	import type { PageData } from "./$types.js";
	import Navbar from '$lib/components/ui/navbar/navbar.svelte';
	import Dashboard from '$lib/components/widgets/dashboard.svelte';
	let { data }: { data: PageData } = $props();
</script>

<Navbar />
<Dashboard schedules={data.schedules} />
