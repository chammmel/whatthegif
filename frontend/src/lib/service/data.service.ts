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
  private clientId: number;

  public disconnectFromServer = () => {
    if (this.socket) {
      this.socket.close();
    }
  };

  private getUrl = async (): Promise<string> => {
    const resp = await fetch('http://localhost/api/register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_id: this.clientId })
    });
    const body = await resp.json();
    return body.url;
  };

  public connectToServer = (gotNewMessge: GotNewMessge) => {
    if (!this.socket) {
      this.clientId = this.getClientId();
      console.log(this.clientId);


      this.getUrl().then((url) => {
        this.socket = new WebSocket(url);

        if (this.socket !== undefined) {
          this.socket.addEventListener('open', (event) => {
            console.log('Connected to websocket');
          });
          this.socket.addEventListener('message', async (event) => {
            const buffer = await this.toUint8Array(event.data);

            const message = Message.decode(buffer);
            const content = await this.dataParser(message);

            gotNewMessge(content);

            console.log('Got message', message, content);
          });
        } else {
          console.log('Unable to connect to websocket');
        }
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

  private getClientId(): number {
    const key = 'client_id';
    const existing_clinet_id = localStorage.getItem(key);

    if (existing_clinet_id === null) {
      localStorage.setItem(key, Date.now().toString());
    }

    return parseInt(localStorage.getItem(key));
  }

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
      switch (message.payload.typeUrl as MessageType) {
        case MessageType.PreJoinResponse:
          resolve(PreJoinResponse.decode(buffer));
          break;
        case MessageType.JoinResponse:
          resolve(JoinResponse.decode(buffer));
          break;
        case MessageType.Content:
          resolve(Content.decode(buffer));
          break;
        case MessageType.CreateRoomResponse:
          resolve(CreateRoomResponse.decode(buffer));
          break;

        default:
          reject('Unknown Type: ' + message.payload.typeUrl);
          break;
      }
    });

  private sendMessage = (typeUrl: string, value: Uint8Array) => {
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

export enum MessageType {
  PreJoinResponse = 'PreJoinResponse',
  JoinResponse = 'JoinResponse',
  Content = 'Content',
  CreateRoomResponse = 'CreateRoomResponse'
}

export interface GotNewMessge {
  (message: PreJoinResponse | JoinResponse | Content | CreateRoomResponse): void;
}
