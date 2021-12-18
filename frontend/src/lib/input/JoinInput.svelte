<script lang="ts">
  import { connectToServer, disconnectFromServer } from '$lib/service/data.service';

  export let width: string = '389px';
  export let height: string = '56px';

  let room = '';

  function join() {
    disconnectFromServer();
    if (room !== '') {
      connectToServer(room);
    }
    room = '';
  }
</script>

<div style="width: {width}; height: {height};" class="join-input">
  <input bind:value={room} type="text" placeholder="Invite code" />
  <span on:click={join} id="label">Join</span>
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
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
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
    transition: box-shadow 1s;
  }

  #label:hover {
    transition: filter 0.25s;
    filter: brightness(var(--hover-brightness));
  }

  #label:active {
    transition: box-shadow 0.1s;
    box-shadow: 2px 3px 9px 0px var(--purple-color);
  }
</style>
