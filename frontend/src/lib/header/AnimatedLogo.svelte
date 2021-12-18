<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, blur, scale } from 'svelte/transition';

  let show = false;
  let duration = 3000;

  onMount(() => {
    show = true;
  });

  function doHover(node, { duration }) {
    let move = 0;
    return {
      duration,
      css: (timer) => {
        if (timer >= 0.5) {
          return `transform: translateY(${move--}px);`;
        } else {
          return `transform: translateY(${move++}px);`;
        }
      }
    };
  }
</script>

<div class="animated-logo">
  {#if show}
    <svg
      id="ani-logo"
      class="content"
      version="1.2"
      baseProfile="tiny-ps"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 500"
      out:scale={{ duration: 200 }}
    >
      <title>whatthegif-logo</title>
      <path
        in:fade={{ duration: 100 }}
        id="WHAT"
        fill="#c223a6"
        aria-label="WHAT"
        d="M65.74 225L25.14 54.26L67.34 54.26L96.84 178.34L126.12 54.26L168.55 54.26L197.83 178.34L227.33 54.26L269.19 54.26L228.93 225L178.16 225L147.16 95.2L116.51 225L65.74 225ZM298.01 225L298.01 54.26L342.04 54.26L342.04 119.33L407 119.33L407 54.26L451.03 54.26L451.03 225L407 225L407 152.61L342.04 152.61L342.04 225L298.01 225ZM608.39 225L597.64 193.89L528.79 193.89L517.93 225L473.67 225L536.91 54.26L589.41 54.26L652.65 225L608.39 225ZM563.22 94.28L539.77 162.21L586.55 162.21L563.22 94.28ZM636.75 87.54L636.75 54.26L794.12 54.26L794.12 87.54L737.51 87.54L737.51 225L693.48 225L693.48 87.54L636.75 87.54Z"
      />
      <path
        in:scale={{ duration: 200 }}
        id="THE"
        fill="#35f08f"
        aria-label="THE"
        d="M36.78 286.54L36.78 253.26L194.15 253.26L194.15 286.54L137.54 286.54L137.54 424L93.51 424L93.51 286.54L36.78 286.54ZM216.91 424L216.91 253.26L260.94 253.26L260.94 318.33L325.89 318.33L325.89 253.26L369.92 253.26L369.92 424L325.89 424L325.89 351.61L260.94 351.61L260.94 424L216.91 424ZM412.93 424L412.93 253.26L531.75 253.26L531.75 286.54L456.96 286.54L456.96 318.33L527.29 318.33L527.29 351.61L456.96 351.61L456.96 390.72L534.26 390.72L534.26 424L412.93 424Z"
      />
      <path
        in:blur={{ duration: 300 }}
        id="GIF"
        fill="#18a0ea"
        aria-label="GIF"
        d="M724.1 344.14L770.91 411.6Q761.95 427.57 749.66 440.96Q737.38 454.36 721.88 465.11Q686.83 489.43 652.79 484.1Q618.68 478.67 595.4 445.13Q571.87 411.21 579.23 377.29Q586.6 343.36 622.86 318.2Q636.87 308.48 651.47 302.25Q666.17 295.95 681.12 293.23L701.27 322.26Q684.89 323.74 670.96 328.53Q657.12 333.26 645.47 341.35Q623.86 356.34 620.52 376.61Q617.22 396.72 632.8 419.18Q648.25 441.45 667.94 445.75Q687.62 450.05 708.39 435.64Q714.02 431.73 718.36 427.74Q722.72 423.6 725.53 419.42L706.63 392.18L684.55 407.5L667.73 383.25L724.1 344.14ZM810 399.93L712.67 259.65L748.84 234.55L846.18 374.83L810 399.93ZM881.6 350.25L784.26 209.97L881.89 142.23L900.86 169.58L839.41 212.21L857.54 238.33L915.32 198.24L934.29 225.58L876.51 265.68L917.77 325.15L881.6 350.25Z"
      />
      <path
        in:scale={{ duration: 600 }}
        id="?"
        fill="#f2a933"
        aria-label="?"
        d="M948.5 115.29L950.71 119.93L913.43 137.66L911.02 132.6Q907 124.13 907.31 116.01Q907.57 107.78 913.71 92.45L917.47 83.32Q920.8 75.15 921.23 69.12Q921.76 63.04 919.5 58.29Q916.06 51.06 909.19 49.39Q902.26 47.62 893.38 51.84Q885.02 55.82 876.98 63.95Q868.89 71.97 861.6 83.8L846.18 51.37Q856.61 41.09 865.96 34.11Q875.3 27.13 884.91 22.57Q910.11 10.58 928.24 14.62Q946.32 18.56 955.7 38.29Q960.51 48.41 960.32 58.38Q960.07 68.25 954.74 82.06L950.92 91.09Q946.95 100.83 946.64 105.79Q946.29 110.64 948.5 115.29ZM938.18 189.72L920.7 152.95L957.98 135.22L975.47 171.99L938.18 189.72Z"
      />
    </svg>
  {:else}
    <div class="content">
      <div class="ratio" />
    </div>
  {/if}
</div>

<style>
  #ani-logo {
    animation: hover 3s infinite linear;
  }
  .ratio {
    display: block;
    width: 380px;
    height: 190px;
  }
  .content {
    width: 20vw;
  }

  @keyframes hover {
    0% {
      transform: translateY(6px);
      animation-timing-function: ease-out;
    }

    50% {
      transform: translateY(-6px);
      animation-timing-function: ease-out;

    }

    100% {
      transform: translateY(7px);
      animation-timing-function: ease-in;
    }
  }

  @media screen and (max-width: 1200px) {
    .content {
      width: 30vw;
    }
  }
  @media screen and (max-width: 850px) {
    .content {
      width: 50vw;
    }
  }
  svg {
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  }
</style>
