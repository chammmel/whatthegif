<script lang="ts">
  import backend from '$lib/stores/backend';
  import { onDestroy } from 'svelte';
  import { onMount } from 'svelte';
  import '../app.css';

  let messages = [];

  const unsubscribe = backend.subscribe(m => messages = m);
  onDestroy(unsubscribe)
</script>

<svelte:head>
  <link rel="stylesheet" href="css/global.css" />
</svelte:head>

<main>
  <slot />

  <ul>
    {#each messages as msg}
      <li>
        <p> {JSON.stringify(msg)}</p>
      </li>
    {/each}
  </ul>
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
