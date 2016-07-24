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
			console.log(result);
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