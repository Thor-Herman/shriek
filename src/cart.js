// Car
const CAR_START_SPEED = 0;
const CAR_START_ANGLE = -Math.PI / 2;
const CAR_RADIUS = 10;
const CAR_ACCELERATION = 0.3;
const CAR_ACCELERATION_MIN = 0.1;
const CAR_ACCELERATION_MAX = 0.3;
const CAR_ROTATION = 0.04 * Math.PI;
const CAR_ROTATION_MIN = 0.03 * Math.PI;
const CAR_ROTATION_MAX = 0.1 * Math.PI;
const GROUNDSPEED_DECAY_MULT = 0.94;
const CAR_MIN_TURN_SPEED = 0.5; // Minimum speed to turn
const CAR_MIN_SPEED = 0.1; // Minimum speed the car can go
const CAR_BOUNCE_TIMER = 15;

import Peer from "peerjs";

export default class Car {
  constructor(
    element,
    input,
    world,
    radius = CAR_RADIUS,
    speed = CAR_START_SPEED,
    angle = CAR_START_ANGLE
  ) {
    this.element = element;
    this.peer = new Peer(null, { debug: 2 });
    this.peer.on("open", (c) => {
      this.conn = this.peer.connect("7yez92nvc9f00000");
      this.conn.on("open", () => {
        this.connIsOpened = true;
      });
      this.conn.on("data", (data) => {
        const walls = document.querySelector("#walls");
        if (walls.children.length === 0) {
          data.forEach((d) => {
            const svgEl = document.createElementNS(
              "http://www.w3.org/2000/svg",
              d.nodeName
            );
            d.attributes.forEach((a) => {
              svgEl.setAttribute(a.name, a.value);
            });

            walls.appendChild(svgEl);
          });
        }
      });
    });
    this.world = world;
    const rect = element.getBoundingClientRect();
    this.x = rect.x;
    this.y = rect.y;

    this.radius = radius;
    this.speed = speed;
    this.angle = angle;
    this.outOfControlTimer = 0;

    this.input = input;
  }

  /**
   * Return car's next horizontal position
   */
  getNextX() {
    return this.x + Math.cos(this.angle) * this.speed;
  }

  /**
   * Return car's next vertival position
   */
  getNextY() {
    return this.y + Math.sin(this.angle) * this.speed;
  }

  /**
   * Update
   * @param {*} canvas
   * @param {*} input
   */
  update(width, height) {
    if (this.outOfControlTimer > 0) {
      this.outOfControlTimer = this.outOfControlTimer - 1;
    } else {
      if (this.input.forward) {
        this.speed = this.speed + CAR_ACCELERATION;
      }
      if (this.input.left) {
        this.angle = this.angle - CAR_ROTATION;
      }
      if (this.input.right) {
        this.angle = this.angle + CAR_ROTATION;
      }
    }
    // Move
    this.x = this.x + Math.cos(this.angle) * this.speed;
    this.y = this.y + Math.sin(this.angle) * this.speed;

    // Automatic deceleration
    if (Math.abs(this.speed) > CAR_MIN_SPEED)
      this.speed = this.speed * GROUNDSPEED_DECAY_MULT;
    else this.speed = 0;
    // Wall bounce
    // if (this.y <= height / 2 || this.y >= height) this.speed *= -1;
    // if (this.x >= width || this.x <= 0) this.speed *= -1;
  }

  updateByVolume(left, right, volume) {
    const forward = volume > 0;
    const acceleration = Math.min(
      Math.max(CAR_ACCELERATION_MIN, volume),
      CAR_ACCELERATION_MAX
    );

    if (this.outOfControlTimer > 0) {
      this.outOfControlTimer = this.outOfControlTimer - 1;
    } else {
      if (forward) {
        this.speed = this.speed + acceleration;
      }

      if (left && Math.abs(this.speed) > CAR_MIN_TURN_SPEED) {
        this.angle = this.angle - modifier(left);
      }
      if (right && Math.abs(this.speed) > CAR_MIN_TURN_SPEED) {
        this.angle = this.angle + modifier(right);
      }
    }
    // Move
    this.world.moveCar(
      this,
      this.x + Math.cos(this.angle) * this.speed,
      this.y + Math.sin(this.angle) * this.speed
    );
    // this.x = this.x + Math.cos(this.angle) * this.speed;
    // this.y = this.y + Math.sin(this.angle) * this.speed;

    // Automatic deceleration
    if (Math.abs(this.speed) > CAR_MIN_SPEED)
      this.speed = this.speed * GROUNDSPEED_DECAY_MULT;
    else this.speed = 0;
    // Wall bounce
    // if (this.y <= height / 2 || this.y >= height) this.speed *= -1;
    // if (this.x >= width || this.x <= 0) this.speed *= -1;
  }

  /**
   * Draw
   */
  draw() {
    const transform = `translate(${this.x}, ${this.y}) rotate(${toDegrees(
      this.angle
    )})`;

    if (this.previousTransform === transform) return;

    this.previousTransform = transform;
    if (this.connIsOpened) {
      this.conn.send(transform);
    }
    this.element.setAttribute("transform", transform);
  }

  /**
   * Called when the bounces on a wall
   */
  trackBounce() {
    this.outOfControlTimer = CAR_BOUNCE_TIMER;
    this.speed = this.speed * -0.5;
  }

  checkCollision() {
    const els = this.world.obstacles();
    var playerRect = this.element.getBoundingClientRect();
    return Array.from(els).some((item) => {
      if (!item == this.element) return false;
      var other = item.getBoundingClientRect();
      return !(
        other.left > playerRect.right ||
        other.right < playerRect.left ||
        other.top > playerRect.bottom ||
        other.bottom < playerRect.top
      );
    });
  }

  /**
   * Reset ball position and speed
   */
  reset(carStartX, carStartY) {
    this.x = carStartX;
    this.y = carStartY;
    this.speed = CAR_START_SPEED;
    this.angle = CAR_START_ANGLE;
  }
}

function toDegrees(angle) {
  return angle * (180 / Math.PI);
}

function modifier(volume) {
  return Math.max(
    Math.min(volume * CAR_ROTATION, CAR_ROTATION_MAX),
    CAR_ROTATION_MIN
  );
}
