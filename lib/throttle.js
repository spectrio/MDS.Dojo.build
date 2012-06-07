var
	count= 0,
	max= 10,
	queue= [];

exports.throttle = {
	// summary:
	// 		Utility object to assit with async file reads and writes
	// 		
	release: function(){
		if(queue.length){
			(queue.shift())();
		}else{
			count--;
		}
	},
	enqueue: function(proc){
		if(count<max){
			count++;
			proc();
		}else{
			queue.push(proc);
		}
	}
};
