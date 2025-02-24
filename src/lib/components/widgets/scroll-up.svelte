<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { ChevronUp } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { cn } from '$lib/utils';

	let visible = false;

	onMount(() => {
		const handleScroll = () => {
			visible = window.scrollY > 200;
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};
</script>

<Button
	class={cn(
		'fixed bottom-4 right-4 z-50 p-2 shadow-md transition-all duration-300',
		!visible && 'pointer-events-none translate-y-16 opacity-0'
	)}
	variant="secondary"
	size="icon"
	onclick={scrollToTop}
	aria-label="Scroll to top"
>
	<ChevronUp class="h-6 w-6" />
</Button>
