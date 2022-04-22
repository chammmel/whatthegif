<script lang="ts">
  import Logo from '$lib/header/Logo.svelte';
  import backend from '$lib/stores/backend';
  import { onMount, onDestroy } from 'svelte';
  import { MessageType } from '$lib/service/data.service';
  import {
    RoomInfoError,
    RoomInfoRequest,
    type RoomInfoResponse
  } from '$lib/generated/protocol/communication';

  export let id: string;
  let roomInfoResponse: RoomInfoResponse = {
    code: '123',
    playerCount: -1,
    players: -1,
    rounds: 0,
    keywords: [],
    error: RoomInfoError.UNRECOGNIZED
  };

  const unsubscribe = backend.subscribe((newMessage) => {
    if (newMessage) {
      if (newMessage.messageType === MessageType.RoomInfoResponse) {
        roomInfoResponse = newMessage.data as RoomInfoResponse;
      }
    }
  });

  onDestroy(unsubscribe);

  onMount(() => {
    backend.request(RoomInfoRequest, 'RoomInfoRequest', { code: id } as RoomInfoRequest);
  });

  function copyId() {
    navigator.clipboard.writeText(window.location.href);
    document.getElementById('copied').style.display = 'inline-block';
    setTimeout(() => {
      document.getElementById('copied').style.display = 'none';
    }, 1000);
  }
</script>

<section id="lobby">
  <div class="logo">
    <Logo height="80px" />
  </div>
  <div class="grid">
    <div class="box">
      <div class="header">
        <h2>Lobby</h2>
        <h2>
          #{id}
          <svg
            on:click={copyId}
            width="17"
            height="19"
            viewBox="0 0 17 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_41_40)">
              <path
                d="M16.4665 2.44703L14.4978 0.521721C14.1562 0.187671 13.6929 2.47028e-06 13.2098 0L6.67857 0C5.67261 0 4.85714 0.79748 4.85714 1.78125V3.5625H1.82143C0.815469 3.5625 0 4.35998 0 5.34375V17.2188C0 18.2025 0.815469 19 1.82143 19H10.3214C11.3274 19 12.1429 18.2025 12.1429 17.2188V15.4375H15.1786C16.1845 15.4375 17 14.64 17 13.6562V3.70656C17 3.23414 16.8081 2.78108 16.4665 2.44703ZM10.0938 17.2188H2.04911C1.98872 17.2188 1.93081 17.1953 1.88811 17.1535C1.84542 17.1118 1.82143 17.0551 1.82143 16.9961V5.56641C1.82143 5.50735 1.84542 5.45072 1.88811 5.40896C1.93081 5.36721 1.98872 5.34375 2.04911 5.34375H4.85714V13.6562C4.85714 14.64 5.67261 15.4375 6.67857 15.4375H10.3214V16.9961C10.3214 17.0551 10.2974 17.1118 10.2547 17.1535C10.212 17.1953 10.1541 17.2188 10.0938 17.2188ZM14.9509 13.6562H6.90625C6.84587 13.6562 6.78795 13.6328 6.74526 13.591C6.70256 13.5493 6.67857 13.4926 6.67857 13.4336V2.00391C6.67857 1.94485 6.70256 1.88822 6.74526 1.84646C6.78795 1.80471 6.84587 1.78125 6.90625 1.78125H10.9286V5.04688C10.9286 5.53876 11.3363 5.9375 11.8393 5.9375H15.1786V13.4336C15.1786 13.4926 15.1546 13.5493 15.1119 13.591C15.0692 13.6328 15.0113 13.6562 14.9509 13.6562ZM15.1786 4.15625H12.75V1.78125H13.1155C13.1759 1.78125 13.2338 1.8047 13.2765 1.84645L15.1119 3.64136C15.133 3.66204 15.1498 3.68658 15.1613 3.7136C15.1727 3.74062 15.1786 3.76957 15.1786 3.79881V4.15625Z"
                fill="#8E8E8E"
              />
            </g>
            <defs>
              <clipPath id="clip0_41_40">
                <rect width="17" height="19" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span id="copied">Copied</span>
        </h2>
      </div>

      <div class="item">
        <h3>Rounds</h3>
        <h3>{roomInfoResponse.rounds}</h3>
      </div>
      <div class="item">
        <h3>Max players</h3>
        <h3>{roomInfoResponse.players}</h3>
      </div>

      <div class="header">
        <h2>Gif Keywords</h2>
      </div>
    </div>

    <div class="box">
      <div class="header">
        <h2>Players</h2>
        <h2>{roomInfoResponse.playerCount}/{roomInfoResponse.players}</h2>
      </div>

      <div class="players">
        <div class="player">
          <img
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.dailymoss.com%2Fwp-content%2Fuploads%2F2019%2F08%2Ffunny-profile-pic19-768x576.jpg&f=1&nofb=1"
            alt="PB"
          />
          <span>CokeJoke</span>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .logo {
    margin: 50px 0;
  }

  .box {
    padding: 30px;
    background-color: var(--background-secondary);
    height: 600px;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 10px;
    row-gap: 10px;
    width: 100%;
  }
  @media screen and (max-width: 1300px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }

  #copied {
    display: none;
    position: absolute;
    margin-top: 35px;
    margin-left: -40px;
    border-radius: 5px;
    padding: 6px;
    letter-spacing: 1px;
    font-size: 15px;
    font-weight: normal;
    background-color: var(--background-color);
  }

  .header {
    margin-top: 50px;
    display: grid;
    grid-template-columns: auto auto;
    padding-bottom: 15px;
    margin-bottom: 10px;
    border-bottom: 1px solid var(--primary-color);
  }
  .header:first-child {
    margin: 0;
  }
  .header h2:nth-child(2) {
    text-align: right;
  }
  .header svg {
    transition: 0.5s;
    cursor: pointer;
    margin-left: 5px;
  }
  .header svg:hover {
    transition: 0.5s;
    filter: brightness(1.2);
  }
  .header svg:active {
    transition: 0.2s;
    filter: brightness(2);
  }

  h2 {
    font-size: 22px;
    margin: 0;
    color: var(--primary-color);
    text-transform: uppercase;
    font-weight: lighter;
    letter-spacing: 4px;
  }

  h3 {
    font-size: 17px;
    margin: 0;
    color: var(--primary-color);
    text-transform: uppercase;
    font-weight: lighter;
    letter-spacing: 4px;
  }

  .item {
    padding: 0 15px;
    padding-top: 20px;
    display: grid;
    grid-template-columns: auto auto;
  }
  .item h3:nth-child(2) {
    text-align: right;
  }

  .players {
    margin-top: 15px;
    overflow-y: auto;
    height: 550px;
  }
  .player {
    display: flex;
    padding: 20px;
    align-items: center;
  }
  .player img {
    height: 35px;
    width: 35px;
  }
  .player span {
    color: var(--primary-color);
    letter-spacing: 2px;
    font-size: 20px;
    margin-left: 15px;
  }

  #lobby {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    margin: 0 auto;
    width: 100%;
    max-width: 1000px;
    padding-bottom: 100px;
  }
</style>
