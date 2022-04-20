<script context="module">
  import Input from '$lib/input/Input.svelte';
  import Button from '$lib/input/Button.svelte';
  import PopUp from '$lib/popup/PopUp.svelte';
  import GifButton from '$lib/input/GifButton.svelte';
</script>

<PopUp>
  <Input placeholder="Username" />
  <span />
  <Input placeholder="Password" type="password" />
  <span /><span />
  <GifButton background="var(--blue-color)">Join</GifButton>
</PopUp>

<style>
  span {
    height: 15px;
  }
</style>
