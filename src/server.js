import Peer from "peerjs";

const peer = new Peer("7yez92nvc9f00000", { debug: 2 });

function extractAttributes(attributes) {
  const map = [];
  for (let i = 0; i < attributes.length; i++) {
    const attr = attributes.item(i);
    map.push({ name: attr.name, value: attr.value });
  }
  return map;
}

function extractElementChildren(children) {
  const map = [];
  for (let i = 0; i < children.length; i++) {
    const child = children.item(i);
    map.push({
      nodeName: child.nodeName,
      attributes: extractAttributes(child.attributes),
    });
  }
  return map;
}

const wallElements = extractElementChildren(
  document.querySelector("#walls").children
);

// console.log(wallElements);
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
    conn.send(wallElements);
    conn.send("hey from server");
  });
});
