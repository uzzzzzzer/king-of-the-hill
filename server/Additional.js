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
   * Constructor for an additional object.
   * @constructor
   * @param {Vector} position The starting position vector
   * @param {Vector} velocity The starting velocity vector
   * @param {number} angle The orientation of the object
   * @param {string} type The type of this object
   * @param {number} type The type of this object
   */
  constructor(position, velocity, angle, type, hitbox_size) {
    super(position, velocity, Vector.zero(), hitbox_size)
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
  }
}

module.exports = Additional
