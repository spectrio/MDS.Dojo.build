exports.struct = {

	// paths should be relative to the nano folder
	//
	// root: path to source directory
	root:'./tests/copyme',
	// dest: path to destination directory
	dest: './tests/',
	// indexSrc: path to source file to use as production index file
	indexSrc:'dev.html',
	// indexDst: Destination and name of production index file
	indexDst:'prod.html',

	// If true, deletes destination directory before copying files
	clean:false,

	// file move and/or rename locations:
	move:{
		'dev-nocopy/layer.js':'prod.js'
	},


	// file-copy locations:
	files:{
		css:[
			'app.css',
			'dojo.css',
			'main.css'
		],
		fldr:[

		],
		img:[
			'clear-pixel.gif',
			'more',
			{
				resources:[
					'blank.gif'
				]
			}
		]
	}
};
