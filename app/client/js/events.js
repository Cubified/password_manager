module.exports = (function(d,GeneratePassword,SendUpdate,manager,scope){
d('addNew').addEventListener('mousedown',()=>{
	d('websiteName').classList.remove('is-danger');
	if(d('websiteName').value.trim() !== ''){
		let website = manager.createSite();
		manager.render(scope.currentLayout);
		SendUpdate(manager,()=>{});
	} else{
		d('websiteName').classList.add('is-danger');
	}
});

d('createFolder').addEventListener('mousedown',()=>{
	if(d('folderName').value.trim() !== '' && !manager.findFolderByName(d('folderName').value,true) && d('folderName').value.trim() !== 'Main Folder'){
		d('folderName').classList.remove('is-danger');
		d('folderError').classList.add('is-hidden');
		manager.addSubfolder(d('folderName').value);
		manager.render(scope.currentLayout);

		SendUpdate(manager,()=>{});
	} else {
		d('folderName').classList.add('is-danger');
		d('folderError').classList.remove('is-hidden');
		d('folderError').innerText = 'A folder with this name already exists.';
	}
});
d('deleteFolder').addEventListener('mousedown',()=>{
	if(d('folderName').value.trim() !== '' && d('folderName').value !== 'Main Folder'){
		d('folderName').classList.remove('is-danger');
		d('folderError').classList.add('is-hidden');
		if(!manager.removeSubfolder(d('folderName').value)){
			d('folderName').classList.add('is-danger');
			d('folderError').classList.remove('is-hidden');
			d('folderError').innerText = 'A folder with this name does not exist.';
		}
		manager.render(scope.currentLayout);

		SendUpdate(manager,()=>{});
	} else if (d('folderName').value === 'Main Folder'){
		d('folderName').classList.add('is-danger');
		d('folderError').classList.remove('is-hidden');
		d('folderError').innerText = 'This folder cannot be deleted.';
	} else {
		d('folderName').classList.add('is-danger');
		d('folderError').classList.remove('is-hidden');
		d('folderError').innerText = 'A folder with this name does not exist.';
	}
});

d('openDropdown').addEventListener('mousedown',()=>{
	let elem = d('openDropdown').parentNode.parentNode;
	if(elem.className.indexOf('is-active') > -1){
		elem.classList.remove('is-active');
	} else {
		elem.classList.add('is-active');
	}
});

d('changeLayout').addEventListener('mousedown',()=>{
	let elem = d('changeLayout').parentNode.parentNode;
	if(elem.className.indexOf('is-active') > -1){
		elem.classList.remove('is-active');
	} else {
		elem.classList.add('is-active');
	}
});

d('updateSite').addEventListener('mousedown',()=>{
	if(manager.selectedWebsite !== ''){
		manager.selectedWebsite.changeWebsite(d('websiteName').value);
		manager.selectedWebsite.changeUsername(d('websiteUsername').value);
		manager.selectedWebsite.changePassword(d('websitePassword').value);
		manager.selectedWebsite.changeInfo(d('websiteInfo').value);

		let dropdownValue = d('openDropdown').children[0].innerText;
		if(dropdownValue !== manager.selectedWebsite.folder.name){
			manager.moveToSubfolder(manager.selectedWebsite,manager.findFolderByName(dropdownValue));
		}

		manager.render(scope.currentLayout);

		SendUpdate(manager,()=>{});
	}
});

d('deleteSite').addEventListener('mousedown',()=>{
	if(manager.selectedWebsite !== ''){
		d('websiteName').value=d('websiteUsername').value=d('websitePassword').value=d('websiteInfo').value='';
		manager.selectedWebsite.folder.removeSite(manager.selectedWebsite);
		manager.selectedWebsite = '';
		document.querySelector('#updateSite').disabled=document.querySelector('#deleteSite').disabled=true;
		manager.render(scope.currentLayout);

		SendUpdate(manager,()=>{});
	}
});

d('generatePassword').addEventListener('mousedown',()=>{
	d('websitePassword').value = GeneratePassword();
});

d('websitePassword').addEventListener('keyup',()=>{
	d('generatePassword').disabled = !(d('websitePassword').value.trim()==='');
});

d('searchbar').addEventListener('keyup',()=>{
	let query = d('searchbar').value.trim().toLowerCase();
	[].forEach.call(document.querySelectorAll('.is-website'),(e)=>{
		if(e.innerText.toLowerCase().indexOf(query) === -1){
			e.classList.add('is-hidden');
		} else {
			e.classList.remove('is-hidden');
		}
	});
});
});
