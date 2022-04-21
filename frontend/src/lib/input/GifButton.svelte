<script context="module" lang="ts">
  export enum GifType {
    DOOR,
    FUNNY
  }
</script>

<script lang="ts">
  import { goto } from '$app/navigation';

  import { createEventDispatcher } from 'svelte';

  export let type: GifType = GifType.FUNNY;
  export let background: string;
  export let color: string = 'white';
  export let width: string = '389px';
  export let height: string = '56px';
  export let href: string = undefined;

  function getGifArray(): Array<string> {
    switch (type) {
      case GifType.DOOR:
        return [
          'https://i.giphy.com/media/3xz2Bu76X2laXkT636/giphy.webp',
          'https://i.giphy.com/media/l2YWzcnnPFGF7SOYg/giphy.webp',
          'https://i.giphy.com/media/xjqNH3Bml1gTC/giphy.webp',
          'https://i.giphy.com/media/3o6Mb946KEr1YMSGs0/giphy.webp'
        ];
      case GifType.FUNNY:
        return [
          'https://i.giphy.com/media/fUYhyT9IjftxrxJXcE/giphy.webp',
          'https://i.giphy.com/media/vsYZ25o9MkGQ/giphy.webp',
          'https://i.giphy.com/media/YlGi4AtvW4YsqV1uLZ/giphy.webp'
        ];
    }
  }

  function getRandomGif(): string {
    let gifArray: Array<string> = getGifArray();
    return gifArray[Math.floor(Math.random() * gifArray.length)];
  }

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
  style="--gif-url: url({getRandomGif()}); background-color: {background}; color: {color}; width: {width}; height: {height};"
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
    background-image: var(--gif-url);
    background-size: cover;
    background-position: 50% 50%;
    transition: 0.5s;
  }
</style>
