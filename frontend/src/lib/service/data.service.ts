import { Message } from "protobufjs";

let socket: WebSocket;

export const close = () => {
  socket.close();
};

export const connectToServer = (room: string, username: string) => {
  socket = new WebSocket('ws://localhost:8080/start-websocket/' + room + "-" + username);

    socket.addEventListener('open', (event) => {
      console.log(event);
    });
    socket.addEventListener('message', async (event) => {
      const buffer = await loadData(event.data);

      const message = Message.decode(buffer);

      console.log(message);
    });
};

const loadData = async (data: Blob): Promise<Uint8Array> =>
  new Promise((resolve) => {
      const reader = new FileReader();

      reader.addEventListener('loadend', function () {
        const view = new Uint8Array(reader.result as ArrayBuffer);

        resolve(view);
      });

      reader.readAsArrayBuffer(data);

  })


//socket.addEventListener('open', (event) => {
//console.log(event);
//});
//socket.addEventListener('message', (event) => {
//const reader = new FileReader();

//reader.addEventListener('loadend', function () {
//const view = new Uint8Array(reader.result as ArrayBuffer);
//console.log(SearchRequest.decode(view));
//});

//reader.readAsArrayBuffer(event.data);
//});
