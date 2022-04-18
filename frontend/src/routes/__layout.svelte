<script lang="ts">
  import backend from '$lib/stores/backend';
  import { onDestroy } from 'svelte';
  import { onMount } from 'svelte';
  import '../app.css';

  onMount(() => backend.listen());
</script>

<svelte:head>
  <link rel="stylesheet" href="css/global.css" />
</svelte:head>

<main>
  <slot />
</main>

<style>
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    height: 100vh;
    max-width: 1024px;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>
