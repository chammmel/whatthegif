<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from '@sveltejs/kit';

  export async function load(ctx: LoadInput): Promise<LoadOutput> {
    let id = ctx.params.id;
    return { props: { id } };
  }
</script>

<script lang="ts">
  import Game from '$lib/game/game.svelte';
  import Lobby from '$lib/game/lobby.svelte';

  export let id: string;
  let authenticated: boolean = true;
  let lobby: boolean = true;
</script>

<svelte:head>
  <title>WhatTheGif | #{id.toUpperCase()}</title>
</svelte:head>

{#if authenticated}
  {#if lobby}
    <Lobby {id} />
  {:else}
    <Game {id} />
  {/if}
{/if}
