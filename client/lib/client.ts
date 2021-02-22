import Peer from "peerjs";
import { TransformData } from "./cart";
const serverId = "test-shriek-local";

export type RecieveDataPayload =
  | {
      type: "walls";
      payload: Element[];
    }
  | {
      type: "goal";
      payload: Element[];
    }
  | {
      type: "winner";
      payload: string;
    };

export type SendDataPayload =
  | {
      type: "nick";
      payload: string;
    }
  | {
      type: "transform";
      payload: TransformData;
    };

type Listener = (data: RecieveDataPayload) => void;
export default function connect(onConnect: () => void) {
  let connIsOpened = false;
  let conn: Peer.DataConnection = null;

  let listener: Listener = () => {};
  const peer = new Peer(null, { debug: 2 });
  peer.on("open", (c) => {
    conn = peer.connect(serverId);
    conn.on("open", () => {
      connIsOpened = true;
      onConnect();
    });
    conn.on("data", listener);
  });

  return {
    onData: (cb: Listener) => {
      listener = cb;
    },
    send: (data: SendDataPayload) => {
      if (connIsOpened) {
        conn.send(data);
      }
    },
  };
}
