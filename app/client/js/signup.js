function ShowError(text,name){
	document.getElementsByName(name)[0].classList.add('is-danger');
	document.getElementById(name+'-error').innerText = text;
}
function ResetForm(){
	document.getElementsByName('username')[0].classList.remove('is-danger');
	document.getElementById('username-error').innerText = '';
	document.getElementsByName('password')[0].classList.remove('is-danger');
	document.getElementById('password-error').innerText = '';
	document.getElementsByName('confirm_password')[0].classList.remove('is-danger');
	document.getElementById('confirm_password-error').innerText = '';
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
document.querySelector('form').onsubmit = (e)=>{
	ResetForm();
	e.preventDefault();
	let hit = false;
	SendRequest('/usernametaken','POST',`username=${document.getElementsByName('username')[0].value}`,(resp)=>{
		if(resp === 'true'){
			hit = true;
			ShowError('Username already in use','username');
			e.preventDefault();
		}
		
		if(!hit){
			document.querySelector('form').onsubmit = ()=>{};
			document.querySelector('form').submit();
		}
	});
	if(document.getElementsByName('password')[0].value !== document.getElementsByName('confirm_password')[0].value){
		ShowError('Passwords do not match','confirm_password');
		hit = true;
		e.preventDefault();
		return false;
	}
};
