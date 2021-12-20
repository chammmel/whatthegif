<script lang="ts">
  export let background: string;
  export let color: string = 'white';
  export let width: string = '389px';
  export let height: string = '56px';
  export let href: string = undefined;

  function handleClick() {
    if (!href) {
      return;
    }
    history.pushState(href, '', href);
    window.location.href = href;
  }
</script>

<button
  on:click={handleClick}
  style="background: {background}; color: {color}; width: {width}; height: {height};"
>
  <slot />
</button>

<style>
  button {
    cursor: pointer;
    border: none;
    outline: none;
    padding: 10px 20px;
    font-weight: bold;
    text-transform: uppercase;
    font-size: var(--text-size);
    border-radius: var(--roundy);
    letter-spacing: var(--letter-space);
    box-shadow: var(--box-shadow);
    transition: filter 0.25s;
  }
  button:hover {
    transition: filter 0.25s;
    filter: brightness(var(--hover-brightness));
  }
  button:active {
    transition: 0.2s;
    transform: scale(0.96);
    opacity: 1;
  }
</style>
