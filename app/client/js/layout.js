let d=i=>{return document.getElementById(i)};

class LayoutStrategy {
	constructor(folderRender,websiteRender){
		this.folderRender = folderRender;
		this.websiteRender = websiteRender;
	}
}
const DefaultLayout = new LayoutStrategy((folder)=>{
	let ul = document.createElement('ul'),
		self = folder;
	ul.classList.add('menu-list');
	folder.subfolders.forEach((e)=>{
		let p = document.createElement('p');
		p.innerText = e.name;
		p.classList.add('menu-label');
		ul.appendChild(p);
		ul.appendChild(DefaultLayout.folderRender(e));
	});
	if(folder.subfolders.length && folder.isParent){
		let hr = document.createElement('hr');
		ul.appendChild(hr);
	}
	if(folder.isParent){
		let p = document.createElement('p');
		p.classList.add('menu-label');
		p.innerText = folder.name;
		ul.appendChild(p);
	}
	folder.sites.forEach((e)=>{
		let li = DefaultLayout.websiteRender(e);
		li.addEventListener('mousedown',()=>{
			self.listener(e);
		});
		ul.appendChild(li);
	});
	return ul;
},(website)=>{
	let li = document.createElement('li');
	li.classList.add('is-website');
	li.innerText = website.data.website;

	let query = d('searchbar').value.trim().toLowerCase();
	if(li.innerText.toLowerCase().indexOf(query) === -1){
		li.classList.add('is-hidden');
	}
	return li;
});
/* WIP */
const PanelLayout = new LayoutStrategy((folder)=>{
	let nav = document.createElement('nav'),
		self = folder;
	nav.classList.add('panel');
	let p = document.createElement('p');
	p.classList.add('panel-tabs');
	nav.appendChild(p);
	folder.subfolders.forEach((e)=>{
		let a = document.createElement('a');
		a.innerText = e.name;
		p.appendChild(a);
		p.appendChild(PanelLayout.folderRender(e));
	});
	if(folder.isParent){
		let a = document.createElement('a');
		a.innerText = folder.name;
		p.appendChild(a);
	}
	folder.sites.forEach((e)=>{
		let a = PanelLayout.websiteRender(e);
		a.addEventListener('mousedown',()=>{
			self.listener(e);
		});
		nav.appendChild(a);
	});
	return nav;
},(website)=>{
	let a = document.createElement('a');
	a.classList.add('panel-block');
	a.classList.add('is-website');
	a.innerText = website.name;
	return a;
});
const CardLayout = new LayoutStrategy((folder)=>{
	let container = document.createElement('div'),
		self = folder;
	folder.subfolders.forEach((e)=>{
		let h4 = document.createElement('h4');
		h4.classList.add('is-foldername');
		h4.innerText = e.name;
		container.appendChild(h4);
		container.appendChild(CardLayout.folderRender(e));
		let br = document.createElement('br');
		container.appendChild(br);
		container.appendChild(br.cloneNode());
		container.appendChild(br.cloneNode());
	});
	if(folder.isParent){
		let h4 = document.createElement('h4');
		h4.classList.add('is-foldername');
		h4.innerText = folder.name;
		container.appendChild(h4);
	}
	folder.sites.forEach((e)=>{
		let div = CardLayout.websiteRender(e);
		div.addEventListener('mousedown',()=>{
			self.listener(e);
		});
		container.appendChild(div);
	});
	return container;
},(website)=>{
	let div = document.createElement('div');
	div.classList.add('card');
	let cardContent = document.createElement('div');
	cardContent.classList.add('card-content');
	let content = document.createElement('div');
	content.classList.add('content');
	content.innerText = website.name;
	cardContent.appendChild(content);
	div.appendChild(cardContent);
	div.classList.add('is-website');
	
	let query = d('searchbar').value.trim().toLowerCase();
	if(content.innerText.toLowerCase().indexOf(query) === -1){
		div.classList.add('is-hidden');
	}
	return div;
});

module.exports = (function(scope){
	scope.DefaultLayout = DefaultLayout;
	scope.CardLayout = CardLayout;
	scope.PanelLayout = PanelLayout;
});
