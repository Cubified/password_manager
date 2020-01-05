let manager = {};

require('./util.js')(manager);

(function(){
let generateID	= manager.generateID,
	d			= manager.d;

class Folder {
	constructor(name,listener,isParent){
		this.name = name;
		this.sites = [];
		this.subfolders = [];
		this.id = generateID();
		this.listener = listener;
		this.isParent = isParent || false;
	}
	get folderName(){
		return this.name;
	}

	changeName(name){
		this.name = name;
	}
	addSite(website,override){
		if(!override){
			website.folder = this;
		}
		this.sites.push(website);
	}
	addFolder(folder){
		this.subfolders.push(folder);
	}
	removeSite(website){
		let ind = -1;
		this.sites.forEach((e,i)=>{
			if(e.id === website.id){
				ind = i;
			}
		});
		if(ind > -1){
			this.sites.splice(ind,1);
		}
	}

	generateHTML(){
		let ul = document.createElement('ul'),
			self = this;
		ul.classList.add('menu-list');
		this.subfolders.forEach((e)=>{
			let p = document.createElement('p');
			p.innerText = e.name;
			p.classList.add('menu-label');
			ul.appendChild(p);
			ul.appendChild(e.generateHTML());
		});
		if(this.subfolders.length && this.isParent){
			let hr = document.createElement('hr');
			ul.appendChild(hr);
		}

		if(this.isParent){
			let p = document.createElement('p');
			p.classList.add('menu-label');
			p.innerText = this.name;
			ul.appendChild(p);
		}
		this.sites.forEach((e)=>{
			let li = e.generateHTML();
			li.addEventListener('mousedown',()=>{
				self.listener(e);
			});
			ul.appendChild(li);
		});
		return ul;
	}

	collapse(){
		let folderCopy = new Folder(this.name,this.listener,this.isParent);
		this.sites.forEach((e)=>{
			let websiteCopy = e.duplicate(folderCopy);
			websiteCopy.folder = folderCopy.id;
			folderCopy.addSite(websiteCopy,true);
		});
		this.subfolders.forEach((e)=>{
			let subfolderCopy = new Folder(e.name,e.listener,e.isParent);
			e.sites.forEach((e)=>{
				let websiteCopy = e.duplicate(subfolderCopy);
				websiteCopy.folder = subfolderCopy.id;
				subfolderCopy.addSite(websiteCopy,true);
			});
			folderCopy.addFolder(subfolderCopy);
		});
		return folderCopy;
	}
}

class Website {
	constructor(data, folder) {
		this.data = data;
		this.folder = folder || -1;
		this.id = generateID();
	}

	get name(){
		return this.data.website;
	}
	get username(){
		return this.data.username;
	}
	get password(){
		return this.data.password;
	}
	get info(){
		return this.data.info;
	}

	changeWebsite(website){
		this.data.website = website;
	}
	changeUsername(username){
		this.data.username = username;
	}
	changePassword(password){
		this.data.password = password;
	}
	changeInfo(info){
		this.data.info = info;
	}

	generateHTML(){
		let li = document.createElement('li');
		li.innerText = this.data.website;
		return li;
	}

	duplicate(folderCopy){
		let dataCopy = {
			website:this.data.website,
			username:this.data.username,
			password:this.data.password,
			info:this.data.info
		};
		let site = new Website(dataCopy,folderCopy);
		return site;
	}
}

class Manager {
	constructor(parentElem,dropdownElem){
		this.selectedWebsite = '';
		this.mainFolder = new Folder('Main Folder',(e)=>{
			this.updateSelected(e,this);
		},true);
		this.parent = parentElem;
		this.dropdown = dropdownElem;
		this.selectedFolder = this.mainFolder;
		this.elems = {
			websiteName:d('websiteName'),
			websiteUsername:d('websiteUsername'),
			websitePassword:d('websitePassword'),
			websiteInfo:d('websiteInfo'),
			folderName:d('folderName'),
			folderDropdown:document.querySelector('.dropdown.wide:not(.layout-container) > .dropdown-trigger > button > span'),
			updateSite:d('updateSite'),
			deleteSite:d('deleteSite'),
			generatePassword:d('generatePassword')
		};
	}
	updateSelected(website,self){
		this.elems.websiteName.value		= website.name;
		this.elems.websiteUsername.value	= website.username;
		this.elems.websitePassword.value	= website.password;
		this.elems.websiteInfo.value		= website.info;
		this.elems.folderDropdown.innerText	= website.folder.name;
		this.elems.folderName.value			= website.folder.name;
		this.elems.updateSite.disabled		= false;
		this.elems.deleteSite.disabled		= false;
		this.elems.generatePassword.disabled=!(this.elems.websitePassword.value.trim()==='');

		self.selectedFolder = website.folder;
		self.selectedWebsite = website;

		// I have to do this due to the stringification replacing folder references with ids to prevent circular references
		if(!self.selectedWebsite.folder instanceof Folder){
			self.selectedWebsite.folder = self.findFolderById(self.selectedWebsite.folder);
		}
	}
	createSite(){
		let site = new Website({
			website	: this.elems.websiteName.value,
			username: this.elems.websiteUsername.value,
			password: this.elems.websitePassword.value,
			info	: this.elems.websiteInfo.value
		},this.mainFolder),
			self = this;
		this.selectedFolder.addSite(site);
		this.updateSelected(site,self);
		return site;
	}
	addSubfolder(name){
		let self = this;
		let folder = new Folder(name,(website)=>{
			this.updateSelected(website,self);
		});
		this.mainFolder.addFolder(folder);
	}
	removeSubfolder(name){
		let ind = this.findFolderIndex(name);
		if(ind !== -1){
			this.mainFolder.subfolders.splice(ind,1);
		} else {
			return false;
		}
		return true;
	}
	moveToSubfolder(site,folder){
		// This (probably) isn't needed anymore, I'm a little afraid of removing it though
		if(!site.folder instanceof Folder){
			this.findFolderById(site.folder).removeSite(site);
			site.folder = folder;
		} else {
			site.folder.removeSite(site);
		}
		folder.addSite(site);
	}

	findFolderByName(name,undef){
		let folder = (undef ? false : this.mainFolder);
		this.mainFolder.subfolders.forEach((e)=>{
			if(e.name === name){
				folder = e;
			}
		});
		return folder;
	}

	findFolderById(id){
		let folder = this.mainFolder;
		this.mainFolder.subfolders.forEach((e)=>{
			if(e.id === id){
				folder = e;
			}
		});
		return folder;
	}

	findFolderIndex(val){
		let folder = -1;
		this.mainFolder.subfolders.forEach((e,i)=>{
			if(e.id === val || e.name === val){
				folder = i;
			}
		});
		return folder;
	}

	generateHTML(){
		return this.mainFolder.generateHTML();
	}
	render(layout){
		this.parent.innerHTML = '';
		this.parent.appendChild(layout.folderRender(this.mainFolder));

		this.dropdown.innerHTML = '';

		let a = document.createElement('a');
		a.innerText = 'Main Folder';
		a.classList.add('dropdown-item');
		a.addEventListener('mousedown',()=>{
			let elem = d('openDropdown').parentNode.parentNode;
			if(elem.className.indexOf('is-active') > -1){
				elem.classList.remove('is-active');
			} else {
				elem.classList.add('is-active');
			}
			this.selectedFolder = this.mainFolder;
			this.dropdown.parentNode.parentNode.querySelector('button > span').innerText = 'Main Folder';
		});
		this.dropdown.appendChild(a);

		this.mainFolder.subfolders.forEach((e)=>{
			let a = document.createElement('a');
			a.innerText = e.name;
			a.classList.add('dropdown-item');
			a.addEventListener('mousedown',()=>{
				let elem = d('openDropdown').parentNode.parentNode;
				if(elem.className.indexOf('is-active') > -1){
					elem.classList.remove('is-active');
				} else {
					elem.classList.add('is-active');
				}
				this.selectedFolder = e;
				this.dropdown.parentNode.parentNode.querySelector('button > span').innerText = e.name;
			});
			this.dropdown.appendChild(a);
		});
	}

	generateJSON(){
		return this.mainFolder.collapse();
	}
	parseJSON(json){
		let newFolder = new Folder(this.mainFolder.name,this.mainFolder.listener,this.mainFolder.isParent);
		newFolder.id = json.id;

		let self = this;

		json.sites.forEach((e)=>{
			let newWebsite = new Website(e.data,newFolder);
			newFolder.addSite(newWebsite);
		});
		json.subfolders.forEach((e)=>{
			let newSubfolder = new Folder(e.name,(ev)=>{
				self.updateSelected(ev,self);
			},e.isParent);
			e.sites.forEach((el)=>{
				let newWebsite = new Website(el.data,newSubfolder);
				newSubfolder.addSite(newWebsite);
			});
			newFolder.addFolder(newSubfolder);
		});
		this.mainFolder = newFolder;
		this.selectedFolder = this.mainFolder;
	}
}

module.exports = (function(scope){
	scope.Manager = Manager;
});
}).call(manager);
