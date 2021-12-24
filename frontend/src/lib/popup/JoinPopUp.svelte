<script context="module">
  import Input from '$lib/input/Input.svelte';
  import Button from '$lib/input/Button.svelte';
  import PopUp from '$lib/popup/PopUp.svelte';
</script>

<PopUp>
  <Input placeholder="Username" />
  <span />
  <Input placeholder="Password" type="password" />
  <span /><span />
  <Button background="var(--blue-color)">Join</Button>
  <span /><span />
</PopUp>

<style>
  span {
    height: 15px;
  }
</style>
