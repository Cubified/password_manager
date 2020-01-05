function ResetForm(){
	document.querySelector('article').classList.add('is-hidden');
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
	let hit = false,
		elem = document.querySelector('form');
	SendRequest('/checklogin','POST',`username=${document.getElementsByName('username')[0].value}&password=${document.getElementsByName('password')[0].value}`,(resp)=>{
		if(resp !== 'true'){
			hit = true;
		}
		
		if(!hit){
			elem.onsubmit = ()=>{};
			elem.submit();
		} else {
			document.querySelector('article').classList.remove('is-hidden');
		}
	});
};
