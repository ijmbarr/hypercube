

var Rotator = {
	singleRotationMatrix: function(d1, d2, n, angle){
		return math.eye(n).subset(math.index([d1,d2],[d1,d2]), [[Math.cos(angle), Math.sin(angle)], [-Math.sin(angle), Math.cos(angle)]])
	},
	
	fullRotationMatrix: function(n, angles){
		return _.reduce(angles, function(rm, a){
			return math.multiply(rm, Rotator.singleRotationMatrix(a.d1, a.d2, n, a.angle));
			}, math.eye(n));
	},
	
	getAllRandomAngles: function(n){
		return _.flatten(_.range(n).map(function(n){return _.range(n).map(function(m){return [n,m]; }); }), true)
				.map(function(a){return {d1: a[0], d2: a[1], angle: Rotator.mutateAngle(0)};});
	},

	mutateAngle: function(a){
		return a - 0.002*a + (math.random() - 0.5)*0.0005;
	},

	mutateAngles: function(angles){
		angles.forEach(function(a){a.angle = Rotator.mutateAngle(a.angle);});
	}
}