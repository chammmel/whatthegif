<script lang="ts">
  import { goto } from '$app/navigation';

  import { createEventDispatcher } from 'svelte';

  export let background: string;
  export let color: string = 'white';
  export let width: string = '389px';
  export let height: string = '56px';
  export let href: string = undefined;

  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch('click');
    if (!href) {
      return;
    }
    goto(href);
  }
</script>

<button
  class="gif-button"
  on:click={handleClick}
  style="background-color: {background}; color: {color}; width: {width}; height: {height};"
  ><slot /></button
>

<style>
  button {
    border: none;
    cursor: pointer;
    letter-spacing: 4px;
    font-size: 20px;
    font-weight: bold;
    text-transform: uppercase;
    border-radius: var(--roundy);
  }
  button:hover {
    background-blend-mode: multiply;
    background-image: url('https://i.giphy.com/media/3xz2Bu76X2laXkT636/giphy.webp');
    background-size: cover;
    background-position: 50% 50%;
    transition: 0.5s;
  }
</style>
