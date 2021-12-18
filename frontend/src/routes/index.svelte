<script context="module" lang="ts">
export const prerender = true;
</script>

<script lang="ts">
import Counter from '$lib/Counter.svelte';
import { SearchRequest } from '$lib/protocol/communication';
import { onMount } from 'svelte';

const asd: SearchRequest =  {
query: 'login',
       pageNumber: 1,
       resultPerPage: 50
}

onMount(async () => {
    const send = SearchRequest.encode(asd).finish();
    console.log(send);

    /*console.log(SearchRequest.decode(send));*/
    const socket = new WebSocket("ws://localhost:8080/start-websocket/asd");

    socket.addEventListener('open', (event) => {
        console.log(event);

        })
    socket.addEventListener('message', (event) => {

        const reader = new FileReader();

        reader.addEventListener("loadend", function() {
            const view = new Uint8Array(reader.result as ArrayBuffer);
            console.log(SearchRequest.decode(view));
            });

        reader.readAsArrayBuffer(event.data);

        })

})


/*socket.onopen((asd: Event) => {*/

/*})*/
/*socket.onmessage((es: WebSocket, ev: MessageEvent<Uint8Array>) => {*/
/*console.log(event)*/
/*console.log(SearchRequest.decode(event));*/
/*})*/

</script>

<svelte:head>
<title>Home</title>
</svelte:head>

<section>
<h1>
<div class="welcome">
<picture>
<source srcset="svelte-welcome.webp" type="image/webp" />
<img src="svelte-welcome.png" alt="Welcome" />
</picture>
</div>

to your new<br />SvelteKit app
</h1>

<h2>
try editing <strong>src/routes/index.svelte</strong>
</h2>

<Counter />
</section>

<style>
section {
display: flex;
         flex-direction: column;
         justify-content: center;
         align-items: center;
flex: 1;
}

h1 {
width: 100%;
}

.welcome {
position: relative;
width: 100%;
height: 0;
padding: 0 0 calc(100% * 495 / 2048) 0;
}

.welcome img {
position: absolute;
width: 100%;
height: 100%;
top: 0;
display: block;
}
</style>
