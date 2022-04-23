<script lang="ts">
  import { currentPopUp, PopUpType } from '$lib/stores/popup';
  import JoinPopUp from './JoinPopUp.svelte';
</script>

{#if $currentPopUp === PopUpType.JOIN}
  <JoinPopUp />
{/if}
