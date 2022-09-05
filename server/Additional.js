/**
 * This class stores the state of an additional object on the server.
 */

const Constants = require('../lib/Constants')
const Entity = require('../lib/Entity')
const Vector = require('../lib/Vector')

/**
 * additional object class.
 */
class Additional extends Entity {
  /**
   * Constructor for a additional object object.
   * @constructor
   * @param {Vector} position The starting position vector
   * @param {Vector} velocity The starting velocity vector
   * @param {number} angle The orientation of the bullet
   * @param {Player} source The Player object firing the bullet
   */
  constructor(position, velocity, angle, type) {
    super(position, velocity, Vector.zero(), Constants.BULLET_HITBOX_SIZE)
    this.angle = angle
    this.type = type
    this.destroyed = false
  }


  /**
   * Performs a physics update.
   * @param {number} lastUpdateTime The last timestamp an update occurred
   * @param {number} deltaTime The timestep to compute the update with
   */
  update(lastUpdateTime, deltaTime) {
    const distanceStep = Vector.scale(this.velocity, deltaTime)
    this.position.add(distanceStep)
    this.distanceTraveled += distanceStep.mag2
    if (this.inWorld() || distanceStep > Bullet.MAX_TRAVEL_DISTANCE_SQ) {
      this.destroyed = true
    }
  }
}

module.exports = Additional
