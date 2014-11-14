exports.find_buildings_by_id = function(id, buildings) {
	for(var i in buildings) {
		var b = buildings[i];
		if(b.id == id) {
			return b;
		}
	}
	return null;
};

exports.find_buildings_index_by_id = function(id, buildings) {
	for(var i in buildings) {
		var b = buildings[i];
		if(b.id == id) {
			return i;
		}
	}
	return -1;
};