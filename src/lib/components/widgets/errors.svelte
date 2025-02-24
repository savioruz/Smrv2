<script lang="ts">
	const { status, message } = $props();
</script>

<div class="container flex min-h-[calc(100vh-4rem)] items-center justify-center">
	<div class="space-y-8 text-center">
		<div class="flex flex-col items-center justify-center gap-2">
			<h1
				class="bg-gradient-to-l from-white to-purple-500 bg-clip-text text-8xl font-bold text-transparent"
			>
				{status}
			</h1>
			<p class="text-md font-medium">
				{message === 'Not Found'
					? "I'm sorry, but the page you're looking for doesn't exist."
					: "I'm sorry, but something went wrong."}
			</p>
		</div>
		<a
			href="/"
			data-sveltekit-preload-data
			class="relative inline-block text-lg after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 after:bg-gradient-to-r after:from-purple-500 after:to-white after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100"
			>&larr; Go back home</a
		>
	</div>
</div>
