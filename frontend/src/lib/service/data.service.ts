import {
  Content,
  JoinResponse,
  Message,
  PreJoinRequest,
  PreJoinResponse
} from '$lib/generated/protocol/communication';

export class DataService {
  private socket: WebSocket = undefined;
  private clientId = Date.now();

  public disconnectFromServer = () => {
    if (this.socket) {
      this.socket.close();
    }
  };

  public connectToServer = () => {
    if (!this.socket) {
      this.socket = new WebSocket('ws://localhost:8080/websocket/' + this.clientId);
      console.log('Connected to websocket');

      this.socket.addEventListener('open', (event) => {
        console.log(event);
      });
      this.socket.addEventListener('message', async (event) => {
        const buffer = await this.toUint8Array(event.data);

        const message = Message.decode(buffer);
        console.log('Got message', message);
        const content = await this.dataParser(message);

        console.log(content);
      });
    }
  };

  public preJoinRequest = (room: string) => {
    const data = PreJoinRequest.encode(
      PreJoinRequest.fromJSON({
        room
      })
    ).finish();

    this.sendMessage('PreJoinRequest', data);
  };

  private toUint8Array = async (data: Blob): Promise<Uint8Array> =>
    new Promise((resolve) => {
      const reader = new FileReader();

      reader.addEventListener('loadend', function () {
        const view = new Uint8Array(reader.result as ArrayBuffer);

        resolve(view);
      });

      reader.readAsArrayBuffer(data);
    });

  private dataParser = (message: Message): Promise<PreJoinResponse | JoinResponse | Content> =>
    new Promise((resolve, reject) => {
      console.log({ message });
      const buffer = message.payload.value;
      switch (message.payload.typeUrl) {
        case 'PreJoinResponse':
          resolve(PreJoinResponse.decode(buffer));
          break;
        case 'JoinResponse':
          resolve(JoinResponse.decode(buffer));
          break;
        case 'Content':
          resolve(Content.decode(buffer));
          break;

        default:
          reject('Unknown Type: ' + message.payload.typeUrl);
          break;
      }
    });

  private sendMessage = (typeUrl: string, value: Uint8Array) => {
    console.log(typeUrl, value);

    const bits = Message.encode(
      Message.fromPartial({
        origin: 'client',
        payload: {
          typeUrl,
          value
        }
      })
    ).finish();

    if (this.socket === undefined) {
      console.error('Unable to send data throw websocket');
    } else {
      this.socket.send(bits);
    }
  };
}
