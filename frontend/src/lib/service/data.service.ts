import {
  Content,
  JoinResponse,
  Message,
  PreJoinResponse
} from '$lib/generated/protocol/communication';

let socket: WebSocket;

export const disconnectFromServer = () => {
  if (socket) {
    socket.close();
  }
};

export const connectToServer = (room: string) => {
  socket = new WebSocket('ws://localhost:8080/start-websocket/' + room);

  socket.addEventListener('open', (event) => {
    console.log(event);
  });
  socket.addEventListener('message', async (event) => {
    const buffer = await toUint8Array(event.data);

    const message = Message.decode(buffer);
    const content = dataParser(message);

    console.log(content as PreJoinResponse);
  });
};

const toUint8Array = async (data: Blob): Promise<Uint8Array> =>
  new Promise((resolve) => {
    const reader = new FileReader();

    reader.addEventListener('loadend', function () {
      const view = new Uint8Array(reader.result as ArrayBuffer);

      resolve(view);
    });

    reader.readAsArrayBuffer(data);
  });

const dataParser = (message: Message): PreJoinResponse | JoinResponse | Content => {
  const buffer = message.payload.value;
  switch (message.payload.typeUrl) {
    case 'PreJoinResponse':
      return PreJoinResponse.decode(buffer);
    case 'JoinResponse':
      return JoinResponse.decode(buffer);
    case 'Content':
      return Content.decode(buffer);

    default:
      break;
  }
};

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
