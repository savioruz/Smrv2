<script lang="ts">
	import Root from './root.svelte';
	import BorderBeam from '$lib/components/ui/border-beam/border-beam.svelte';
	import Combobox from '$lib/components/ui/combobox/combobox.svelte';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import type { PageData } from '../../../routes/$types';
	import { Button } from '$lib/components/ui/button';
	import { useFetch } from '$lib/hooks/use-fetch';
	import type { SchedulesResponse } from '$lib/types/schedules';
	import type { Schedule } from '$lib/types/schedules';
	import { ChevronDown } from 'lucide-svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import { SearchIcon } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import Card from './card.svelte';
	import { onMount } from 'svelte';
	import SkeletonCard from './skeleton-card.svelte';
	import ScrollUp from './scroll-up.svelte';
	import Marquee from '$lib/components/ui/marquee/marquee.svelte';
	export let data: PageData;
	let loading = false;
	let error = false;
	let errorMessage = '';
	let schedules: Schedule[] = [];
	let isSubmitted = false;
	let hasMore = true;
	let loadingMore = false;
	let observer: IntersectionObserver;
	let bottomElement: HTMLDivElement;
	let filterQuery = '';
	let isOpen = false;

	let searchParams = {
		study_program: '',
		day_of_week: '',
		course_code: '',
		class_code: '',
		course_name: '',
		room_number: '',
		semester: '',
		lecturer_name: '',
		page: 1,
		limit: 10,
		sort_by: '',
		sort_order: ''
	};

	const days = [
		{ label: 'Senin', value: 'Senin' },
		{ label: 'Selasa', value: 'Selasa' },
		{ label: 'Rabu', value: 'Rabu' },
		{ label: 'Kamis', value: 'Kamis' },
		{ label: 'Jumat', value: 'Jumat' },
		{ label: 'Sabtu', value: 'Sabtu' }
	];

	const sortByOptions = [
		{ label: 'Kode Mata Kuliah', value: 'course_code' },
		{ label: 'Kode Kelas', value: 'class_code' },
		{ label: 'Nama Mata Kuliah', value: 'course_name' },
		{ label: 'Hari', value: 'day_of_week' },
		{ label: 'Ruangan', value: 'room_number' },
		{ label: 'Semester', value: 'semester' },
		{ label: 'Waktu Mulai', value: 'start_time' },
		{ label: 'Waktu Selesai', value: 'end_time' },
		{ label: 'Dosen', value: 'lecturer_name' }
	];

	const sortOrderOptions = [
		{ label: 'Ascending', value: 'asc' },
		{ label: 'Descending', value: 'desc' }
	];

	onMount(() => {
		observer = new IntersectionObserver(
			(entries) => {
				const first = entries[0];
				if (first.isIntersecting && hasMore && !loadingMore && !loading && schedules.length > 0) {
					loadMore();
				}
			},
			{ threshold: 0.1 }
		);

		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	});

	$: if (bottomElement) {
		observer?.observe(bottomElement);
	}

	const loadMore = async () => {
		if (loadingMore || !hasMore) return;

		loadingMore = true;
		searchParams.page += 1;

		try {
			const queryParams = new URLSearchParams();
			Object.entries(searchParams).forEach(([key, value]) => {
				if (value) {
					queryParams.append(key, value.toString());
				}
			});

			const response = await useFetch<SchedulesResponse>(`/schedules?${queryParams.toString()}`, {
				method: 'GET'
			});

			if (response?.data?.length) {
				schedules = [...schedules, ...response.data];
				hasMore = response.data.length === searchParams.limit;
			} else {
				hasMore = false;
			}
		} catch (err) {
			console.error('Error loading more schedules:', err);
		} finally {
			loadingMore = false;
		}
	};

	const handleSearch = async () => {
		isSubmitted = true;

		if (!searchParams.study_program || !searchParams.day_of_week) {
			error = true;
			errorMessage = 'Program Studi dan Hari harus diisi.';
			return;
		}

		loading = true;
		error = false;
		errorMessage = '';
		schedules = [];
		hasMore = true;
		searchParams.page = 1;

		try {
			const queryParams = new URLSearchParams();
			Object.entries(searchParams).forEach(([key, value]) => {
				if (value) {
					queryParams.append(key, value.toString());
				}
			});

			const response = await useFetch<SchedulesResponse>(`/schedules?${queryParams.toString()}`, {
				method: 'GET'
			});

			if (response?.data?.length) {
				schedules = response.data;
				hasMore = response.data.length === searchParams.limit;
			} else {
				error = true;
				errorMessage = 'Tidak ada jadwal yang ditemukan.';
				hasMore = false;
			}
		} catch (err) {
			error = true;
			errorMessage = 'Gagal mengambil data jadwal.';
			hasMore = false;
		} finally {
			loading = false;
		}
	};

	const handleStudyProgramSelect = (value: string) => {
		searchParams.study_program = value;
		if (isSubmitted && value) {
			error = false;
			errorMessage = '';
		}
	};

	const handleDaySelect = (value: string) => {
		searchParams.day_of_week = value;
		if (isSubmitted && value) {
			error = false;
			errorMessage = '';
		}
	};

	$: filteredSchedules = schedules.filter((schedule) => {
		if (!filterQuery) return true;

		const query = filterQuery.toLowerCase();
		return (
			schedule.course_name.toLowerCase().includes(query) ||
			schedule.course_code.toLowerCase().includes(query) ||
			schedule.class_code.toLowerCase().includes(query) ||
			schedule.room_number.toLowerCase().includes(query) ||
			schedule.lecturer?.toLowerCase().includes(query) ||
			schedule.study_program.toLowerCase().includes(query) ||
			schedule.day.toLowerCase().includes(query) ||
			schedule.start_time.toLowerCase().includes(query) ||
			schedule.end_time.toLowerCase().includes(query) ||
			schedule.semester.toString().includes(query)
		);
	});

	console.log(schedules);
