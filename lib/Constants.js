/**
 * This class stores global constants between the client and server.
 * @author Zloy Negr
 */

module.exports = {
  PLAYERS_IN_ROOM: 4,
  
  WORLD_MIN: 0,
  WORLD_MAX: 2000,
  WORLD_PADDING: 50,

  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,

  DRAWING_NAME_FONT: '14px Helvetica',
  DRAWING_NAME_COLOR: 'black',
  DRAWING_HP_COLOR: 'green',
  DRAWING_HP_MISSING_COLOR: 'red',
  DRAWING_IMG_OTHER_CASTLE: 'other_castle',
  DRAWING_IMG_SELF_CASTLE: 'self_castle',
  DRAWING_IMG_BASE_PATH: '/client/img',
  DRAWING_IMG_SELF_KING: 'self_king',
  DRAWING_IMG_SELF_TURRET: 'self_turret',
  DRAWING_IMG_OTHER_KING: 'other_king',
  DRAWING_IMG_OTHER_TURRET: 'other_turret',
  DRAWING_IMG_SHIELD: 'shield',
  DRAWING_IMG_BULLET: 'tomato',
  DRAWING_IMG_TILE: 'tile',
  DRAWING_IMG_HILL: 'hill',
  DRAWING_IMG_TOP: 'top',
  DRAWING_IMG_KEYS: [
    'self_king', 'other_king', 'self_castle', 'other_castle', 'shield',
    'tomato', 'tile', 'hill', 'top'
  ],
  DRAWING_TILE_SIZE: 100,

  VIEWPORT_STICKINESS: 0.004,

  SOCKET_UPDATE: 'update',
  SOCKET_NEW_PLAYER: 'new-player',
  SOCKET_PLAYER_ACTION: 'player-action',
  SOCKET_CHAT_CLIENT_SERVER: 'chat-client-to-server',
  SOCKET_CHAT_SERVER_CLIENT: 'chat-server-to-client',
  SOCKET_DISCONNECT: 'disconnect',

  PLAYER_TURN_RATE: 0.005,
  PLAYER_DEFAULT_SPEED: 0.08,
  PLAYER_SHOT_COOLDOWN: 5000,
  PLAYER_DEFAULT_HITBOX_SIZE: 20,
  PLAYER_SHIELD_HITBOX_SIZE: 45,
  PLAYER_MAX_HEALTH: 10,
  PLAYER_DAMAGE: 0.0001,
  
  MAX_BOTS: 10,
  
  TOMATO_TIME: 1000,
  FIGHT_TIME: 1000,
  
  CASTLE_DEFAULT_HITBOX_SIZE: 50,
  CASTLE_POWER: 1,
  CASTLE_RECRUITS: 0.1,

  BULLET_DEFAULT_DAMAGE: 0,
  BULLET_SPEED: 1.2 / 2,
  BULLET_MAX_TRAVEL_DISTANCE_SQ: 60 * 60,
  BULLET_HITBOX_SIZE: 10,

  POWERUP_HITBOX_SIZE: 5,
  POWERUP_MAX_COUNT: 0,
  POWERUP_MIN_DURATION: 5000,
  POWERUP_MAX_DURATION: 15000,
  POWERUP_HEALTHPACK: 'healthpack',
  POWERUP_SHOTGUN: 'shotgun',
  POWERUP_RAPIDFIRE: 'rapidfire',
  POWERUP_SPEEDBOOST: 'speedboost',
  POWERUP_SHIELD: 'shield',
  POWERUP_KEYS: [
    'healthpack',
    'shotgun',
    'rapidfire',
    'speedboost',
    'shield'
  ],
  POWERUP_DATA: {
    healthpack: { MIN: 1, MAX: 4 },
    shotgun: { MIN: 1, MAX: 2 },
    rapidfire: { MIN: 2, MAX: 4 },
    speedboost: { MIN: 1.2, MAX: 1.8 },
    shield: { MIN: 1, MAX: 4 }
  }
}
