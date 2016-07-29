function displaySubMenu(subMenu) {
	subMenu.style.display = "block";
}
function hideSubMenu(subMenu) {
	subMenu.style.display = "none";
}
var $ = function(id){
	return document.getElementById(id);
} 
var g = function(classname){
	return document.getElementsByClassName(classname);
}
var get = function(tag){
	return document.getElementsByTagName(tag);
}
function edit(){
	var input = document.createElement('input');
	$('edit').appendChild(input);
	$('edit').removeChild($('introduction'));
	input.style.display = "block";
	input.style.width = "70%";
	input.style.height = "33px";
	input.style.margin = "10px auto";
	input.style.border = "1px solid #cccccc";
	input.style.fontSize = "18px";
	input.style.color = "#555555";
	input.style.borderRadius = "4px";
	input.style.padding = "0 10px 0 10px";
	input.value = $('username').innerHTML;
	var textarea = document.createElement('textarea');
	$('edit').appendChild(textarea);
	textarea.style.display = "block";
	textarea.style.resize = "none";
	textarea.style.width = "70%";
	textarea.style.height = "62px";
	textarea.style.margin = "10px auto";
	textarea.style.border = "1px solid #cccccc";
	textarea.style.fontSize = "18px";
	textarea.style.color = "#555555";
	textarea.style.borderRadius = "4px";
	textarea.style.padding = "5px 10px 5px 10px";
	textarea.value = $('hideIntro').innerHTML;
	var summit = document.createElement('a');
	$('edit').appendChild(summit);
	summit.href = "javascript:void(0)";
	summit.innerHTML = "保存";
	summit.id = "summit";
	summit.onclick = function onclick(event){
		var nickname = input.value;
		if(isNicknameEmpty(nickname)){
			alert('昵称不能为空!');
			return;
		}
		if(nickname!=$('username').innerHTML && isNicknameExist(nickname)){
			alert('昵称已存在');
			return;
		}
		var intro = textarea.value;
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
					window.location.href = '/home';
				}
				else{
					alert('一不小心失败了,等一下再试试吧~');
				}
			}
		}
		url = '/home';
		xmlhttp.open("POST",url,true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.send('intro='+intro+'&nickname='+nickname);
	}
	var cancel = document.createElement('a');
	$('edit').appendChild(cancel);
	cancel.href = "javascript:void(0)";
	cancel.innerHTML = "取消";
	cancel.id = "cancel";
	cancel.onclick = function onclick(event){
		$('edit').removeChild(input);
		$('edit').removeChild(textarea);
		$('edit').removeChild(summit);
		$('edit').removeChild(cancel);
		var introduction = document.createElement('a');
		$('edit').appendChild(introduction);
		introduction.href = "javascript:void(0)";
		introduction.innerHTML = "编辑个人介绍";
		introduction.id = "introduction";
		introduction.onclick = function onclick(event){
			edit();
		}
	}
}
function underline(id){
	$('new').style.borderBottomColor = "transparent";
	$('state').style.borderBottomColor = "transparent";
	$('hot').style.borderBottomColor = "transparent";
	$(id).style.borderBottom = "2px solid #555555";
	$('newest').style.display = 'none';
	$('news').style.display = 'none';
	if(id=='state'){
		$('news').style.display = 'block';
	}
	else{
		if($('title').innerHTML!=''){
			$('newest').style.display = 'block';
		}
	}
}
function toPass(){
	$('left').style.display = 'none';
	$('center').style.display = 'none';
	$('pass').style.display = 'block';
}
window.onload = function(){
	for (var i in get('img')){
		get('img')[i].src = $('hideImgPath').innerHTML;
	}
	for (var i in g('ti')){
		if(parseInt(i).toString()!='NaN'){
			title = g('ti')[i];
			title.innerHTML = markdown.toHTML(title.innerHTML);
		}
	}
	for (var i in g('te')){
		if(parseInt(i).toString()!='NaN'){
			text = g('te')[i];
		text.innerHTML = markdown.toHTML(text.innerHTML);
		}
	}
}
function del(object){
	console.log(object.parentNode.parentNode.childNodes[1].childNodes[3].childNodes[0].innerHTML);
	var title = object.parentNode.parentNode.childNodes[1].childNodes[3].childNodes[0].innerHTML;
	var xmlhttp;
	if(window.XMLHttpRequest){
		xmlhttp = new XMLHttpRequest();
	}
	else{
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState==4&&xmlhttp.status==200){
			result = JSON.parse(xmlhttp.responseText);
			if(result.success==1){
				alert('删除成功!你的博客还能在仓库找回来哦~');
				window.location.href = '/home';
			}
			else{
				alert('哎呀,出了点小问题,待会再试下吧');
			}
		}
	}
	var url = '/home'+'?title='+title;
	xmlhttp.open("GET",url,true);
	xmlhttp.send();
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