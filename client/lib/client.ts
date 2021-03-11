import Peer from "peerjs";
import { RecieveDataPayload, SendDataPayload } from "../../types";
const serverId = "test-shriek-local";

type Listener = (data: RecieveDataPayload) => void;
export default function connect(onConnect: () => void) {
  let connIsOpened = false;
  let conn: Peer.DataConnection | null = null;

  let listener: Listener = () => {};
  const peer = new Peer({
    host: "shrieek-peerjs.herokuapp.com",
    port: 443,
    secure: true,
    debug: 2,
  });
  peer.on("open", (_) => {
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
        conn?.send(data);
      }
    },
  };
}
