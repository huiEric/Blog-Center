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
function publish(object){
	var title = object.parentNode.parentNode.childNodes[1].childNodes[5].childNodes[0].innerHTML;
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
				alert('发表成功!');
				window.location.href = '/home';
			}
			else{
				alert('哎呀,出了点小问题,待会再试下吧');
			}
		}
	}
	var url = '/warehouse'+'?title='+title;
	xmlhttp.open("GET",url,true);
	xmlhttp.send();
}
window.onload = function(){	
	for (var i in get('img')){
		get('img')[i].src = $('hideImgPath').innerHTML;
	}
	for (var i in g('passages')){
		if(parseInt(i).toString()!='NaN'){
			g('passages')[i].id = g('passages')[i].childNodes[1].innerHTML;
		}
	}
	if(g('passages')[0]){
		g('passages')[0].style.display = 'block';
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
function change(object){
	for (var i in g('passages')){
		if(parseInt(i).toString()!='NaN'){
			g('passages')[i].style.display = 'none';
			$(object.innerHTML).style.display = 'block';
		}
	}
	var nodes = object.parentNode.childNodes;
	for(var i in nodes){
		if(parseInt(i).toString()!='NaN'&&nodes[i].innerHTML!=undefined){
			nodes[i].style.borderColor = "transparent";
			nodes[i].style.cursor = "pointer";
		}
	}
	object.style.border = "1px solid #ddd";
	object.style.borderBottomColor = "white";
	object.style.cursor = "default";
}
function del(object){
	var con = confirm('确认删除?(删了就再也找不回来了...');
	if(con==false){
		return;
	}
	var title = object.parentNode.parentNode.childNodes[1].childNodes[5].childNodes[0].innerHTML;
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
				alert('删除成功!');
				window.location.href = '/warehouse';
			}
			else{
				alert('哎呀,出了点小问题,待会再试下吧');
			}
		}
	}
	var url = '/warehouse'+'?title='+title+'&del=1';
	xmlhttp.open("GET",url,true);
	xmlhttp.send();
}
function update(object){
	var title = object.parentNode.parentNode.childNodes[1].childNodes[5].childNodes[0].innerHTML;
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
				window.location.href = '/write';
			}
			else{
				alert('出了点小状况.待会再试试吧~');
			}
		}
	}
	var url = '/warehouse'+'?title='+title+'&update=1';
	xmlhttp.open("GET",url,true);
	xmlhttp.send();
}
