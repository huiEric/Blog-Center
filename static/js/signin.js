var get = function(id){
	return document.getElementById(id);
}
function isEmailValid(email){
	var pattern = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/; 
	if (!pattern.test(email)) {  
        return false;  
    }  
    return true; 
}
function checkEmail(id){
	email = get(id).value;
	get('error1').style.display = 'none';
	if (isEmailValid(email)) {
		get('username').focus();
	}
	else{
		get('error1').style.display = 'inline';
	}
}
function summit(){
	get('form').summit();
}