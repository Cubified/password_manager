/*
 * REQUIRES
 */

const express = require('express'),
	sessions = require('client-sessions'),
	pug = require('pug');

/*
 * LOCAL REQUIRES
 */

const util = require('./app/server/util.js'),
	db = require('./app/server/database.js'),
	manager = require('./app/server/password_manager.js');

/*
 * GLOBAL VARIALES
 */

let app = express();

/*
 * MIDDLEWARE
 */

app.use(sessions({
	cookieName:'session',
	secret:util.generateSecret(),
	duration:24*60*60*1000,
	activeDuration:1000*60*5
}));

/*
 * ROUTES
 */

app.get('/',(req,res)=>{
	if(req.session.auth){
		manager.GetWebsites(req.session.username,(json)=>{
			res.send(pug.renderFile('./app/client/pug/app.pug',{
				websites:JSON.stringify(json)
			}));
		});
	} else {
		res.send(pug.renderFile('./app/client/pug/index.pug'));
	}
});
app.get('/app.html',(req,res)=>{
	if(req.session.auth){
		manager.GetWebsites(req.session.username,(json)=>{
			res.send(pug.renderFile('./app/client/pug/app.pug',{
				websites:JSON.stringify(json)
			}));
		});
	} else {
		res.send(pug.renderFile('./app/client/pug/index.pug'));
	}
});
app.get('/login',(req,res)=>{
	res.send(pug.renderFile('./app/client/pug/login.pug'));
});
app.get('/signup',(req,res)=>{
	res.send(pug.renderFile('./app/client/pug/signup.pug'));
});
app.get('/settings',(req,res)=>{
	if(req.session.auth){
		res.send(pug.renderFile('./app/client/pug/settings.pug',{username:req.session.username}));
	} else {
		res.redirect('/');
	}
});
app.get('/logout',(req,res)=>{
	req.session.auth = false;
	req.session.username = '';
	res.redirect('/');
});
app.get('/beta',(req,res)=>{
	if(req.session.auth){
		manager.GetWebsites(req.session.username,(json)=>{
			res.send(pug.renderFile('./app/client/beta/app.pug',{
				websites:JSON.stringify(json)
			}));
		});
	} else {
		res.send(pug.renderFile('./app/client/pug/index.pug'));
	}
});

app.get('/css/bulma.css',(req,res)=>{
	res.set('Content-Type','text/css');
	res.send(util.load('./app/client/css/bulma.css'));
});

app.get('/js/app.min.js',(req,res)=>{
	res.send(util.load('./app/client/js/dist/app.min.js'));
});
app.get('/js/beta.min.js',(req,res)=>{
	res.send(util.load('./app/client/beta/app.min.js'));
});
app.get('/js/login.min.js',(req,res)=>{
	res.send(util.load('./app/client/js/dist/login.min.js'));
});
app.get('/js/signup.min.js',(req,res)=>{
	res.send(util.load('./app/client/js/dist/signup.min.js'));
});
app.get('/js/settings.min.js',(req,res)=>{
	res.send(util.load('./app/client/js/dist/settings.min.js'));
});

app.post('/login',(req,res)=>{
	util.readForm(req,()=>{
		db.CheckLogin(req.body.username,req.body.password,(success)=>{
			if(success){
				req.session.auth = true;
				req.session.username = req.body.username;
			} else {
				req.session.auth = false;
				req.session.username = '';
			}
			res.redirect('/');
		});
	});
});
app.post('/signup',(req,res)=>{
	util.readForm(req,()=>{
		db.CreateUser(req.body.username,req.body.password,(err,resp)=>{
			if(err || !resp.ok){
				req.session.auth = false;
				req.session.username = '';
				res.redirect('/signup');
			} else {
				req.session.auth = true;
				req.session.username = req.body.username;
				res.redirect('/');
			}
		});
	});
});
app.post('/usernametaken',(req,res)=>{
	util.readForm(req,()=>{
		db.IsUsernameTaken(req.body.username,(taken)=>{
			res.send(taken);
		});
	});
});
app.post('/checklogin',(req,res)=>{
	util.readForm(req,()=>{
		db.CheckLogin(req.body.username,req.body.password,(success)=>{
			res.send(success);
		});
	});
});
app.post('/deleteaccount',(req,res)=>{
	util.readForm(req,()=>{
		db.DeleteUser(req.body.username);
		res.send('true');
	});
});
app.post('/updateusername',(req,res)=>{
	util.readForm(req,()=>{
		db.UpdateUsername(req.body.oldUsername,req.body.newUsername,(success)=>{
			if(success){
				req.session.username = req.body.newUsername;
			}
			res.send(success);
		});
	});
});
app.post('/changepassword',(req,res)=>{
	util.readForm(req,()=>{
		db.CheckLogin(req.body.username,req.body.password,(success)=>{
			if(success){
				db.UpdatePassword(req.body.username,req.body.newPassword,(ok)=>{
					res.send(ok);
				});
			} else {
				res.send('bad-login');
			}
		});
	});
});
manager.Routes(app);

/*
 * LISTENING ON PORT
 */

app.listen(util.PORT,()=>{
	console.log(`Listening on port ${util.PORT}`);
});
