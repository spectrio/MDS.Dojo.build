var fht = require('./throttle').throttle;
var filesystem = require("fs");
var folder= require("path");
var util = require('util');
var log = require("./log").log('FS', 0);

var ignoreFiles = ['.git', '.gitignore', '.svn', '.DS_Store'];
var fs = {

	stat: function(path){
		return filesystem.statSync(path);
	},

	exists: function(path){
		//	summary:
		//		Determines if a file or folder exists.
		//
		return folder.existsSync(path);
	},

	getFolder: function(path){
		//	summary:
		//		Get the path from a filename.
		//
		return path.substring(0, path.lastIndexOf('/'))
	},

	getFilename: function(path){
		//	summary:
		//		Get the filename from a path.
		//
		return path.substr(path.lastIndexOf('/')+1);
	},

	copyFile: function(src, dst, cb){
		//	summary:
		//		Copy a file (not a folder) from source path destination path.
		//		NOTE: async only.
		//

		if(ignoreFiles.indexOf(this.getFilename(src)) > -1){ log('       blocked:', src); return}

		log('copyFile - ', this.getFilename(src));

		try{
			if(fs.exists(dst)){
				filesystem.unlinkSync(dst);
			}else{
				var dir = fs.getFolder(dst);
				if(!fs.exists(dir)){
					fs.mkdir(dir);
				}
			}
		}catch(e){ console.error('failed to find paths for copyFile'); }

		try{
			var from = filesystem.createReadStream(src);
			var to   = filesystem.createWriteStream(dst);
			util.pump(from, to, function(noArgs){
				if(cb) cb();
			});
		}catch(e){ console.error('failed to copy file for copyFile'); }
	},

	copyFolder: function(src, dst){
		//	summary:
		//		Copy a folder. If the path does not exist, a folder is created,
		//		and then the files are copied.
		//
		// TODO! Does not copy folder within folders!
		//
		this.mkdir(dst);
		log('copyFolder - ', src);
		//log('copyFolder - files to copy:', filesystem.readdirSync(src));

		filesystem.readdirSync(src).forEach(function(name){
			log('    copyFolder file - ', name);
			var to = dst + '/' + name;
			this.copy(src+'/'+name, to);
		}, this);
	},

	isFile: function(path){
		// summary:
		// 		Determine if path is a file by having an extension
		// 		NOTE: This is a quick test; a better check is to use isFolder.
		return /\.\w{2,}$/.test(path);
	},

	isFolder: function(path){
		// summary:
		// 		Determine if path is a folder or file (not folder)
		if(/\.\w{2,}$/.test(path)) return false;
		try{
			filesystem.readdirSync(path);
			return true;
		}catch(e){}
		return false;
	},

	copy: function(src, dst){
		//	summary:
		//		Generic copy method. Detrmines if a file or a folder, then
		//		calls that method.
		//
		// TODO! Check resource type with stats, to avoid problems with files
		// without extensions
		//
		log('copy - ', src, 'isFolder:', this.isFolder(src));
		if(this.isFolder(src)){
			fs.copyFolder(src, dst);
		}else{
			fs.copyFile(src, dst);
		}
	},

	remove: function(path, i){
		//	summary:
		//		Recursively removes a folders and files.
		//
		 i = i || '';
		log(i+'remove', path);
		if(!this.exists(path)) return;
		if(this.isFolder(path)){
			log(i+'    remove folder', path);
			filesystem.readdirSync(path).forEach(function(name){
				var pathname = path.charAt(path.length-1) == '/' ? path + name : path + '/' + name;
				log(i+'         remove sub', pathname);
				this.remove(pathname, i+'    ');
			}, this);
			filesystem.rmdirSync(path);
		}else{
			log(i+'    remove file');
			filesystem.unlinkSync(path);
		}

	},

	mkdir: function(foldername){
		//	summary:
		//		Makes a folder from a path. Checks existance.
		//
		var mk = function(nm){
			var exists = fs.exists(nm);
			if(!exists) filesystem.mkdirSync(nm);
		}
		var paths;
		if(/\//.test(foldername)){
			paths = foldername.split('/');
		}else{
			paths = [foldername];
		}

		var p = [];
		paths.forEach(function(nm){
			p.push(nm);
			mk(p.join('/'));
		});
	},

	readFile: function(filename, cb) {
		//	summary:
		//		Read in a text file and return its contents as a string. cb is
		//		an optional callback - if passed the file is read asynchronously,
		//		else it is read synchronously.
		//		NOTE: if something other than text or UTF8 is needed, you should
		//		call filesystem.readFile directly.
		//
		if(cb){
			// async
			fht.enqueue(function(){
				filesystem.readFile(filename, 'utf8', function(code){
					fht.release();
					cb.apply(null, arguments);
				});
			});
			return null;
		}else{
			// sync
			return filesystem.readFileSync(filename, 'utf8');
		}
	},

	writeFile: function(filename, str, cb) {
		//	summary:
		//		Write text to a file. cb is an optional callback - if passed
		//		the file is written asynchronously, else it is read synchronously.
		//		NOTE: if something other than text or UTF8 is needed, you should
		//		call filesystem.writeFile directly.
		//
		if(cb){
			// async
			fht.enqueue(function(){
				filesystem.writeFile(filename, str, 'utf8', function(code){
					fht.release();
					cb.apply(null, arguments);
				});
			});
		}else{
			// sync
			filesystem.writeFileSync(filename, str, 'utf8');
		}
	}
};

exports.fs = fs;
