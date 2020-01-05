const fs = require('fs'),
	SHA256 = require('crypto-js/sha256');

module.exports = {
	PORT:4132,
	load:(path,bufferize)=>{
		return (bufferize ? fs.readFileSync(path) : fs.readFileSync(path).toString());
	},
	generateSecret:()=>{
		let time = (new Date).getTime().toString(),
			hash = SHA256(time).toString(),
			buf = new Buffer(hash);
		return buf;
	},
	parseParams:(p)=>{
		if (p !== undefined && p !== null && p !== '') {
			let a = p.split('&'),
				l = {};
			a.forEach((e, i, a) => {
				let t = e.split('=');
				l[t[0]] = decodeURIComponent(t[1].replace(/\+/g, ' '));
			});
			return l;
		} else {
			return {};
		}
    },
	readForm:(req,callback)=>{
		let body = '';
		req.on('data',(data)=>{
			body += data;
		});
		req.on('end',()=>{
			req.body = module.exports.parseParams(body);
			callback();
		});
	}
};
