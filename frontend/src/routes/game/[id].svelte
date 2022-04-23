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
  import { user as UserStore } from '$lib/stores/user';
  import backend from '$lib/stores/backend';
  import { GameState, PreJoinRequest } from '$lib/generated/protocol/communication';
  import { onDestroy } from 'svelte';
  import { currentPopUp as PopupStore, PopUpType } from '$lib/stores/popup';
  import { room } from '$lib/stores/room';

  export let id: string;
  let isAuthenticated: boolean;
  const unsubscribeUser = UserStore.subscribe((u) => {
    if (!u?.isAuthenticated) {
      if (u?.name) {
        backend.request(PreJoinRequest, 'PreJoinRequest', { room: id } as PreJoinRequest);
      } else {
        PopupStore.set(PopUpType.JOIN);
      }
    }
    isAuthenticated = u?.isAuthenticated;
  });

  onDestroy(() => {
    unsubscribeUser();
  });
</script>

<svelte:head>
  <title>WhatTheGif | #{id.toUpperCase()}</title>
</svelte:head>

{#if isAuthenticated}
  {#if $room.gameState === GameState.LOBBY}
    <Lobby {id} />
  {:else}
    <Game {id} />
  {/if}
{/if}
