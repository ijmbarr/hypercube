

var Hypermesh = function(N, svg, verticies, edges, scale) {
	this.svg = svg;
	this.nDimensions = N;
	this.nVerticies = Math.pow(2,N);
	this.verticies = verticies;
	this.edges = edges;
	this.scale = scale || 1;
				
	this.vertexSVG = svg.selectAll("circle")
		.data(this.verticies)
		.enter()
		.append("circle")
		.attr("r", 4)
		.attr("fill", "red")[0];
		
	this.edgeSVG = svg.selectAll("line")
		.data(this.edges)
		.enter()
		.append("line")
		.attr("stroke", "black")[0];
}

// Cleanup
Hypermesh.prototype.remove = function(){
	this.vertexSVG.map(function(v){v.remove();});
	this.edgeSVG.map(function(e){e.remove();});
}

// Projectors
Hypermesh.prototype.projectVector = function(vec){
	return [vec[0], vec[1]];
}

Hypermesh.prototype.getX = function(v){
	return this.scale * this.projectVector(v)[0];
}

Hypermesh.prototype.getY = function(v){
	return this.scale * this.projectVector(v)[1];
}

// Render/Rotate
Hypermesh.prototype.render = function(){
	var that = this;
	
	_.zip(that.verticies, that.vertexSVG).map(function(vertex){
			var vSVG = vertex[1];
			var v = vertex[0];
			vSVG.setAttribute("cx", that.getX(v));
			vSVG.setAttribute("cy", that.getY(v));
		});
		
	_.zip(that.edges, that.edgeSVG).map(function(edge){
			var e = edge[0];
			var eSVG = edge[1];
			var v1 = that.verticies[e[0]];
			var v2 = that.verticies[e[1]];
			eSVG.setAttribute("x1", that.getX(v1));
			eSVG.setAttribute("y1", that.getY(v1));
			eSVG.setAttribute("x2", that.getX(v2));
			eSVG.setAttribute("y2", that.getY(v2));
		});
}

Hypermesh.prototype.rotate = function(rm){
	this.verticies = math.multiply(this.verticies, rm).toArray();
}

// Predefined shapes
var Hypercube = function(N, svg, scale){
	var nVerticies = Math.pow(2,N);
	
	var verticies = _.range(nVerticies).map(function(n){ 
			return _.range(N).map(function(m){
				return Math.pow(-1, (n >> m) & 1);
			});
		});
						
	var edges = _.flatten(_.range(nVerticies).map(function(n){
			return _.range(n+1, nVerticies).map(function(m){return [n,m]; }); 
		}), true)
		.filter(function(pair){return hammingDist(pair[0], pair[1]) == 1;});
		
	return new Hypermesh(N, svg, verticies, edges, scale);
}

function hammingDist(x,y){
	var diff = 0;
	var xored = x ^ y;
	for(var i = 0; i < 32; i+=1){
		if( (xored >> i) & 1){
			diff += 1
		}
	}
	return diff;
}