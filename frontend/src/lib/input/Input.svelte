<script lang="ts">
  export let width: string = '389px';
  export let height: string = '56px';
  export let placeholder = '';
  export let type = 'text';
</script>

<div style="width: {width}; height: {height};" class="input">
  <input {type} {placeholder} />
</div>

<style>
  .input {
    display: flex;
    border-radius: var(--roundy);
    box-shadow: var(--box-shadow);
  }

  input {
    outline: none;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    border: none;
    padding-left: 20px;
    border-radius: 10px;
    font-size: var(--text-size);
    letter-spacing: var(--letter-space);
  }

  input::placeholder {
    text-transform: uppercase;
    color: var(--light-color);
  }
</style>
