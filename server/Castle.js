/**
 * This class stores the state of a castle on the server.
 */

const Constants = require('../lib/Constants')
const Entity = require('../lib/Entity')
const Vector = require('../lib/Vector')

/**
 * additional object class.
 */
class Castle extends Entity {
  /**
   * Constructor for a castle.
   * @constructor
   * @param {Vector} position The starting position vector
   * @param {Vector} velocity The starting velocity vector
   * @param {number} angle The orientation of the bullet
   * @param {string} type The type of this object
   */
  constructor(position, velocity, angle, owner, hitbox_size) {
    super(position, velocity, Vector.zero(), hitbox_size)
    this.owner = owner
    this.owner = owner
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

module.exports = Castle
