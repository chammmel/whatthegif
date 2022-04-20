<script context="module" lang="ts">
  export const prerender = true;
</script>

<script lang="ts">
  import AnimatedLogo from '$lib/header/AnimatedLogo.svelte';
  import JoinInput from '$lib/input/JoinInput.svelte';
  import Button from '$lib/input/Button.svelte';
  import Footer from '$lib/footer/Footer.svelte';
  import PopUpHandler from '$lib/popup/PopUpHandler.svelte';
</script>

<svelte:head>
  <title>WhatTheGif</title>
</svelte:head>

<main>
  <section>
    <PopUpHandler />
    <div class="logo">
      <AnimatedLogo />
    </div>
    <JoinInput width={'100%'} />
    <span>OR</span>
    <Button href="/create" width={'100%'} background="var(--green-color)">Create a lobby</Button>
  </section>
  <Footer />
</main>

<style>
  .logo {
    margin-bottom: 50px;
  }
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
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    margin: 0 auto;
  }
  span {
    font-size: 25px;
    font-weight: bold;
    color: white;
    margin: 20px 0;
    letter-spacing: var(--letter-space);
    filter: var(--drop-shadow);
  }
</style>
