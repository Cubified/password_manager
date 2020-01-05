const CryptoJS = require('crypto-js');
module.exports=(function(scope){
function generateID(){
	let a='abcdefghijklmnopqrstuvwxyz0123456789'.split(''),
		o='';
	for(let i=0;i<30;i++){
		o += a[Math.floor(Math.random() * a.length)];
	}
	return o;
}

function GeneratePassword(){
	let a='abcdefghijklmnopqrstuvwxyz~\\|!@#$%^&*()_+=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456790[]{};:'.split(''),
		o='';
	for(let i=0;i<30;i++){
		o += a[Math.floor(Math.random() * a.length)];
	}
	return o;
}

function SendRequest(url,method,params,callback){
	let xhr = new XMLHttpRequest();
	xhr.addEventListener('load',()=>{callback(xhr.responseText)});
	xhr.open(method,url);
	if(method === 'POST'){
		xhr.send(params);
	} else {
		xhr.send();
	}
}

function SendUpdate(manager,callback){
	const time = (new Date).getTime(),
		str = generateID();
	let enc = CryptoJS.AES.encrypt(JSON.stringify(manager.generateJSON()),time + str.substr(5,15)).toString();
	SendRequest('/update','POST',`time=${time}&key=${str}&enc=${encodeURIComponent(enc)}`,callback);
}

function d(i){
	return document.getElementById(i);
}

scope.generateID		= generateID;
scope.GeneratePassword	= GeneratePassword;
scope.SendUpdate		= SendUpdate;
scope.d					= d;
});
