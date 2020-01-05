function ToggleModal(id){
	let elem = document.querySelector(`#${id}`);
	if(elem.className.indexOf('is-active') > -1){
		elem.classList.remove('is-active');
	} else {
		elem.classList.add('is-active');
	}
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

const currentUsername = document.querySelector('#username-change').value;

document.querySelector('#delete').addEventListener('mousedown',()=>{ToggleModal('deleteModal')});
document.querySelector('#deleteModal > .modal-background').addEventListener('mousedown',()=>{ToggleModal('deleteModal')});
document.querySelector('#deleteCancel').addEventListener('mousedown',()=>{ToggleModal('deleteModal')});
document.querySelector('#verifyPass').addEventListener('mousedown',()=>{
	SendRequest('/checklogin','POST',`username=${currentUsername}&password=${document.querySelector('#verifyPassText').value}`,(resp)=>{
		if(resp === 'true'){
			document.querySelector('#deleteAction').disabled = false;
		} else {
			document.querySelector('#deleteAction').disabled = true;
		}
	});
});
document.querySelector('#deleteAction').addEventListener('mousedown',()=>{
	SendRequest('/deleteaccount','POST',`username=${currentUsername}`,(resp)=>{
		ToggleModal('deleteModal');
		location.href = '/logout';
	});
});

document.querySelector('#update-username').addEventListener('mousedown',()=>{
	if(document.querySelector('#username-change').value !== currentUsername){
		console.log('a');
		SendRequest('/updateusername','POST',`oldUsername=${currentUsername}&newUsername=${document.querySelector('#username-change').value}`,(resp)=>{
			console.log(resp);
			if(resp === 'true'){
				document.querySelector('#username-change').classList.add('is-success');
				location.reload();
			} else {
				document.querySelector('#username-change').classList.add('is-danger');
			}
		});
	}
});

document.querySelector('#update-info').addEventListener('mousedown',()=>{
	let currentPassword = document.querySelector('#current-password').value,
		newPassword = document.querySelector('#password-change').value,
		username = currentUsername;
	SendRequest('/changepassword','POST',`username=${username}&password=${currentPassword}&newPassword=${newPassword}`,(resp)=>{
		if(resp === 'true'){
			document.querySelector('#password-change').classList.add('is-success');
		} else if(resp === 'bad-login'){
			document.querySelector('#current-password').classList.add('is-danger');
		} else {
			document.querySelector('#password-change').classList.add('is-danger');
		}
		location.reload();
	});
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

document.querySelector('#beta-enable').checked = localStorage.getItem('beta');

document.querySelector('#beta-enable').addEventListener('change',()=>{
	let enabled = document.querySelector('#beta-enable').checked;
	localStorage.setItem('beta',enabled);
});
