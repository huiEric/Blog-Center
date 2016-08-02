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
/*function checkEmail(id){
	email = get(id).value;
	get('error1').style.display = 'none';
	if (isEmailValid(email)) {
		get('passwd').focus();
	}
	else{
		get('error1').style.display = 'inline';
	}
} 	
/*function summit(){
	get('form').summit();
}*/
/***
	Ajax
		***/
function summit(){
	var xmlhttp;
	if(window.XMLHttpRequest){
		xmlhttp=new XMLHttpRequest();
	}
	else{
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function(){
		if(xmlhttp.readyState==4&&xmlhttp.status==200){
			result=JSON.parse(xmlhttp.responseText);
			if(result.success==0){
				error=result.error;
				alert(error);
			}
			else if(result.comment==1){
				window.location.href = '/themes';
			}
			else{
				window.location.href='/home';
			}
		}
	}
	url='/signin'+'?nickname='+get('nickname').value+'&passwd='+get('passwd').value;
	xmlhttp.open("GET",url,true);
	xmlhttp.send();
}