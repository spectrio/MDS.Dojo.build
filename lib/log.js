exports.log =  function(name, enabled){
	if(enabled === false || enabled === 0) return function(){};
	return function(){
		var args = Array.prototype.slice.call(arguments);
		args.unshift(" ["+name+"] ");
		console.log.apply(console, args);
	};
};
