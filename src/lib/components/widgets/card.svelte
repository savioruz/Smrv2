<script lang="ts">
	import { cn } from '$lib/utils';
	import { Motion, useMotionValue, useMotionTemplate } from 'svelte-motion';
	import type { Schedule } from '$lib/types/schedules';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { ChevronDown } from 'lucide-svelte';

	let className = '';
	export { className as class };

	export let schedule: Schedule;
	let isOpen = false;

	// Spotlight effect
	let mouseX = useMotionValue(0);
	let mouseY = useMotionValue(0);

	function handleMouseMove(e: MouseEvent) {
		const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
		mouseX.set(e.clientX - rect.left);
		mouseY.set(e.clientY - rect.top);
	}

	function handleMouseLeave() {
		mouseX.set(0);
		mouseY.set(0);
	}

	const bg = useMotionTemplate`radial-gradient(
		400px circle at ${mouseX}px ${mouseY}px,
		hsl(270 94% 65% / 0.15),
		transparent 40%
	)`;
</script>

<div
	role="article"
	aria-label={schedule.course_name}
	on:mousemove={handleMouseMove}
	on:mouseleave={handleMouseLeave}
	class={cn(
		'hover:border-purple/50 group relative flex w-full flex-col overflow-hidden rounded-lg border bg-card text-card-foreground transition-all duration-300 ease-out',
		className
	)}
>
	<Collapsible.Root bind:open={isOpen}>
		<Collapsible.Trigger class="w-full">
			<!-- Card Header -->
			<div class="flex flex-col p-4">
				<div class="flex w-full items-center justify-between">
					<div class="flex flex-col items-start justify-center gap-1">
						<h3 class="text-md my-1 line-clamp-1 font-semibold">{schedule.course_name}</h3>
						<div class="flex items-center gap-2">
							<p class="text-sm text-foreground">
								Kelas {schedule.class_code}
							</p>
							<span class="text-muted-foreground">•</span>
							<p class="text-sm text-foreground">
								{schedule.room_number}
							</p>
						</div>
						<div class="flex items-center gap-2">
							<p class="text-sm text-foreground">
								{schedule.day}
							</p>
							<span class="text-muted-foreground">•</span>
							<p class="text-sm text-foreground">
								{schedule.start_time} - {schedule.end_time}
							</p>
						</div>
					</div>
					<ChevronDown
						class={cn(
							'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
							isOpen && 'rotate-180'
						)}
					/>
				</div>
			</div>
		</Collapsible.Trigger>

		<Collapsible.Content>
			<!-- Card Content -->
			<div class="space-y-2 px-4 pb-4">
				<div class="flex flex-col gap-2 text-sm">
					<div class="flex items-start justify-between gap-2">
						<p class="text-muted-foreground">{schedule.course_code}</p>
						<p class="text-muted-foreground">{schedule.study_program}</p>
					</div>
					<div class="flex items-center justify-between gap-2">
						<p class="text-muted-foreground">Semester {schedule.semester}</p>
						<p class="text-muted-foreground">
							{schedule.credits} SKS
						</p>
					</div>
					{#if schedule.lecturer}
						<p class="text-muted-foreground">{schedule.lecturer}</p>
					{/if}
				</div>
			</div>
		</Collapsible.Content>
	</Collapsible.Root>

	<Motion
		style={{
			background: bg,
			opacity: 1
		}}
		let:motion
	>
		<div
			use:motion
			class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
		></div>
	</Motion>
</div>
