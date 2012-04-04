var figue = require('./lib/figue').figue;


var ClusterTree = function() {
	this.root = null;
	this.users = [];
	this.userClusterMap = {};
	this.clusters = [];
}

ClusterTree.prototype = {
	add: function(id, lat, lon) {
		this.users.push({
			"id":id,
			"latitude":lat,
			"longitude":lon
		});
		if(this.users.length > 1)
			this.cluster();
	},
	remove: function(index) {
		users.slice(index,1);
		this.cluster();
	},
	cluster: function(){
		var labels = new Array ;
		var vectors = new Array ;
		for(var i in this.users) {
			labels[i] = this.users[i].id;
			vectors[i] = [this.users[i].latitude, this.users[i].longitude];
		}
		this.root = figue.agglomerate(labels, vectors, figue.GEO_DISTANCE, figue.SINGLE_LINKAGE);

		this.clusters = [];
		this.clusters.push(this.traverse(this.root, this.root.dist));

		// Update map
		this.userClusterMap = {};
		for(var i in this.clusters)
			for(var j in this.clusters[i])
				this.userClusterMap[this.clusters[i][j]] = i;
	},
	traverse: function(node, parent_distance) {
		if(node.depth > 0){
			var cluster = [];
			// Traverser de dypeste først
			if(node.left.depth > node.right.depth) {
				cluster = cluster.concat(this.traverse(node.left, node.dist));
				cluster = cluster.concat(this.traverse(node.right, node.dist));
			} else {
				cluster = cluster.concat(this.traverse(node.right, node.dist));
				cluster = cluster.concat(this.traverse(node.left, node.dist));
			}
			// Hvis avstand er mindre enn halvparten av avstanden til "parent klynga" og klynga er stor nok ..
			if(node.dist * 2 < parent_distance && cluster.length > 1) {
				// .. så skal dette bli en egen klynge
				this.clusters.push(cluster);

				return [];
			} else {
				// .. eller så skal dette bli en del av parent-klynga.
				return cluster;
			}
		} else {
			// Hvis dette er en løvnode returner labelet som legges til i klynga..
			return [node.label];
		}
	},
	getCluster: function(id) {
		return this.clusters[this.userClusterMap[id]];
	},
	toString: function() {
		return this.root.buildDendogram(5, true, true, true, true);
	}
};

exports.ClusterTree = ClusterTree;