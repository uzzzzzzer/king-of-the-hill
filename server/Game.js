/**
 * Game class on the server to manage the state of existing players and
 * and entities.
 * @author Zloy Negr
 */

const Bullet = require('./Bullet')
const Vector = require('../lib/Vector')
const Additional = require('./Additional')
const Player = require('./Player')
const Castle = require('./Castle')
const Powerup = require('./Powerup')

const Constants = require('../lib/Constants')
const AI = require('./AI/AI')

/**
 * Game class.
 */
class Game {
  /**
   * Constructor for a Game object.
   */
  constructor() {
    /**
     * This is a Map containing all the connected socket ids and socket
     * instances.
     */
    this.clients = new Map()
    /**
     * This is a Map containing all the connected socket ids and the players
     * associated with them. This should always be parallel with sockets.
     */
    this.players = new Map()
    this.projectiles = []
    this.powerups = []
    this.additional_objects = [
    new Additional(Vector.fromArray([Constants.WORLD_MAX/2, Constants.WORLD_MAX/2]), Vector.zero(), 0, "hill", 500),
    new Additional(Vector.fromArray([Constants.WORLD_MAX/2, Constants.WORLD_MAX/2]), Vector.zero(), 0, "top", 0)
    ]
    var names = ["JIGIT", "ZLOY NEGR", "KING", "(-_-)", "(•_•)", "King of the hill", "Evil king"];
    /*for(var i = 0; i < Constants.MAX_BOTS; i++){
      this.players.set("Bot[" + i + "]", Player.create(names[Math.floor(Math.random() * names.length)] + "(" + i + ")", "Bot[" + i + "]"))
    }*/
    //this.players.set("Bot[1]", Player.create("JIGIT", "Bot[1]"))
    //this.players.set("Bot[2]", Player.create("ZLOY NEGR", "Bot[2]"))

    this.lastUpdateTime = Date.now()
    this.deltaTime = 0
    this.full = 0
    this.gameTime = 0
    this.finished = 0
    this.waitTime = 0
  }

  /**
   * Creates a new Game object.
   * @return {Game}
   */
  static create() {
    const game = new Game()
    game.init()
    return game
  }

  /**
   * Initializes the game state.
   */
  init() {
    this.lastUpdateTime = Date.now()
  }

  /**
   * Creates a new player with the given name and ID.
   * @param {string} name The display name of the player.
   * @param {Object} socket The socket object of the player.
   */
  addNewPlayer(name, socket) {
    this.clients.set(socket.id, socket)
    this.players.set(socket.id, Player.create(name, socket.id))
  }
  checkIfFull(){
    const currentTime = Date.now()
    this.deltaTime += currentTime - this.lastUpdateTime
    console.log(this.deltaTime)
    this.waitTime += this.deltaTime
    this.full = [...this.players.values()].length >= Constants.PLAYERS_IN_ROOM - Constants.MAX_BOTS * (this.waitTime >= Constants.MAX_WAIT_TIME)
    if(this.full){
      for(var i = 0; i < Constants.PLAYERS_IN_ROOM - [...this.players.values()].length; i++){
        var names = ["JIGIT", "ZLOY NEGR", "KING", "(-_-)", "(•_•)", "King of the hill", "Evil king"];
        this.players.set("Bot[" + i + "]", Player.create(names[Math.floor(Math.random() * names.length)] + "(" + i + ")", "Bot[" + i + "]"))
      }
    }
    this.lastUpdateTime = Date.now()
  }
  /**
   * Removes the player with the given socket ID and returns the name of the
   * player removed.
   * @param {string} socketID The socket ID of the player to remove.
   * @return {string}
   */
  removePlayer(socketID) {
    if (this.clients.has(socketID)) {
      this.clients.delete(socketID)
    }
    if (this.players.has(socketID)) {
      const player = this.players.get(socketID)
      this.players.delete(socketID)
      return player.name
    }
  }

  /**
   * Returns the name of the player with the given socket id.
   * @param {string} socketID The socket id to look up.
   * @return {string}
   */
  getPlayerNameBySocketId(socketID) {
    if (this.players.has(socketID)) {
      return this.players.get(socketID).name
    }
  }

  /**
   * Updates the player with the given socket ID according to the input state
   * object sent by the player's client.
   * @param {string} socketID The socket ID of the player to update
   * @param {Object} data The player's input state
   */
  updatePlayerOnInput(socketID, data) {
    const player = this.players.get(socketID)
    if (player) {
      player.updateOnInput(data)
      if (data.shoot && player.canShoot()) {
        const projectiles = player.getProjectilesFromShot()
        this.projectiles.push(...projectiles)
      }
    }
  }

