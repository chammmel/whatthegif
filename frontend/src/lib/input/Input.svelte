<script lang="ts">
  export let width: string = '389px';
  export let height: string = '56px';
  export let placeholder: string = '';
  export let type: string = 'text';
  export let border: 'square' | 'roundy' = 'square';
  export let value: string | number = '';
  export let min: number = undefined;
  export let max: number = undefined;
  export let label: string = undefined;
  let borderRadius: string = border == 'square' ? '10px' : '32px';

  const handleInput = (e) => {
    value = type.match(/^(number|range)$/) ? +e.target.value : e.target.value;
  };
</script>

<div style="width: {width}; height: {height};">
  {#if label}
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label>{label}</label>
  {/if}
  <div class="input">
    <input
      style="border-radius: {borderRadius};"
      {type}
      {placeholder}
      {min}
      {max}
      {value}
      on:input={handleInput}
    />
  </div>
</div>

<style>
  .input {
    display: flex;
    height: 100%;
    width: 100%;
    border-radius: var(--roundy);
    box-shadow: var(--box-shadow);
  }

  label {
    margin-left: 30px;
    font-weight: bold;
    font-size: 12px;
    text-transform: uppercase;
    color: var(--primary-color);
  }

  input {
    outline: none;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    border: none;
    padding: 0 30px;
    font-size: var(--text-size);
    letter-spacing: var(--letter-space);
  }

  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }

  input::placeholder {
    text-transform: uppercase;
    color: var(--light-color);
  }
</style>
