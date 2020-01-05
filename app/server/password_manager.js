/*
 * The following is (slightly) outdated:
 * - Encryption (for storage)
 *   - AES encrypted
 *     - STRING: Stringified JSON in the form {website:"name",username:"username",password:"password",info:"info"}
 *     - KEY:    Hash of user password + date of creation + random salt
 * - Storage in database
 *   - AES encrypted string is stored under user's "passwords" array in the form {id:"35-char randomly generated string",enc:"encrypted string",salt:"generated salt"}
 * - Messaging between client and server
 *   - Client sends AJAX request containing necessary information
 *     - Website ID
 *     - Time of action taken (seconds since UNIX epoch)
 *     - Action to take (delete, update, add new)
 *     - If adding a new site, a 30-character, randomly generated string must also be included
 *     - In the case of adding a new site, the user must also send stringified JSON of the website data
 *       - Encrypted using AES with the key being the time string and the characters 5-15 of the randomly generated string
 *         - This is to allow for secure transfer (not storage), as the string will be decrypted and re-encrypted using the aforementioned string
 */

const CryptoJS = require('crypto-js');

const util = require('./util.js'),
	db = require('./database.js');

function Routes(app){
	app.post('/update',(req,res)=>{
		if(req.session.auth){
			util.readForm(req,()=>{
				db.FindUser(req.session.username,(err,doc)=>{
					const time = req.body.time,
						fullKey = req.body.key,
						key = fullKey.substr(5,15),
						enc = decodeURIComponent(req.body.enc);
					let dec = CryptoJS.AES.decrypt(enc,time + key).toString(CryptoJS.enc.Utf8),
						reenc = CryptoJS.AES.encrypt(dec,doc.password + time + key).toString();
					doc.passwords = {
						enc:reenc,
						time:time,
						salt:fullKey
					};
					db.put(doc,(err,resp)=>{
						if(err){
							throw err;
						}
						res.send(resp.ok);
					});
				});
			});
		}
	});
}

function GetWebsites(username,callback){
	db.FindUser(username,(err,doc)=>{
		if(err){
			callback('error');
			throw err;
		} else {
			let json = doc.passwords,
				dec = CryptoJS.AES.decrypt(json.enc,doc.password + json.time + json.salt.substr(5,15)).toString(CryptoJS.enc.Utf8);
			const newTime = (new Date).getTime(),
				newSalt = db.GenerateSalt();
			let reenc = CryptoJS.AES.encrypt(dec,newTime + newSalt.substr(5,15)).toString()
			callback({
				time:newTime,
				salt:newSalt,
				enc:reenc
			});
		}
	});
}

module.exports = {
	GetWebsites:GetWebsites,
	Routes:Routes
};