</script>

<Marquee pauseOnHover class="[--duration:20s]">
	<div class="flex items-center gap-4">
		<span
			>✨ Support saya jika suka dengan website ini <a
				href="https://trakteer.id/savioruz"
				target="_blank"
				class="text-blue-500 hover:underline">Trakteer</a
			> ✨.</span
		>
		<span>
			Jika terdapat kendala mengenai website ini, silahkan hubungi saya melalui email
			<a href="mailto:kherr.riil@gmail.com" class="text-blue-500 hover:underline">
				kherr.riil@gmail.com
			</a>
			atau
			<a href="https://t.me/savioruz" class="text-blue-500 hover:underline">Telegram.</a>
		</span>
		<span>Terima kasih ! 🙂</span>
	</div>
</Marquee>
<Root class="flex min-h-[calc(100vh-10rem)] flex-col gap-8">
	<ScrollUp />
	<div class="flex flex-col gap-8">
		<div
			class="relative flex max-w-xl flex-col items-start justify-between rounded-3xl border border-gray-700/70 bg-background p-7"
		>
			<BorderBeam size={150} duration={12} colorFrom="#9c40ff" colorTo="#f8fafc" />
			<div class="my-4 flex gap-2">
				<div class="flex flex-col items-center justify-center gap-2">
					<h1 class="text-4xl font-bold">smrv2</h1>
					<p class="text-md text-muted-foreground">
						Website 3rd party untuk mencari jadwal kuliah dan info ruangan berdasarkan web resmi
						dari simeru (Sistem Manajemen Ruang UAD)
					</p>
				</div>
			</div>
			<div class="my-4 flex w-full flex-col gap-4">
				<Combobox
					options={data.studyPrograms}
					placeholder="Pilih Program Studi"
					searchPlaceholder="Pilih Program Studi"
					emptyText="Program Studi tidak ditemukan."
					buttonClass="w-full"
					onSelect={handleStudyProgramSelect}
					required
					showError={isSubmitted && !searchParams.study_program}
				/>
				<Combobox
					options={days}
					placeholder="Pilih Hari"
					searchPlaceholder="Pilih Hari"
					emptyText="Hari tidak ditemukan."
					buttonClass="w-fit"
					onSelect={handleDaySelect}
					required
					showError={isSubmitted && !searchParams.day_of_week}
				/>
				<Collapsible.Root class="my-2 w-full" bind:open={isOpen}>
					<Collapsible.Trigger class="flex items-center gap-2 text-sm text-muted-foreground">
						<ChevronDown
							class={cn(
								'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
								isOpen && 'rotate-180'
							)}
						/>
						Advanced Search
						<span class="sr-only">Toggle</span>
					</Collapsible.Trigger>
					<Collapsible.Content class="mt-4 space-y-4">
						<div class="grid grid-cols-2 gap-4">
							<Input
								type="text"
								class="text-xs"
								placeholder="Kode Mata Kuliah"
								bind:value={searchParams.course_code}
							/>
							<Input
								type="text"
								class="text-xs"
								placeholder="Kode Kelas"
								bind:value={searchParams.class_code}
							/>
							<Input
								type="text"
								class="text-xs"
								placeholder="Nama Mata Kuliah"
								bind:value={searchParams.course_name}
							/>
							<Input
								type="text"
								class="text-xs"
								placeholder="Ruangan"
								bind:value={searchParams.room_number}
							/>
							<Input
								type="text"
								class="text-xs"
								placeholder="Semester"
								bind:value={searchParams.semester}
							/>
							<Input
								type="text"
								class="text-xs"
								placeholder="Nama Dosen"
								bind:value={searchParams.lecturer_name}
							/>
						</div>
						<div class="grid grid-cols-2 gap-4">
							<Select.Root type="single" bind:value={searchParams.sort_by}>
								<Select.Trigger
									class={cn(searchParams.sort_by ? 'text-xs' : 'text-xs text-muted-foreground')}
								>
									{#if searchParams.sort_by}
										{sortByOptions.find((option) => option.value === searchParams.sort_by)?.label}
									{:else}
										Urutkan Berdasarkan
									{/if}
								</Select.Trigger>
								<Select.Content>
									{#each sortByOptions as option}
										<Select.Item value={option.value}>{option.label}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
							<Select.Root type="single" bind:value={searchParams.sort_order}>
								<Select.Trigger
									class={cn(searchParams.sort_order ? 'text-xs' : 'text-xs text-muted-foreground')}
								>
									{#if searchParams.sort_order}
										{sortOrderOptions.find((option) => option.value === searchParams.sort_order)
											?.label}
									{:else}
										Urutan
									{/if}
								</Select.Trigger>
								<Select.Content>
									{#each sortOrderOptions as option}
										<Select.Item value={option.value}>{option.label}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>
						<div class="grid grid-cols-2 gap-4">
							<Input type="number" placeholder="Halaman" bind:value={searchParams.page} min="1" />
							<Input
								type="number"
								placeholder="Jumlah per halaman"
								bind:value={searchParams.limit}
								min="1"
								max="100"
							/>
						</div>
					</Collapsible.Content>
				</Collapsible.Root>
				<Button onclick={handleSearch} variant="default" data-sveltekit-preload-data>
					{loading ? 'Loading...' : 'Cari'}
				</Button>
			</div>
		</div>
	</div>
	<div class="flex w-full flex-col items-center justify-center gap-4">
		{#if loading}
			{#each Array(4) as _}
				<SkeletonCard />
			{/each}
		{:else if schedules.length > 0}
			<div class="flex w-full max-w-xl items-center justify-between px-2">
				<h4 class="md:text-md text-sm text-muted-foreground">
					{#if filterQuery && filteredSchedules.length !== schedules.length}
						Showing {filteredSchedules.length} of {schedules.length}
					{:else}
						{schedules.length} results found
					{/if}
				</h4>
				<div class="relative flex w-[60%] items-center justify-start md:w-1/2">
					<SearchIcon class="absolute ml-3 text-muted-foreground" width={20} height={20} />
					<Input
						type="text"
						placeholder="Filter..."
						bind:value={filterQuery}
						class={cn(
							'bg-background px-3 py-1 text-sm shadow-sm transition-colors',
							'file:border-0 file:bg-transparent file:text-sm file:font-medium',
							'pl-10 placeholder:text-muted-foreground focus-visible:outline-none',
							'disabled:cursor-not-allowed disabled:opacity-50'
						)}
					/>
				</div>
			</div>
			{#if filteredSchedules.length > 0}
				{#each filteredSchedules as schedule}
					<Card {schedule} class="max-w-xl" />
				{/each}
				{#if hasMore && !filterQuery}
					<div bind:this={bottomElement} class="flex w-full justify-center py-4">
						{#if loadingMore}
							<SkeletonCard />
						{/if}
					</div>
				{/if}
			{:else}
				<p class="text-muted-foreground">No results match your filter criteria.</p>
			{/if}
		{:else if error}
			<p class="text-muted-foreground">{errorMessage}</p>
		{/if}
	</div>
</Root>