  /**
   * Updates the state of all the objects in the game.
   */
  update() {
    const currentTime = Date.now()
    this.deltaTime = currentTime - this.lastUpdateTime
    this.lastUpdateTime = currentTime
    this.gameTime += this.deltaTime
    this.finished = this.gameTime > Constants.GAME_TIME
    /**
     * Perform a physics update and collision update for all entities
     * that need it.
     */
    const entities = [
      ...this.players.values(),
      ...this.projectiles,
      ...this.powerups,
      ...this.additional_objects
    ]
    entities.forEach(
      entity => { entity.update(this.lastUpdateTime, this.deltaTime) })
    var throne = 1
    for (let i = 0; i < entities.length; ++i) {
      for (let j = i + 1; j < entities.length; ++j) {
        let e1 = entities[i]
        let e2 = entities[j]
        if (e1 instanceof Bullet && 
            Math.max(e1.position.x, e1.position.y) >= Constants.WORLD_MAX ||
            Math.min(e1.position.x, e1.position.y) <= Constants.WORLD_MIN){
          e1.destroyed = true;
        }
        if (e1 instanceof Player && e2 instanceof Player) {
          if(e2.castle.collided(e1.castle) && e1.army < e2.army){
            e1.spawn()
          }
          else if(e2.castle.collided(e1.castle)){
            e2.spawn()
          }
        }
        if (e1 instanceof Player && e2 instanceof Player) {
          if(e2.castle.collided(e1)){
            e1.army -= this.deltaTime * Constants.CASTLE_POWER
          }
        }
        if (!e1.collided(e2)) {
          continue
        }

        // Player-Bullet collision interaction
        if (e1 instanceof Bullet && e2 instanceof Player) {
          e1 = entities[j]
          e2 = entities[i]
        }
        if (e1 instanceof Player && e2 instanceof Bullet &&
          e2.source !== e1) {
          e1.tomato = 1
          e1.last_tomato = currentTime
          e1.damage(e2.damage)
          if (e1.isDead()) {
            e1.spawn()
            e1.deaths++
            e2.source.kills++
          }
          e2.destroyed = true
        }

        // Player-Powerup collision interaction
        if (e1 instanceof Powerup && e2 instanceof Player) {
          e1 = entities[j]
          e2 = entities[i]
        }
        if (e1 instanceof Player && e2 instanceof Player) {
          var a = this.deltaTime * e1.army * Constants.PLAYER_DAMAGE
          var b = this.deltaTime * e2.army * Constants.PLAYER_DAMAGE
          e1.army -= b
          e2.army -= a
          e1.army = Math.max(e1.army, 0)
          e2.army = Math.max(e2.army, 0)
          e1.last_fight = currentTime
          e2.last_fight = currentTime
        }
        if (e1 instanceof Player && e2 instanceof Powerup) {
          e1.applyPowerup(e2)
          e2.destroyed = true
        }
        if (e1 instanceof Player && e2 instanceof Additional) {
          if(e2.type == "top" && throne){
            e1.king = 1
            throne = 0
            e1.time += this.deltaTime / 1000
            e1.position[0] = e2.position[0]
            e1.position[1] = e2.position[1]
          }
        }
        // Bullet-Bullet interaction
        
        if (e1 instanceof Bullet && e2 instanceof Bullet &&
          e1.source !== e2.source) {
          e1.destroyed = true
          e2.destroyed = true
        }

        // Bullet-Powerup interaction
        if (e1 instanceof Powerup && e2 instanceof Bullet ||
          e1 instanceof Bullet && e2 instanceof Powerup) {
          e1.destroyed = true
          e2.destroyed = true
        }
      }
    }

    /**
     * Filters out destroyed projectiles and powerups.
     */
    this.projectiles = this.projectiles.filter(
      projectile => !projectile.destroyed)
    this.powerups = this.powerups.filter(
      powerup => !powerup.destroyed)

    /**
     * Repopulate the world with new powerups.
     */
    while (this.powerups.length < Constants.POWERUP_MAX_COUNT) {
      this.powerups.push(Powerup.create())
    }
    const ps = [...this.players.values()]
    for(var i = 0; i < ps.length; i++){
      if (ps[i].socketID.includes("Bot")){
        this.updatePlayerOnInput(ps[i].socketID, AI(i, ps))
      }
    }
  }

  /**
   * Sends the state of the game to all connected players.
   */
  sendState() {
    let players = [...this.players.values()]
    players.sort((a, b) => { return b.time - a.time })
    this.clients.forEach((client, socketID) => {
      const currentPlayer = this.players.get(socketID)
      this.clients.get(socketID).emit(Constants.SOCKET_UPDATE, {
        finished: this.finished,
        winner: players[0].name,
        self: currentPlayer,
        players: players,
        projectiles: this.projectiles,
        powerups: this.powerups,
        additional: this.additional_objects
      })
    })
  }
}

module.exports = Game
