function get(id){
	return document.getElementById(id);
}
function isLogin(){
	var xmlhttp;
	if(window.XMLHttpRequest){
		xmlhttp = new XMLHttpRequest();
	}
	else{
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function(){
		if(xmlhttp.readyState==4&&xmlhttp.status==200){
			result = JSON.parse(xmlhttp.responseText);
			if(result.isLogin==0){
				alert('要先登陆哦~');
			}
			else{
				window.location.href = '/write';
			}
		}
	}
	url = '/'+'?q='+'isLogin';
	xmlhttp.open("GET",url,false);
	xmlhttp.send();
}
function read(object){
	var title = object.innerHTML;
	console.log(object.parentNode.parentNode.childNodes[3].childNodes[9].childNodes[1]);
	var author = object.parentNode.parentNode.childNodes[3].childNodes[9].childNodes[1].innerHTML;
	var xmlhttp;
	if(window.XMLHttpRequest){
		xmlhttp = new XMLHttpRequest();
	}
	else{
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function(){
		if(xmlhttp.readyState==4&&xmlhttp.status==200){
			result = JSON.parse(xmlhttp.responseText);
			if(result.ok==1){
				window.location.href = '/themes';
			}
		}
	}
	url = '/';
	xmlhttp.open("POST",url,true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send('title='+title+'&author='+author); 
}