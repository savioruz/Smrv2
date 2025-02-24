<script lang="ts">
	import Root from './root.svelte';
	import type { Schedule } from '$lib/types/schedules';
	import Card from './card.svelte';
	import SkeletonCard from './skeleton-card.svelte';
	import { enhance } from '$app/forms';
	import * as Alert from '$lib/components/ui/alert';
	import { Info } from 'lucide-svelte';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { ChevronDown, RefreshCw } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	export let schedules: Schedule[] = [];

	let isOpen = false;
	let loading = false;
	let syncing = false;
	let syncMessage: { type: 'success' | 'error'; text: string } | null = null;
	let syncMessageTimeout: ReturnType<typeof setTimeout>;

	const resetSyncMessage = () => {
		if (syncMessageTimeout) {
			clearTimeout(syncMessageTimeout);
		}
		syncMessageTimeout = setTimeout(() => {
			syncMessage = null;
		}, 7000);
	};

	const dayMap: Record<string, string> = {
		Sunday: 'Minggu',
		Monday: 'Senin',
		Tuesday: 'Selasa',
		Wednesday: 'Rabu',
		Thursday: 'Kamis',
		Friday: 'Jumat',
		Saturday: 'Sabtu'
	};

	const getCurrentDay = () => {
		const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });
		return dayMap[day];
	};

	const getCurrentTime = () => {
		const now = new Date();
		return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
	};

	$: todaySchedules = schedules
		.filter((schedule) => schedule.day === getCurrentDay())
		.sort((a, b) => a.start_time.localeCompare(b.start_time));

	$: currentAndUpcomingSchedules = todaySchedules.filter((schedule) => {
		const currentTime = getCurrentTime();
		return schedule.end_time >= currentTime;
	});
</script>

<Root>
	<div class="flex w-full max-w-xl flex-col gap-4">
		<div class="flex items-center justify-between">
			<h2 class="text-md font-bold md:text-2xl">Jadwal Kuliah Hari Ini</h2>
			<span class="text-sm text-muted-foreground">
				{getCurrentDay()}, {getCurrentTime()}
			</span>
		</div>
		{#if loading}
			<SkeletonCard id={0} />
		{:else if currentAndUpcomingSchedules.length > 0}
			{#each currentAndUpcomingSchedules as schedule}
				<Card
					{schedule}
					class={schedule.start_time <= getCurrentTime() && schedule.end_time >= getCurrentTime()
						? 'border-primary'
						: ''}
				/>
			{/each}
		{:else}
			<Alert.Root>
				<Info class="size-4" />
				<Alert.Title>Yay !</Alert.Title>
				<Alert.Description class="text-muted-foreground">
					Tidak ada jadwal kuliah untuk hari ini.
				</Alert.Description>
			</Alert.Root>
		{/if}
	</div>
	<div class="mt-8 flex w-full max-w-xl flex-col gap-4">
		<div class="flex items-center justify-between">
			<h2 class="text-md font-bold md:text-2xl">Semua Jadwal Kuliah</h2>
			<form
				method="POST"
				action="?/refresh"
				use:enhance={() => {
					loading = true;
					return async ({ result }) => {
						loading = false;
						if (result.type === 'success') {
							schedules = result.data?.schedules as Schedule[];
						}
					};
				}}
			>
				<button
					type="submit"
					class="relative inline-block text-lg text-sm text-muted-foreground after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 after:bg-gradient-to-r after:from-purple-500 after:to-white after:transition-transform after:duration-300 after:ease-in-out hover:text-primary hover:after:origin-bottom-left hover:after:scale-x-100"
					disabled={loading}
					data-sveltekit-preload-data
				>
					{loading ? 'Loading...' : 'Refresh'}
				</button>
			</form>
		</div>
		{#if loading}
			{#each Array(2) as id}
				<SkeletonCard {id} />
			{/each}
		{:else if schedules.length > 0}
			{#each schedules as schedule}
				<Card {schedule} />
			{/each}
		{:else}
			<p class="text-muted-foreground">Tidak ada jadwal yang ditemukan.</p>
		{/if}
	</div>
	<div class="mt-8 flex w-full max-w-xl flex-col gap-4">
		<Collapsible.Root class="my-2 w-full" bind:open={isOpen}>
			<Collapsible.Trigger class="text-md flex items-center gap-2 text-muted-foreground md:text-lg">
				<ChevronDown
					class={cn(
						'h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200',
						isOpen && 'rotate-180'
					)}
				/>
				Settings
				<span class="sr-only">Toggle</span>
			</Collapsible.Trigger>
			<Collapsible.Content class="mt-4 space-y-4">
				<div class="flex flex-col gap-4">
					<div class="flex flex-col gap-2">
						<h3 class="text-lg font-medium">Sinkronisasi Jadwal</h3>
						<p class="text-sm text-muted-foreground">
							Sinkronkan jadwal kuliah Anda dengan portal jika jadwal tidak sesuai.
						</p>
					</div>
					{#if syncMessage}
						<Alert.Root variant={syncMessage.type === 'success' ? 'default' : 'destructive'}>
							<Info class="size-4" />
							<Alert.Description>
								{syncMessage.text}
							</Alert.Description>
						</Alert.Root>
					{/if}
					<div class="flex flex-wrap gap-4">
						<form
							method="POST"
							action="?/sync"
							use:enhance={() => {
								syncing = true;
								syncMessage = null;
								return async ({ result }) => {
									syncing = false;
									if (result.type === 'success') {
										syncMessage = {
											type: 'success',
											text: result.data?.message as string
										};
									} else {
										syncMessage = {
											type: 'error',
											text: 'Gagal memulai sinkronisasi'
										};
									}
									resetSyncMessage();
								};
							}}
						>
							<AlertDialog.Root>
								<AlertDialog.Trigger>
									<Button variant="outline" size="sm" type="submit" disabled={syncing}>
										<RefreshCw class={cn('mr-2 h-4 w-4', syncing && 'animate-spin')} />
										{syncing ? 'Memulai sinkronisasi...' : 'Sinkronkan Jadwal'}
									</Button>
								</AlertDialog.Trigger>
								<AlertDialog.Content>
									<AlertDialog.Header>
										<AlertDialog.Title>Apakah Anda yakin?</AlertDialog.Title>
										<AlertDialog.Description>
											Sinkronisasi jadwal akan memulai proses sinkronisasi jadwal kuliah Anda. Jika
											terjadi kesalahan, Anda dapat menghubungi admin.
										</AlertDialog.Description>
									</AlertDialog.Header>
									<AlertDialog.Footer>
										<AlertDialog.Cancel>Batal</AlertDialog.Cancel>
										<AlertDialog.Action>Sinkronkan</AlertDialog.Action>
									</AlertDialog.Footer>
								</AlertDialog.Content>
							</AlertDialog.Root>
						</form>
					</div>
				</div>
			</Collapsible.Content>
		</Collapsible.Root>
	</div>
</Root>
