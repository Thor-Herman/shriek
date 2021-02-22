// Car
const CAR_START_SPEED = 0;
const CAR_START_ANGLE = 0;
const CAR_RADIUS = 10;
const CAR_ACCELERATION_MIN = 0.1;
const CAR_ACCELERATION_MAX = 0.3;
const CAR_ROTATION = 0.04 * Math.PI;
const CAR_ROTATION_MIN = 0.03 * Math.PI;
const CAR_ROTATION_MAX = 0.1 * Math.PI;
const GROUNDSPEED_DECAY_MULT = 0.94;
const CAR_MIN_TURN_SPEED = 0.5; // Minimum speed to turn
const CAR_MIN_SPEED = 0.1; // Minimum speed the car can go
const CAR_BOUNCE_TIMER = 15;

export default class Car {
  constructor(
    input,
    world,
    radius = CAR_RADIUS,
    speed = CAR_START_SPEED,
    angle = CAR_START_ANGLE
  ) {
    this.input = input;
    this.world = world;

    this.x = this.startX = 0;
    this.y = this.startY = 0;

    this.radius = radius;
    this.speed = speed;
    this.angle = angle;
    this.outOfControlTimer = CAR_BOUNCE_TIMER;
  }

  updateByVolume(volume) {
    const forward = volume > 0;
    const acceleration = Math.min(
      Math.max(CAR_ACCELERATION_MIN, volume),
      CAR_ACCELERATION_MAX
    );

    if (this.outOfControlTimer > 0) {
      if (forward) {
        this.speed = this.speed + acceleration;
      }

      if (this.input.left && Math.abs(this.speed) > CAR_MIN_TURN_SPEED) {
        this.angle = this.angle - modifier(this.input.left);
      }
      if (this.input.right && Math.abs(this.speed) > CAR_MIN_TURN_SPEED) {
        this.angle = this.angle + modifier(this.input.right);
      }
    }

    // Move
    this.x = this.x + Math.cos(this.angle) * this.speed;
    this.y = this.y + Math.sin(this.angle) * this.speed;

    // Automatic deceleration
    if (Math.abs(this.speed) > CAR_MIN_SPEED)
      this.speed = this.speed * GROUNDSPEED_DECAY_MULT;
    else this.speed = 0;
  }

  getTransform() {
    return {
      x: this.x,
      y: this.y,
      degrees: toDegrees(this.angle),
    };
  }

  trackBounce() {
    this.outOfControlTimer -= 1;
    this.speed = this.speed * -0.5;
  }

  checkCollision(player) {
    const els = this.world.obstacles();
    var playerRect = player.getBoundingClientRect();
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

  checkStandStillAndReset() {
    if (this.outOfControlTimer < 0) {
      this.reset();
    }
  }

  reset() {
    this.x = this.startX;
    this.y = this.startY;
    this.speed = CAR_START_SPEED;
    this.angle = CAR_START_ANGLE;
    this.outOfControlTimer = CAR_BOUNCE_TIMER;
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
