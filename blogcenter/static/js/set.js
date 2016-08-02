function displaySubMenu(subMenu) {
	subMenu.style.display = "block";
}
function hideSubMenu(subMenu) {
	subMenu.style.display = "none";
}
var $ = function(id){
	return document.getElementById(id);
}
var g = function(tag){
	return document.getElementsByTagName(tag);
}
function change(id){
	$('basic').style.borderColor = "transparent";
	$('info').style.borderColor = "transparent";
	$('passwd').style.borderColor = "transparent";
	$('basic').style.cursor = "pointer";
	$('info').style.cursor = "pointer";
	$('passwd').style.cursor = "pointer";
	$(id).style.border = "1px solid #ddd";
	$(id).style.borderBottomColor = "white";
	$(id).style.cursor = "default";
	$('basicContent').style.display = 'none';
	$('infoContent').style.display = 'none';
	$('passwdContent').style.display = 'none';
	$(id+'Content').style.display = 'block'; 	
}
window.onload = function(){
	$('nickname').value = $('hideNickname').innerHTML;
	$('email').value = $('hideEmail').innerHTML;
	$('textarea').value = $('hideIntro').innerHTML;
	for (var i in g('img')){
		g('img')[i].src = $('hideImgPath').innerHTML;
	}
	if($('hideTel')){
		$('tel').value = $('hideTel').innerHTML;
		$('tel').disabled = 'disabled';
	}
	else{
		$('tel').style.cursor = 'auto';
	}
}
function saveBasic(object){
	var nickname = $('nickname').value;
	if(isNicknameEmpty(nickname)){
		alert('昵称不能为空!');
		return;
	}
	if(nickname!=$('hideNickname').innerHTML && isNicknameExist(nickname)){
		alert('昵称已存在');
		return;
	}
	var tel = $('tel').value;
	if(tel.length!=11){
		alert('手机号码格式错误!');
		return;
	}
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
			if(result.success==1){
				alert('保存成功!');
				window.location.href = '/set';
			}
			else{
				alert('一不小心失败了,等一下再试试吧~');
			}
		}
	}
	url = '/set';
	xmlhttp.open("POST",url,true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send('nickname='+nickname+'&tel='+tel);
}
function isNicknameExist(nickname){
	var xmlhttp;
	var exist=0;
	if(window.XMLHttpRequest){
		xmlhttp=new XMLHttpRequest();
	}
	else{
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function(){
		if(xmlhttp.readyState==4&&xmlhttp.status==200){
			result=JSON.parse(xmlhttp.responseText);
			if(result.exist==1){
				exist=1;
			}
		}
	}
	url='/signup'+'?nickname='+nickname;
	xmlhttp.open("GET",url,false);
	xmlhttp.send();
	if (exist==1) {
		return true;
	}
	else{
		return false;
	}
}
function isNicknameEmpty(nickname){
	if(nickname == ''||(/^[ ]+$/.test(nickname))){
		return true;
	}
	return false;
}
function send(object){
	object.parentNode.submit();
}
function saveIntro(){
	var intro = $('textarea').value;
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
			if(result.success==1){
				alert('保存成功!');
			}
			else{
				alert('一不小心失败了,等一下再试试吧~');
			}
		}
	}
	url = '/set';
	xmlhttp.open("POST",url,true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send('intro='+intro);
}
function checkOri(object){
	var xmlhttp;
	var passwd = object.value;
	if(window.XMLHttpRequest){
		xmlhttp=new XMLHttpRequest();
	}
	else{
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function(){
		if(xmlhttp.readyState==4&&xmlhttp.status==200){
			result=JSON.parse(xmlhttp.responseText);
			if(result.correct==1){
				object.parentNode.childNodes[3].style.display = 'none';
				object.parentNode.childNodes[5].style.display = 'inline';
			}
			else{
				object.parentNode.childNodes[5].style.display = 'none';
				object.parentNode.childNodes[3].style.display = 'inline';
			}
		}
	}
	url='/set';
	xmlhttp.open("POST",url,true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send('passwd='+passwd);
}
function checkNew(object){
	var  newPasswd = object.value;
	if(newPasswd == ''||(/^[ ]+$/.test(newPasswd))){
		object.parentNode.childNodes[5].style.display = 'none';
		object.parentNode.childNodes[3].style.display = 'inline';
	}
	else{
		object.parentNode.childNodes[3].style.display = 'none';
		object.parentNode.childNodes[5].style.display = 'inline';
	}
}
function checkConfirm(object){
	var confirm = object.value;
	var newPasswd = object.parentNode.parentNode.childNodes[7].childNodes[1].value;
	if(confirm!=newPasswd){
		object.parentNode.childNodes[5].style.display = 'none';
		object.parentNode.childNodes[3].style.display = 'inline';
	}
	else{
		object.parentNode.childNodes[3].style.display = 'none';
		object.parentNode.childNodes[5].style.display = 'inline';
	}
}
function summit(){
	if($('origin').value==''||$('origin').parentNode.childNodes[3].style.display=='inline'){
		alert('初始密码错误!');
		return;
	}
	var newPasswd = $('new').value;
	if(newPasswd == ''||(/^[ ]+$/.test(newPasswd))){
		alert('密码不为空!');
		return;
	}
	var confirm = $('confirm').value;
	if(confirm!=newPasswd){
		alert('两次输入的密码不一致!');
		return;
	}
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
			if (result.success==1) {
				alert('修改成功!');
				window.location.href = '/set';
			}
			else{
				alert('出了点小问题,等下再试试呗');
			}
		}
	}
	url='/set';
	xmlhttp.open("POST",url,true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send('newPasswd='+newPasswd);
}