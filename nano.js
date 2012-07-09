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
	if(!filename) return '';
	var fldr =  parser.getDeployFolderName(filename, deployFolderPrefix, incrementVersion);
	log(' FLDR:', fldr, struct.dest)
	if(struct.dest.indexOf(fldr) > -1 ) return '';
	return fldr;
}
var parseStruct = function(){
	parser.copyStructure(struct, root, dest);
}

var srcIndex = function(){
	if(struct.indexSrc[0] == '.' || struct.indexSrc[0] == '/'){
		// abs path
		return struct.indexSrc;
	}
	return (root || struct.root) + '/' + struct.indexSrc;
}
var dstIndex = function(){
	if(struct.indexDst[0] == '.' || struct.indexDst[0] == '/'){
		// abs path
		return struct.indexDst;
	}
	return dest + '/' + struct.indexDst;
}
var copyIndexFile = function(){
	var src = srcIndex();
	var dst = dstIndex();
	log('copyIndexFile:', src, dst);
	fs.copy(src, dst);
}


if(struct.clean && fs.exists(struct.dest)){
	log('REMOVE:', struct.dest)
	fs.remove(struct.dest);
}

fs.mkdir(struct.dest);

deployFolder = getFolderName(srcIndex());
var root = struct.root;
var dest = struct.dest + deployFolder;
if(struct.indexSrc && struct.indexDst) copyIndexFile();

console.log('STRUCT', struct);

parseStruct();


console.log('vls nano complete.');
