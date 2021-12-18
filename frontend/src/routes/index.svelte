<script context="module" lang="ts">
  export const prerender = true;
</script>

<script lang="ts">
  import AnimatedLogo from '$lib/header/AnimatedLogo.svelte';
  import JoinInput from '$lib/input/JoinInput.svelte';
  import Button from '$lib/input/Button.svelte';
import { onMount } from 'svelte';
import { connectToServer } from '$lib/service/data.service';

  onMount(async () => {
    connectToServer('room123', 'user');
  });
</script>

<svelte:head>
  <title>WhatTheGif - FUNNY MONKEY</title>
</svelte:head>

<section>
  <div class="logo">
    <AnimatedLogo />
  </div>
  <JoinInput width={'100%'} />
  <span>OR</span>
  <Button width={'100%'} background="var(--green-color)">Create a lobby</Button>
</section>

<style>
  .logo {
    margin-bottom: 50px;
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
