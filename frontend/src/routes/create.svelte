<script context="module" lang="ts">
  export const prerender = true;
</script>

<script lang="ts">
  import Input from '$lib/input/Input.svelte';
  import Button from '$lib/input/Button.svelte';
  import Logo from '$lib/header/Logo.svelte';
  import backend from '$lib/stores/backend';

  let players = 8;
  let rounds = 10;
  let password = '';
  let keywords = '';

  function create() {
    backend.createRoomRequest(players, rounds, password, keywords.replace(' ', '').split(','));
  }
</script>

<svelte:head>
  <title>WhatTheGif | Create a Lobby</title>
</svelte:head>

<section>
  <div class="logo">
    <Logo />
  </div>
  <h1>Create a Lobby</h1>
  <div class="grid">
    <Input
      bind:value={players}
      label="Max players"
      type="number"
      min={2}
      border="roundy"
      width="100%"
    />
    <Input
      bind:value={rounds}
      label="Rounds"
      type="number"
      min={1}
      max={69}
      border="roundy"
      width="100%"
    />
  </div>
  <span>Optional</span>
  <Input type="password" placeholder="Password" border="roundy" width="100%" />
  <div class="spacer" />
  <Input placeholder="Gif Keywords" border="roundy" width="100%" />
  <p>Seperate keywords by comma</p>
  <Button on:click={create} width={'100%'} background="var(--green-color)">Create</Button>
</section>

<style>
  h1 {
    text-align: center;
    font-size: 30px;
    text-transform: uppercase;
    margin-bottom: 60px;
    color: var(--primary-color);
  }
  .logo {
    margin: 50px 0;
  }
  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    margin: 0 auto;
    width: 100%;
    max-width: 450px;
    padding-bottom: 100px;
  }
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
    row-gap: 25px;
    width: 100%;
  }
  @media screen and (max-width: 410px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
  span {
    font-size: 22px;
    font-weight: bold;
    margin: 40px 0;
    text-transform: uppercase;
    color: var(--light-color);
    letter-spacing: var(--letter-space);
    filter: var(--drop-shadow);
  }
  p {
    padding: 10px 0;
    margin-bottom: 50px;
    font-size: 15px;
    text-transform: uppercase;
    color: var(--light-color);
  }
  .spacer {
    height: 25px;
  }
</style>
