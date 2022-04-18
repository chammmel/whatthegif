<script lang="ts">
  import backend from '$lib/stores/backend';
  import { onDestroy } from 'svelte';
  import { onMount } from 'svelte';
  import '../app.css';

  onMount(() => backend.listen());
</script>

<slot />
