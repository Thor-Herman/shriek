import Peer from "peerjs";

const peer = new Peer("7yez92nvc9f00000", { debug: 2 });

const player = document.querySelector("#player");
function draw(x, y, angle) {
  console.log("Server:", x, y, angle);
  let transform = `translate(${x}, ${y}) rotate(${toDegrees(angle)})`;
  player.setAttribute("transform", transform);
}
function toDegrees(angle) {
  return angle * (180 / Math.PI);
}

peer.on("open", function (id) {
  console.log("ID: " + peer.id);
});
peer.on("error", function (err) {
  console.log(err);
});

peer.on("connection", (conn) => {
  console.log("hey conn!");
  conn.on("data", ([x, y, angle]) => {
    draw(x, y, angle);
  });
  conn.on("open", () => {
    conn.send("hello!");
  });
});
