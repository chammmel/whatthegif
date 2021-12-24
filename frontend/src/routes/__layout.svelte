<script lang="ts">
  import Header from '$lib/header/Header.svelte';
  import '../app.css';
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
