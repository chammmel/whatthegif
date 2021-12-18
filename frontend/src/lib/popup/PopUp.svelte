<div class="overlay">
  <div class="popup">
    <slot />
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    display: flex;
    align-items: center;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    z-index: 9999;
  }
  .popup {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    padding: 5rem 2rem;
    max-width: 700px;
    margin: 0 auto;
    width: 100%;
    height: auto;
    color: var(--primary-color);
    border-radius: var(--roundy);
    background: var(--background-color);
    filter: brightness(var(--hover-brightness));
    box-shadow: var(--box-shadow);
  }
</style>
