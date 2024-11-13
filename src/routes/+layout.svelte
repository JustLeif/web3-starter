<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<script>
		(function () {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			if (prefersDark) {
				document.documentElement.classList.add('dark');
			}
		})();
	</script>
</svelte:head>

{@render children()}
