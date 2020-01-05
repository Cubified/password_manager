/*
 * REQUIRES
 */

const PouchDB = require('pouchdb'),
	CryptoJS = require('crypto-js'),
	csprng = require('csprng');

/*
 * GLOBAL VARIABLES
 */

let db = new PouchDB('http://localhost:5984/login-system');

/*
 * FUNCTIONS
 */

function GenerateSalt(){
	return csprng(160,36);
}

function HashPassword(password,salt){
	return (salt + CryptoJS.PBKDF2(password,salt,{
		iterations:1000,
		keySize:128
	}).toString());
}

function GenerateUser(username,password){
	let salt = GenerateSalt(),
		hash = HashPassword(password,salt);

	let tempTime = (new Date).getTime(),
		tempSalt = GenerateSalt(),
		tempJSON = {
			name:'Main Folder',
			sites:[],
			subfolders:[],
			id:GenerateSalt(),
			isParent:true
		};

	return {
		_id:username,
		username:username,
		password:hash,
		salt:salt,
		passwords:{
			time:tempTime,
			salt:tempSalt,
			enc:CryptoJS.AES.encrypt(JSON.stringify(tempJSON),hash + tempTime + tempSalt.substr(5,15)).toString()
		}
	};
}

function FindUser(username,callback){
	db.get(username,callback);
}

function IsUsernameTaken(username,callback){
	FindUser(username,(err,doc)=>{
		if(err || doc === undefined){
			callback(false);
		} else {
			callback(true);
		}
	});
}

function CreateUser(username,password,callback){
	IsUsernameTaken(username,(taken)=>{
		if(taken){
			callback('username-taken');
		} else {
			let json = GenerateUser(username,password);

			db.put(json,callback);
		}
	});
}


function DeleteUser(username){
	FindUser(username,(err,doc)=>{
		if(err){
			throw err;
		} else {
			db.remove(doc);
		}
	});
}


// 1/29/2018 this is completely broken but I don't care
// 			 enough to fix it
function UpdateUsername(username,newUsername,callback){
	FindUser(username,(err,doc)=>{
		if(err){
			throw err;
		} else {
			IsUsernameTaken(newUsername,(taken)=>{
				if(taken){
					callback(false);
				} else {
					doc._id = newUsername;
					doc._rev = `1-${(new Date).getTime()}`;
					doc.username = newUsername;
					db.put(doc,(err,resp)=>{
						console.log(err);
						console.log(resp);
						if(err){
							throw err;
						} else {
							callback(resp.ok);
						}
					});
					DeleteUser(username);
				}
			});
		}
	});
}

function UpdatePassword(username,newPassword,callback){
	FindUser(username,(err,doc)=>{
		if(err){
			throw err;
		} else {
			let salt = GenerateSalt(),
				hashedPass = HashPassword(newPassword,salt);
			doc.salt = salt;
			doc.password = hashedPass;
			db.put(doc,(err,resp)=>{
				if(err){
					throw err;
				} else {
					callback(resp.ok);
				}
			});
		}
	});
}

function CheckLogin(username,password,callback){
	FindUser(username,(err,doc)=>{
		if(err || doc === undefined){
			callback(false);
		} else {
			let hashedPass = HashPassword(password,doc.salt);
			callback(doc.password === hashedPass);
		}
	});
}

function Put(doc,callback){
	db.put(doc,callback);
}

module.exports = {
	CheckLogin:CheckLogin,
	CreateUser:CreateUser,
	DeleteUser:DeleteUser,
	UpdateUsername:UpdateUsername,
	UpdatePassword:UpdatePassword,
	IsUsernameTaken:IsUsernameTaken,
	FindUser:FindUser,
	GenerateSalt:GenerateSalt,
	put:Put
}
