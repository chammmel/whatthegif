<div class="overlay">
    <div class="popup">
        <slot />
    </div>
</div>

<style>
    .overlay {

    }
    .popup {
        display: flex;
        background: var(--background-color);
    }
</style>