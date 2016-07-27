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
window.onload = function(){	
	for (var i in g('passages')){
		if(parseInt(i).toString()!='NaN'){
			g('passages')[i].id = g('passages')[i].childNodes[1].innerHTML;
		}
	}
	g('passages')[0].style.display = 'block';
	for (var i in g('ti')){
		if(parseInt(i).toString()!='NaN'){
			title = g('ti')[i]; 	
			title.innerHTML = markdown.toHTML(title.innerHTML);
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
function read(object){
	$('center').style.display = 'none';
	var title = object.childNodes[0].innerHTML;
	var author = object.parentNode.parentNode.childNodes[3].childNodes[9].childNodes[1].innerHTML;
	var createTime = object.parentNode.parentNode.childNodes[3].childNodes[5].innerHTML;
	var xmlhttp;
	if(window.XMLHttpRequest){
		xmlhttp = new XMLHttpRequest();
	}
	else{
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState==4&&xmlhttp.status==200){
			var result = JSON.parse(xmlhttp.responseText);
			var text = result.text;
			var category = result.category;
			var commentTimes = result.commentTimes;
			var readTimes = result.readTimes;
			var pContainer = document.createElement('div');
			document.getElementsByTagName('body')[0].appendChild(pContainer);
			pContainer.id = "p-container";
			pContainer.style.width = "600px";
			pContainer.style.margin = "100px auto";
			var p = document.createElement('div');
			pContainer.appendChild(p);
			p.id = "p";
			var label = document.createElement('span');
			p.appendChild(label);
			label.id = "label";
			var themes = document.createElement('i');
			label.appendChild(themes);
			themes.id = "th";
			var textnode = document.createTextNode(category);
			label.appendChild(textnode);
			label.style.marginLeft = "30px";
			var ti = document.createElement('div');
			p.appendChild(ti);
			ti.id = "ti";
			ti.classname = "ti";
			ti.innerHTML = title;
			ti.style.marginTop = "30px";
			ti.style.cursor = 'default';
			var te = document.createElement('div');
			p.appendChild(te);
			te.id = "te";
			te.classname = "te";
			te.innerHTML = markdown.toHTML(text);
			var note = document.createElement('div');
			pContainer.appendChild(note);
			note.id = "note";
			var read = document.createElement('span');
			note.appendChild(read);
			read.id = "read";
			read.innerHTML = '阅读('+readTimes+')';
			var com = document.createElement('span');
			note.appendChild(com);
			com.id = "com";
			com.innerHTML = '评论('+commentTimes+')';
			var time = document.createElement('span');
			note.appendChild(time);
			time.innerHTML = createTime;
			var follow = document.createElement('a');
			note.appendChild(follow);
			follow.id = "follow";
			follow.innerHTML = "+关注";
			follow.style.cursor = 'pointer';
			var authorwrapper = document.createElement('span');
			note.appendChild(authorwrapper);
			authorwrapper.id = "authorwrapper";
			authorwrapper.innerHTML = "by &nbsp";
			var authorObject = document.createElement('a');
			authorwrapper.appendChild(authorObject);
			authorObject.id = "author";
			authorObject.innerHTML = author;
			authorObject.style.cursor = 'pointer';
			var textarea = document.createElement('textarea');
			pContainer.appendChild(textarea);
			textarea.id = "textarea";
			textarea.style.resize = 'none';
			textarea.placeholder = '说点儿什么吧...';
			var publish = document.createElement('a');
			pContainer.appendChild(publish);
			publish.id = 'publish';
			publish.innerHTML = '发表';
		}
	}
	var url = '/themes';
	xmlhttp.open("POST",url,true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send('author='+author+'&title='+title);
}