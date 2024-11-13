<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { onMount } from 'svelte';

	import type * as MeshSdk from '@meshsdk/core';

	import plutusScript from '$lib/validators/plutus.json';
	import cbor from 'cbor';

	// This is an example of how to turn the plutus.json file into a usable object to pass into transactions...
	const script: MeshSdk.PlutusScript = {
		code: cbor.encode(Buffer.from(plutusScript.validators[0].compiledCode, 'hex')).toString('hex'),
		version: 'V3'
	};

	let meshSdk: typeof MeshSdk | undefined = $state();
	let wallets: MeshSdk.Wallet[] = $state([]);
	let activeWallet: MeshSdk.BrowserWallet | undefined = $state();

	let networkId: number | undefined = $state();
	let lovelaceBalance: number | undefined = $state();

	$effect(() => {
		if (activeWallet) {
			activeWallet.getNetworkId().then((id) => {
				networkId = id;
			});
			activeWallet.getLovelace().then((lovelace) => {
				lovelaceBalance = Number(lovelace);
			});
		}
	});

	onMount(async () => {
		meshSdk = await import('@meshsdk/core');
		wallets = await meshSdk.BrowserWallet.getAvailableWallets();
	});

	async function enableWallet(availWallet: MeshSdk.Wallet) {
		if (meshSdk) {
			activeWallet = await meshSdk.BrowserWallet.enable(availWallet.id);
		}
	}
</script>

<div class="col-1 flex w-full flex-col items-center justify-center text-center">
	<p class="pb-3 pt-5 text-6xl">Web3 Starter Kit</p>
	<p class="p-2 text-xl">
		Built & maintained by <a class="text-primary font-extrabold" href="https://xes.software"
			>xes.software</a
		>
	</p>

	<div class="p-4">
		{#if meshSdk === undefined}
			<div class="flex flex-wrap justify-center gap-4">
				<Skeleton class="bg-primary/10 h-36 w-36 rounded-lg" />
				<Skeleton class="bg-primary/10 h-36 w-36 rounded-lg" />
				<Skeleton class="bg-primary/10 h-36 w-36 rounded-lg" />
			</div>
		{:else if wallets.length === 0}
			<div class="flex flex-col items-center justify-center gap-4 text-center">
				<Skeleton class="bg-primary/10 h-36 w-36 rounded-lg" />
				<p class="text-muted-foreground">Could not find a Cardano Web Wallet.</p>
			</div>
		{:else}
			<div class="flex flex-wrap justify-center gap-4">
				{#each wallets as wallet}
					<button onclick={() => enableWallet(wallet)}>
						<Card.Root class="hover:bg-primary/10 hover:cursor-pointer">
							<Card.Content
								><img class="h-24 w-24" src={wallet.icon} alt={wallet.name} /></Card.Content
							>
						</Card.Root>
					</button>
				{/each}
			</div>
		{/if}
	</div>
	{#if activeWallet}
		<div class="flex items-start justify-start text-start">
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-xl">
						{String(activeWallet._walletName).charAt(0).toUpperCase() +
							String(activeWallet._walletName).slice(1)}
						Wallet
					</Card.Title>
				</Card.Header>
				<Card.Content>
					{#if networkId !== undefined}
						<div class="flex">
							<p class="pr-2 font-semibold">Current Network:</p>
							<p>{networkId === 0 ? 'Preprod' : 'Mainnet'}</p>
						</div>
					{/if}
					{#if lovelaceBalance !== undefined}
						<div class="flex">
							<p class="pr-2 font-semibold">Balance:</p>
							<p>{lovelaceBalance} Lovelace</p>
						</div>
					{/if}
				</Card.Content>
			</Card.Root>
		</div>
	{/if}
</div>
