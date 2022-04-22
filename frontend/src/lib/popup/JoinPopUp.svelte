<script context="module">
  import Input from '$lib/input/Input.svelte';
  import PopUp from '$lib/popup/PopUp.svelte';
  import GifButton from '$lib/input/GifButton.svelte';
  import UserStore from '$lib/stores/user';
  import popup from '$lib/stores/popup';
</script>

<script lang="ts">
  let username = '';

  function submit() {
    UserStore.user.update((u) => ({
      ...u,
      name: username
    }));
    popup.closePopUp();
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
