<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
	export let id: number;
</script>

<div
	class="group relative flex w-full max-w-xl flex-col overflow-hidden rounded-lg border bg-card"
	id={id.toString()}
>
	<div class="flex flex-col gap-4 p-4">
		<Skeleton class="h-[30px] w-3/4 rounded-lg" />
		<div class="flex flex-col gap-3">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<Skeleton class="h-[25px] w-[100px] rounded-lg" />
					<Skeleton class="h-[25px] w-[100px] rounded-lg" />
				</div>
				<Skeleton class="h-[25px] w-[25px] rounded-lg" />
			</div>
			<div class="flex items-center gap-2">
				<Skeleton class="h-[25px] w-[80px] rounded-lg" />
				<Skeleton class="h-[25px] w-[200px] rounded-lg" />
			</div>
		</div>
	</div>
</div>
