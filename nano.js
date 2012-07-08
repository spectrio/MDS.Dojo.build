var parser = require("./lib/parser").parser;
var fs = require("./lib/fs").fs;
var log = require("./lib/log").log('NANO', 1);

log('======================================================================================');

var incrementVersion = false;
var struct = null;
var deployFolderPrefix = 'deploy';
var deployFolder = deployFolderPrefix;


var args = process.argv;
if(args[2]){
	var file = args[2];
	if(!/\//.test(file)) file = './' + file;
	struct = require(file).struct;
	if(!struct){
		console.log("ERROR: Can't find structure. Did you provide a full path?");
		process.exit(1);
	}
}else{
	console.log('ERROR: First argument, structure, is required.');
	process.exit(1);
}
if(!!args[3]){
	if(typeof args[3] == 'boolean'){
		log('version it!', args[3]);
		incrementVersion = true;
	}else if(typeof args[3] == 'string'){
		log('root path provided: ', args[3]);
		struct.root = args[3];
		if(typeof args[4] == 'string'){
			log('dest path provided: ', args[4]);
			struct.dest = args[4];
		}
	}
}



var getFolderName = function(filename){
	return parser.getDeployFolderName(filename, deployFolderPrefix, incrementVersion);
}
var parseStruct = function(){
	parser.copyStructure(struct, root, dest);
}
var copyIndexFile = function(){
	log('copyIndexFile:', struct.indexSrc, struct.indexDst);
	fs.copy(struct.indexSrc, struct.indexDst);
}


if(fs.exists(struct.dest)){
	log('REMOVE:', struct.dest)
	fs.remove(struct.dest);
}

fs.mkdir(struct.dest);

if(struct.indexSrc) deployFolder = getFolderName(struct.indexSrc);
var root = struct.root;
var dest = struct.dest + deployFolder;
if(struct.indexSrc && struct.indexDst) copyIndexFile();

delete struct.root;
delete struct.dest;
delete struct.indexSrc;
delete struct.indexDst;
console.log('STRUCT', struct);

parseStruct();


console.log('vls nano complete.');
