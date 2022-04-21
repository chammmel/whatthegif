<script lang="ts">
  import Logo from '$lib/header/Logo.svelte';

  export let id: string;
</script>

<section id="game">
  <div class="player-bar">
    <div class="player-header">
      <h4>Player</h4>
      <h4><b>Points</b></h4>
    </div>
    <div class="player-items">
      <div class="player-item">
        <div>
          <img
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.dailymoss.com%2Fwp-content%2Fuploads%2F2019%2F08%2Ffunny-profile-pic19-768x576.jpg&f=1&nofb=1"
            alt="PB"
          />
          <span class="player-name">CokeJoke</span>
        </div>
        <span class="points"><b>5</b></span>
      </div>
    </div>
  </div>

  <section class="main-content">
    <div class="logo">
      <Logo height="80px" />
    </div>
    <div class="game-wrapper">
      <div class="game-content">
        <img
          src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.hdwallpaperspulse.com%2Fwp-content%2Fuploads%2F2016%2F08%2F03%2Fdanger-look-funny-animated-gifs.gif&f=1&nofb=1"
          alt="Funny GIF"
        />
        <br />
        <input type="text" id="caption" placeholder="Write a funny caption ..." />
      </div>
    </div>
  </section>
</section>

<style>
  #game {
    display: grid;
    grid-template-columns: 1fr 14fr;
    overflow-y: hidden;
    height: 100%;
    width: 100%;
  }
  .player-bar {
    background-color: var(--background-secondary);
    height: 100%;
    min-height: 100vh;
    width: 300px;
    padding: 25px;
  }
  .small-bar .player-bar {
    padding: 20px;
    width: 90px;
  }
  .player-header {
    display: grid;
    grid-template-columns: auto auto;
    padding-bottom: 10px;
    margin-bottom: 20px;
    border-bottom: 1px solid var(--primary-color);
  }
  h4 {
    letter-spacing: 3px;
    margin: 0;
    color: var(--primary-color);
    font-weight: lighter;
    font-size: 14px;
    text-transform: uppercase;
  }
  h4:nth-child(2) {
    text-align: right;
  }
  .small-bar h4:first-child {
    display: none;
  }
  .small-bar h4 {
    text-align: left;
  }
  .player-items {
    overflow-y: auto;
  }

  .player-item {
    display: grid;
    align-items: center;
    grid-template-columns: auto auto;
    padding-right: 10px;
  }

  .player-item div {
    display: flex;
    align-items: center;
  }

  .player-item img {
    height: 40px;
    width: 40px;
    margin-right: 15px;
  }
  .player-item span {
    color: var(--primary-color);
    font-size: 17px;
    letter-spacing: 2px;
  }

  .small-bar .player-name {
    display: none;
  }

  .points {
    text-align: right;
  }

  .game-wrapper {
    margin: 0 auto;
    max-width: 1100px;
    padding: 100px 0;
    background-color: var(--background-secondary);
  }

  .main-content {
    padding: 0 30px;
    text-align: center;
  }

  .game-content {
    display: inline-block;
    padding: 0 20px;
  }

  .game-content img {
    max-width: 500px;
    width: 100%;
  }

  .game-content input {
    display: inline-block;
    margin-top: 100px;
    height: 40px;
    width: 100%;
    font-size: 18px;
    color: var(--primary-color);
    letter-spacing: 2px;
    border: none;
    border-bottom: 1px solid var(--primary-color);
    background-image: none;
    background-color: transparent;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
  }

  #game .logo {
    margin: 50px 0;
  }

  .logo {
    margin: 50px 0;
  }
</style>
