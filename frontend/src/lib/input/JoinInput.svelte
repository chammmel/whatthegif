<script lang="ts">
  export let width: string = '389px';
  export let height: string = '56px';
</script>

<div style="width: {width}; height: {height};" class="join-input">
  <input type="text" placeholder="Invite code" />
  <span id="label">Join</span>
</div>

<style>
  .join-input {
    display: flex;
    border-radius: var(--roundy);
    box-shadow: var(--box-shadow);
  }

  input {
    outline: none;
    box-sizing: border-box;
    height: 100%;
    width: 80%;
    border: none;
    padding-left: 20px;
    text-transform: uppercase;
    border-radius: var(--roundy) 0px 0px var(--roundy);
    font-size: var(--text-size);
    letter-spacing: var(--letter-space);
  }

  input::placeholder {
    color: var(--light-color);
  }

  #label {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 15px;
    height: 100%;
    width: 20%;
    color: white;
    text-transform: uppercase;
    font-weight: bold;
    transition: filter 0.25s;
    border-radius: 0px var(--roundy) var(--roundy) 0px;
    background-color: var(--purple-color);
    font-size: var(--text-size);
    letter-spacing: var(--letter-space);
  }

  #label:hover {
    transition: filter 0.25s;
    filter: brightness(var(--hover-brightness));
  }
</style>
