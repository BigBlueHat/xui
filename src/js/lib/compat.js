/**
 * Array indexOf - from MooTools (MIT Licensed)
 */
Array.prototype.indexOf = function(item, from){
	var len = this.length;
	for (var i = (from < 0) ? Math.max(0, len + from) : from || 0; i < len; i++){
		if (this[i] === item) return i;
	}
	return -1;
}