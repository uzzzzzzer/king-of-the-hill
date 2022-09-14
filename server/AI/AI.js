const Constants = require('../../lib/Constants')

function get_ai_action(index, players){
	var self = players[index].position
	var optimum = [1000000, 0, 0, 0, 0, 0]
	var may_move = !players[index].in_castle || players[index].army >= (index % 10) * 100 ||Math.random() < 1/500
	for(var i = 0; i < players.length; i++){
		if(i != index){
			var p = players[i].position
			var dist = Math.sqrt((p.x - self.x)*(p.x - self.x) + (p.y - self.y)*(p.y - self.y))
			var deg =(Math.atan((self.y-p.y)/(self.x-p.x))*180/Math.PI) + 180 * ((self.x-p.x)<0) + 180
			var eps = 2
			if(dist < optimum[0]){
				optimum = [dist, deg * Math.PI / 180, Constants.WORLD_MAX/2 + eps < self.y,
					   Constants.WORLD_MAX/2 - eps > self.y, Constants.WORLD_MAX/2 + eps < self.x,
					   Constants.WORLD_MAX/2 - eps > self.x]
			}
		}
	}
	var r = Math.random()
	data = {
		"turretAngle": optimum[1],
		"up": optimum[2] * (r > 0.5) * may_move,
		"down": optimum[3] * (r > 0.5) * may_move,
		"left": optimum[4] * (r < 0.5) * may_move,
		"right": optimum[5] * (r < 0.5) * may_move,
		"shoot": true
	}
	return data
	
	
}
module.exports = get_ai_action
