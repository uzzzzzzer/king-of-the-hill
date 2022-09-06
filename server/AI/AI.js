function get_ai_action(index, players){
	var self = players[index].position
	var optimum = [1000000, 0, 0, 0, 0, 0]
	for(var i = 0; i < players.length; i++){
		if(i != index){
			var p = players[i].position
			var dist = Math.sqrt((p.x - self.x)*(p.x - self.x) + (p.y - self.y)*(p.y - self.y))
			var deg =(Math.atan((self.y-p.y)/(self.x-p.x))*180/Math.PI) + 180 * ((self.x-p.x)<0)
			if(dist < optimum[0]){
				optimum = [dist, deg / Math.PI, 1000 < self.y, 1000 > self.y, 1000 < self.x, 1000 > self.x]
			}
		}
	}
	data = {
		"turretAngle": optimum[1],
		"up": optimum[2] * (Math.random() > 0.5),
		"down": optimum[3] * (Math.random() > 0.5),
		"left": optimum[4] * (Math.random() > 0.5),
		"right": optimum[5] * (Math.random() > 0.5),
		"shoot": true
	}
	return data
	
	
}
module.exports = get_ai_action
