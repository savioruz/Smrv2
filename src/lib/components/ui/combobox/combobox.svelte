<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils';

	type Option = {
		label: string;
		value: string;
	};

	const props = $props<{
		options?: Option[];
		placeholder?: string;
		searchPlaceholder?: string;
		emptyText?: string;
		buttonClass?: string;
		onSelect?: (value: string) => void;
		required?: boolean;
		showError?: boolean;
	}>();

	const {
		options = [],
		placeholder = 'Select option...',
		searchPlaceholder = 'Search...',
		emptyText = 'No option found.',
		buttonClass = '',
		onSelect,
		required = false,
		showError = false
	} = props;

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);
	let selectedOption = $state('');

	const selectedValue = $derived(options.find((f: Option) => f.value === selectedOption)?.label);

	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}

	function handleSelect(value: string) {
		selectedOption = value;
		onSelect?.(value);
		closeAndFocusTrigger();
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger bind:ref={triggerRef}>
		{#snippet child({ props })}
			<Button
				variant="outline"
				class={cn('justify-between', buttonClass, {
					'text-muted-foreground': !selectedValue,
					'border-destructive': showError
				})}
				{...props}
				role="combobox"
				aria-expanded={open}
				aria-required={required}
			>
				{#if selectedValue}
					{#if selectedValue.length > 22}
						{selectedValue.slice(0, 22)}...
					{:else}
						{selectedValue}
					{/if}
				{:else}
					{placeholder}{required ? ' *' : ''}
				{/if}
				<ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class={cn('p-0', buttonClass)} align="start">
		<Command.Root>
			<Command.Input placeholder={searchPlaceholder} />
			<Command.List>
				<Command.Empty>{emptyText}</Command.Empty>
				<Command.Group>
					{#each options as option}
						<Command.Item
							value={option.value}
							onSelect={() => {
								handleSelect(option.value);
							}}
						>
							<Check
								class={cn('mr-2 size-4', selectedOption !== option.value && 'text-transparent')}
							/>
							{option.label}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
