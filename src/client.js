import Peer from "peerjs";
import { serverId } from "./shared";

export default class Client {
  constructor(world, player) {
    this.world = world;
    this.peer = new Peer(null, { debug: 2 });
    this.peer.on("open", (c) => {
      this.conn = this.peer.connect(serverId);
      this.conn.on("open", () => {
        this.connIsOpened = true;
      });
      this.conn.on("data", (data) => {
        if (data.type === "walls") {
          world.drawWalls(data.payload);
        }
        if (data.type === "goal") {
          world.drawGoal(data.payload);
        }
        if (data.type === "winner") {
          alert("Winner!!\n The winner is... " + data.payload);
          player.reset();
        }
      });
    });
  }

  sendTransform(transform) {
    if (this.previousTransform === transform) return;

    this.previousTransform = transform;
    if (this.connIsOpened) {
      this.conn.send({ type: "transform", payload: transform });
    }
  }

  sendNick(nick) {
    if (this.connIsOpened) {
      this.conn.send({ type: "nick", payload: nick });
    }
  }
}
