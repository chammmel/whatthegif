<script lang="ts">
  import popup, { PopUpType } from '$lib/stores/popup';
  import { onDestroy } from 'svelte';
  import JoinPopUp from './JoinPopUp.svelte';

  export let current: PopUpType = PopUpType.NONE;

  const unsubscribe = popup.currentPopUp.subscribe((t) => {
    current = t;
  });

  onDestroy(unsubscribe);
</script>

{#if current === PopUpType.JOIN}
  <JoinPopUp />
{/if}
