<script lang="ts">
	import { cn } from '$lib/utils';

	let className: string = '';
	export { className as class };
</script>

<main class="container">
	<div class={cn('flex w-full flex-col items-center justify-center py-8', className)}>
		<slot />
	</div>
</main>
