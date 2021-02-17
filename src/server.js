import Peer from "peerjs";

const peer = new Peer("7yez92nvc9f00000", { debug: 2 });

const player = document.querySelector("#player");
function draw(transform) {
  player.setAttribute("transform", transform);
}

peer.on("open", function (id) {
  console.log("ID: " + peer.id);
});
peer.on("error", function (err) {
  console.log(err);
});

peer.on("connection", (conn) => {
  console.log("hey conn!");
  conn.on("data", (transform) => {
    draw(transform);
  });
  conn.on("open", () => {
    conn.send("hello!");
  });
});
