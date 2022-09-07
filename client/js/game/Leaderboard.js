/**
 * This class handles the rendering and updating of the leaderboard.
 * @author Zloy Negr
 */

/**
 * Leaderboard class.
 */
class Leaderboard {
  /**
   * Constructor for the Leaderboard class.
   * @param {container} container The container element for the leaderboard
   */
  constructor(container) {
    this.container = container
  }

  /**
   * Factory method for creating a Leaderboard object.
   * @param {string} containerElementID The ID of the container element
   * @return {Leaderboard}
   */
  static create(containerElementID) {
    return new Leaderboard(document.getElementById(containerElementID))
  }

  /**
   * Updates the leaderboard with the list of current players.
   * @param {Array<Player>} players The list of current players
   */
  update(players) {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild)
    }
    players.sort((a, b) => { return b.time - a.time })
    players.slice(0, 10).forEach(player => {
      const containercontainer = document.createElement('li')
      //const text =
      //  `${player.name} - Kills: ${player.kills} Deaths: ${player.deaths}`
      const text = `${player.name} - Time on the throne: ${Math.floor(player.time)}
      ${'👑'.repeat(player.king)}  ${'🍅'.repeat(player.tomato)} ${'⚔'.repeat(player.fight)}`
      containercontainer.appendChild(document.createTextNode(text))
      this.container.appendChild(containercontainer)
    })
  }
}

module.exports = Leaderboard
