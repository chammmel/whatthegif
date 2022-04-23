<script context="module">
  import Input from '$lib/input/Input.svelte';
  import PopUp from '$lib/popup/PopUp.svelte';
  import GifButton from '$lib/input/GifButton.svelte';
  import { user as UserStore } from '$lib/stores/user';
  import { closePopUp } from '$lib/stores/popup';
</script>

<script lang="ts">
  let username = '';

  function submit() {
    UserStore.update((u) => ({
      ...u,
      name: username
    }));
    closePopUp();
  }
</script>

<PopUp>
  <Input placeholder="Username" bind:value={username} />
  <span /><span />
  <GifButton background="var(--blue-color)" on:click={submit}>Join</GifButton>
</PopUp>

<style>
  span {
    height: 15px;
  }
</style>
