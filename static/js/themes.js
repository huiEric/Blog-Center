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
	if($('hideTitle')){
		var title = $('hideTitle').innerHTML;
		var author = $('hideAuthor').innerHTML;
		var createTime = $('hideCreateTime').innerHTML;
		showPassage(title,author,createTime);
		$('hideTitle').parentNode.removeChild($('hideTitle'));
	}
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
	var title = object.childNodes[0].innerHTML;
	var author = object.parentNode.parentNode.childNodes[3].childNodes[9].childNodes[1].innerHTML;
	var createTime = object.parentNode.parentNode.childNodes[3].childNodes[5].innerHTML;
	showPassage(title,author,createTime);
}
function showPassage(title,author,createTime){
	$('center').style.display = 'none';
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
			var back = document.createElement('div');
			pContainer.appendChild(back);
			back.id = 'back';
			back.innerHTML = '返回';
			back.onclick = function onclick(event){
				//pContainer.style.display = 'none';
				//$('center').style.display = 'block';
				window.location.href = '/themes';
			}
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
			var n=0;
			for (var i in result.comments){
				n++;
				var commentor = result.comments[i].commentor;
				var comment = result.comments[i].comment;
				var commentTime = result.comments[i].commentTime;
				var comContainer = document.createElement('div');
				pContainer.appendChild(comContainer);
				createComment(commentor,comment,commentTime,comContainer,n);
			}
			if(result.login==0){
				var tocomment = document.createElement('a');
				pContainer.appendChild(tocomment);
				tocomment.id = 'tocomment';
				tocomment.innerHTML = '登录后发表评论';
				tocomment.onclick = function onclick(event){
					window.location.href = '/signin';
				}
			}
			else{
				var textarea = document.createElement('textarea');
				pContainer.appendChild(textarea);
				textarea.id = "textarea";
				textarea.style.resize = 'none';
				textarea.placeholder = '说点儿什么吧...';
				var publish = document.createElement('a');
				pContainer.appendChild(publish);
				publish.id = 'publish';
				publish.innerHTML = '发表';
				publish.onclick = function onclick(event){
					var comment = textarea.value;
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
							if(result.success==1){
								alert('发表成功!');
								textarea.value = '';
								commentTimes+=1;
								com.innerHTML = '评论('+commentTimes+')';
								var comContainer = document.createElement('div');
								pContainer.insertBefore(comContainer,textarea)
								createComment(result.commentor,result.comment,result.commentTime,comContainer,++n);
							}
							else{
								alert('哎呀,出了点儿小问题哟,待会儿再试试吧');
							}
						}
					}
					var url = '/themes';
					xmlhttp.open("POST",url,true);
					xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
					xmlhttp.send('comment='+comment+'&title='+title+'&author='+author);
				}
			}
		}
	}
	var url = '/themes';
	xmlhttp.open("POST",url,false);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send('author='+author+'&title='+title);
}
var formatTime = function (date) {  
	datetime = new Date(date);
    var y = datetime.getFullYear();  
    var m = datetime.getMonth() + 1;  
    m = m < 10 ? ('0' + m) : m;  
    var d = datetime.getDate();  
    d = d < 10 ? ('0' + d) : d;  
    return y + '-' + m + '-' + d+' '+date.slice(17,25);  
};  
function createComment(commentor,comment,commentTime,comContainer,n){
	comContainer.id = 'comContainer';
	var p = document.createElement('p');
	comContainer.appendChild(p);
	var or = document.createElement('a');
	p.appendChild(or);
	or.id = 'or';
	or.innerHTML = commentor;
	var lou = document.createElement('span');
	comContainer.appendChild(lou);
	lou.innerHTML = n+'楼';
	lou.id = 'lou';
	var timeInfo = document.createElement('span');
	comContainer.appendChild(timeInfo);
	timeInfo.id = 'timeInfo';
	timeInfo.innerHTML = formatTime(commentTime);
	var comText = document.createElement('div');
	comContainer.appendChild(comText);
	comText.id = 'comText';
	comText.innerHTML = comment;
}