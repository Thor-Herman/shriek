import Peer from "peerjs";
const serverId = "test-shriek-local";

export default function connect(onConnect) {
  let connIsOpened;
  let conn;

  let listener = () => {};
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
    onData: (cb) => {
      listener = cb;
    },
    send: (data) => {
      if (connIsOpened) {
        conn.send(data);
      }
    },
  };
}
