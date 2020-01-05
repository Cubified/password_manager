// TODO: Add offline sync, different colorschemes
// TODO: Refactor, fix scoping issues (all util functions are in global scope, yikes)

if(localStorage && localStorage.getItem('beta')){
	location.href = '/beta';
}

let passman = {
	layout:{},
	util:{}
};

(function(){
require('./crypto-wrapper.js')(this);
require('./util.js')(this.util);
require('./manager.js')(this);
require('./layout.js')(this.layout);

let Manager				= this.Manager,
	d					= this.util.d,
	GeneratePassword	= this.util.GeneratePassword,
	SendUpdate			= this.util.SendUpdate,
	DefaultLayout		= this.layout.DefaultLayout,
	CardLayout			= this.layout.CardLayout,
	CryptoJS			= this.CryptoJS;

let manager = new Manager(d('websites'),d('foldersContainer'));
let currentLayout = DefaultLayout;
this.currentLayout = currentLayout;

require('./events.js')(d,GeneratePassword,SendUpdate,manager,this);

document.addEventListener('DOMContentLoaded',()=>{
	const enc = document.querySelector('#enc').innerHTML,
		json = JSON.parse(enc),
		dec = JSON.parse(CryptoJS.AES.decrypt(json.enc,json.time + json.salt.substr(5,15)).toString(CryptoJS.enc.Utf8));
	manager.parseJSON(dec);
	manager.render(currentLayout);
	document.body.removeChild(document.querySelector('#enc'));
});

document.querySelector('.navbar-burger').addEventListener('mousedown',()=>{
	let elem = document.querySelector('.navbar-burger');
	if(elem.className.indexOf('is-active') > -1){
		document.querySelector('.navbar-burger').classList.remove('is-active');
		document.querySelector('.navbar-menu').classList.remove('is-active');
	} else {
		document.querySelector('.navbar-burger').classList.add('is-active');
		document.querySelector('.navbar-menu').classList.add('is-active');
	}
});

[].forEach.call(document.querySelectorAll('.is-layout'),(e)=>{
	e.addEventListener('mousedown',()=>{
		switch(e.dataset.layout){
			case 'default':
				currentLayout = DefaultLayout;
				break;
			case 'card':
				currentLayout = CardLayout;
				break;
			case 'panel':
				currentLayout = PanelLayout;
				break;
		}
		this.currentLayout = currentLayout;
		manager.render(currentLayout);
		let elem = d('changeLayout').parentNode.parentNode;
		elem.classList.remove('is-active');
	});
});
}).call(passman);
