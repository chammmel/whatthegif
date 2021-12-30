import {
  Content,
  CreateRoomRequest,
  CreateRoomResponse,
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

  public connectToServer = (gotNewMessge: GotNewMessge) => {
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

        gotNewMessge(content);

        console.log(content);
      });
    }
    return this;
  };

  public preJoinRequest = (room: string) => {
    const data = PreJoinRequest.encode(
      PreJoinRequest.fromJSON({
        room
      })
    ).finish();

    this.sendMessage('PreJoinRequest', data);
  };

  public createRoomRequest = (
    players: number,
    rounds: number,
    password: string,
    keywords: Array<string>
  ) => {
    let raw: CreateRoomRequest = {
      players,
      rounds,
      password,
      keywords
    };
    if (password === '') {
      delete raw.password;
    }
    const data = CreateRoomRequest.encode(CreateRoomRequest.fromJSON(raw)).finish();

    this.sendMessage('CreateRoomRequest', data);
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

  private dataParser = (
    message: Message
  ): Promise<PreJoinResponse | JoinResponse | Content | CreateRoomResponse> =>
    new Promise((resolve, reject) => {
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
        case 'CreateRoomResponse':
          resolve(CreateRoomResponse.decode(buffer));
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
      if (this.socket.readyState <= 1) {
        this.socket.send(bits);
      }
    }
  };
}

export interface GotNewMessge {
  (message: PreJoinResponse | JoinResponse | Content | CreateRoomResponse): void;
}
