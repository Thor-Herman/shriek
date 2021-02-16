import Peer from "peerjs";
export default class World {
  constructor(rootElement) {
    this.element = rootElement;
    this.peer = new Peer(null, { debug: 2 });
    this.peer.on("open", (c) => {
      this.conn = this.peer.connect("7yez92nvc9f00000");
      this.conn.on("open", () => {
        this.connIsOpened = true;
      });
    });
    this.peer.on("error", (err) => console.log(err));
  }

  obsticles() {
    return this.element.querySelector("#walls").children;
  }

  moveCar(car, x, y) {
    if (this.connIsOpened) this.conn.send([x, y, car.angle]);
    car.x = x;
    car.y = y;
  }
}
