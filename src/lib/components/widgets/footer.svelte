<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Coffee } from 'lucide-svelte';
	const year = new Date().getFullYear();
</script>

<footer
	class="border-t border-border/40 bg-background/95 py-8 text-center backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<p class="text-sm text-gray-500">
		{year} © Made with ❤️ by
		<a
			href="https://github.com/savioruz/"
			target="_blank"
			rel="noopener noreferrer"
			class="text-black dark:text-gray-100"
		>
			savioruz
		</a>
	</p>
	<div class="align-center mt-5 flex justify-center gap-5">
		<Button
			variant="destructive"
			href="https://trakteer.id/savioruz"
			target="_blank"
			class="rounded-full"
		>
			<Coffee />
			Buy me a coffee
		</Button>
	</div>
</footer>
