<script lang="ts">
  import PopUpHandler from '$lib/popup/PopUpHandler.svelte';

  import backend from '$lib/stores/backend';
  import { onDestroy } from 'svelte';
  import { onMount } from 'svelte';
  import '../app.css';

  onMount(() => {
    backend.connect();
    backend.listen();
  });
</script>

<PopUpHandler />
<slot />
