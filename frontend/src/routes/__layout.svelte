<script lang="ts">
  import Header from '$lib/header/Header.svelte';
  import '../app.css';
</script>

<svelte:head>
  <link rel="stylesheet" href="css/global.css" />
</svelte:head>

<Header />

<main>
  <slot />
</main>

<footer>
  <div class="wrapper">
    <p>buy us</p>
    <span>
      <a target="_blank" href="https://github.com/chammmel">
        <img src="https://avatars.githubusercontent.com/u/96302818?s=200&v=4" alt="chammel" />
      </a>
    </span>
    <p>
      a coffee to <a target="_blank" href="https://www.buymeacoffee.com/JMankowski">support us</a>
    </p>
  </div>
</footer>

<style>
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .wrapper {
    display: flex;
  }

  img {
    margin: 0 10px;
    height: 40px;
    width: 40px;
  }

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px;
    color: var(--light-color);
  }

  footer a {
    font-weight: bold;
    color: var(--yellow-color);
  }

  @media (min-width: 480px) {
    footer {
      padding: 40px 0;
    }
  }
</style>
