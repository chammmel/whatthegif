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
    align-items: center;
    padding: 40px;
    color: var(--light-color);
  }

  footer a {
    font-weight: bold;
    color: var(--yellow-color);
  }

  @media (max-width: 400px) {
    footer {
      padding: 0;
    }
    .wrapper {
      display: inline-block;
      text-align: center;
    }
    img {
      margin: 0;
    }
  }
</style>
