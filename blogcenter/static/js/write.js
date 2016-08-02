function displaySubMenu(subMenu) {
	subMenu.style.display = "block";
}
function hideSubMenu(subMenu) {
	subMenu.style.display = "none";
}
function Editor(input, preview) {
	        this.update = function () {
	          preview.innerHTML = markdown.toHTML(input);
	        };
	        input.editor = this;
	        this.update();
	      }
	      var get = function (id) { return document.getElementById(id); };
	      var n = 1;
function displayInput(id)
{
	str = get(id).value;
	if (textWidth(str)>490) {
		while(textWidth(str)>490)
		{
			get(id).value = str.slice(0,parseInt(get(id).getAttribute('length')));
			str = str.slice(parseInt(get(id).getAttribute('length')),str.length);
			addLine();
			id = 'input'+(parseInt(get(id).getAttribute('index'))+1);
		} 
		get(id).value = str.slice(0,parseInt(get(id).getAttribute('length')));
	}
	new Editor(toStr(),get('preview'));
}
	      function toStr()
	      {
	      	str = get('input1').value;
	      	for(var i=2;i<=n;i++)
	      	{
	      		str += '\r\n'+get('input'+i).value;
	      	}
	      	return str;
	      }
	      function setCursorEnd(input){
			var len=input.value.length;
			setSelectionRange(input,len,len); //将光标定位到文本最后 
			}

			function setSelectionRange(input, selectionStart, selectionEnd) {
			 if (input.setSelectionRange) {  
			   input.focus();  
			   input.setSelectionRange(selectionStart, selectionEnd);  
			 }  
			 else if (input.createTextRange) {  
			   var range = input.createTextRange();  
			   range.collapse(true);  
			   range.moveEnd('character', selectionEnd);  
			   range.moveStart('character', selectionStart);  
			   range.select();  
			 }  
			}  
	      function addLine()
	      {
	      				n++;
	      				if (n>15) {
	      					get('input').style.height = n*37+'px';
	      					get('countline').style.height = n*37+'px';
	      					get('scrollbar').style.height = n*37+'px';
	      					get('preview').style.height = n*37+'px';
	      				}
		      			input = document.createElement('input');
		      			document.getElementById('input').appendChild(input);
		      			style=input.style;
		      			input.name="input"+n;
		      			input.id="input"+n;
		      			input.setAttribute('index',n);
		      			input.setAttribute('length',47);
		      			input.onkeydown=function onkeydown(event){
		      				check(window.event,this.id);
		      			}
		      			input.oninput=function oninput(event){
		      				displayInput(this.id);
		      			}
		      			input.onfocus=function onfocus(event){
		      				this.style.backgroundColor = "#34302f"; 
		      				this.style.opacity = "0.6";
		      			}
		      			input.onblur=function onblur(event){
		      				this.style.backgroundColor = "#2c2827";
		      				this.style.opacity = "1";
		      			}
		      			style.width="100%";
		      			style.height="27px";
		      			style.padding="5px 17px 5px 27px";
		      			style.fontSize="20px";
		      			style.color="#1d7fe2";
		      			style.outline="none";
		      			style.border="none";
		      			style.background= "#2c2827";
		      			style.fontFamily='"YaHei Consolas Hybrid", Consolas, 微软雅黑, "Meiryo UI", "Malgun Gothic", "Segoe UI", "Trebuchet MS", Helvetica, Monaco, courier, monospace';
		      			line = document.createElement('div');
		      			get('countline').appendChild(line);
		      			line.id = 'l' +  n;
		      			line.innerHTML = n;
		      			style=line.style;
		      			style.width = "45px";
		      			style.height = "37px";
		      			style.backgroundColor = "transparent"; 
		      			style.textAlign = "center";
		      			style.lineHeight = "37px";
		      			style.color = "#8F938F";
		      			style.fontFamily = '"YaHei Consolas Hybrid", Consolas, 微软雅黑, "Meiryo UI", "Malgun Gothic", "Segoe UI", "Trebuchet MS", Helvetica, Monaco, courier, monospace';
		      			input.focus();
	      }
	      function check(e,id)
	      {
	      	if(window.event)
	      	{
	      		if (e.keyCode == 13) 
	      		{
	      			if(id == 'input' + n)
	      			{
	      				addLine();
	      			}
	      			else
	      			{
	      				get('input' + (parseInt(get(id).getAttribute('index')) + 1)).focus();
	      			}
	      		}
	      		if (e.keyCode == 8) {
	      			if((parseInt(get(id).getAttribute('index'))>1)&&(get(id).value == ''))
	      			{
	      				get('input' + (parseInt(get(id).getAttribute('index'))-1)).focus();
	      				setCursorEnd(get('input' + (parseInt(get(id).getAttribute('index'))-1)));
	      				for(var i=n;i>parseInt(get(id).getAttribute('index'));i--)
	      				{
	      					target = get('input'+i);
	      					target.name="input"+(i-1);
		      				target.id="input"+(i-1);
		      				target.setAttribute('index',i-1);
		      				target = get('l'+i);
		      				target.id = 'l' + (i-1);
		      				target.innerHTML = i-1;
	      				}
	      				get('l'+get(id).getAttribute('index')).parentNode.removeChild(get('l'+get(id).getAttribute('index')));
	      				get('input'+get(id).getAttribute('index')).parentNode.removeChild(get('input'+get(id).getAttribute('index')));
	      				n--;
	      				id = get('input'+n).id; 
	      				if(n>15)
	      				{
	      					get('input').style.height = n*37+'px';
		      				get('countline').style.height = n*37+'px';
		      				get('scrollbar').style.height = n*37+'px';
		      				get('preview').style.height = n*37+'px';
	      				}
	      			}
	      		}
	      		if (e.keyCode == 40) {
	      			if (get('input' + (parseInt(get(id).getAttribute('index')) + 1))) {
	      				get('input' + (parseInt(get(id).getAttribute('index')) + 1)).focus();
	      			}
	      		}
	      		if (e.keyCode == 38) {
	      			get('input' + (parseInt(get(id).getAttribute('index'))-1)).focus();
	      		}
	      	}
	      }	
var textWidth = function(text){ 
	        var sensor = $('<pre>'+ text +'</pre>').css({display: 'none',fontSize: '20px'}); 
	        $('body').append(sensor); 
	        var width = sensor.width();
	        sensor.remove(); 
	        return width;
	    };
var title,category;
function getTitle(){
	if (get('title').style.display=='block') {
		get('title').style.display=='none';
		title = prompt("请输入博客的标题:",get('title').innerHTML);
	}
	else{
		title = prompt("请输入博客的标题:");
	}
	if(!title||(/^[ ]+$/.test(title))){
		title=undefined;
		return;
	}
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
			if(result.exist==0){
				var titleObj = get('title');
				titleObj.style.display = 'block';
				titleObj.innerHTML = title;
			}
			else{
				alert('你已经写过这篇博客啦~');
				title = undefined;
			}
		}
	}
	url = '/write'+'?title='+title;
	xmlhttp.open("GET",url,false);
	xmlhttp.send();
}
function getCategory(){
	if (get('category').style.display=='block') {
		get('category').style.display=='none';
		category = prompt("请输入博客的分类:",get('category').innerHTML);
	}
	else{
		category = prompt("请输入博客的分类:");
	}
	if(!category||(/^[ ]+$/.test(category))){
		category=undefined;
		return;
	}
	var categoryObj=get('category');
	categoryObj.style.display = 'block';
	categoryObj.innerHTML = category;
}
function save(){
	text = toStr();
	var saved=0;
	if(!title||(/^[ ]+$/.test(title))){
		alert('先想个好题目吧~');
		return;
	}
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
			if(result.exist==1){
				alert('你已经保存过啦~');
				saved=1;
			}
		}
	}
	url = '/write'+'?title='+title;
	xmlhttp.open("GET",url,false);
	xmlhttp.send();
	if(saved==1){
		return;
	}
	if(!category||(/^[ ]+$/.test(category))){
		alert('要分在哪一类呢...');
		return;
	}
	if (!text||(/^[ ]+$/.test(text))) {
		alert('少年,你的博客还没写呢');
		return;
	}
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
				alert('保存成功!');
			}
			else{
				alert('失败了,待会儿再试试吧');
			}
		}
	}
	url = '/write';
	xmlhttp.open("POST",url,true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send('title='+title+'&category='+category+'&text='+text+'&publish=0');
}
function publish() {
	text = toStr();
	var published=0;
	if(!title||(/^[ ]+$/.test(title))){
		alert('先想个好题目吧~');
		return;
	}
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
			console.log(result.published);
			if(result.published==1){

				alert('发表成功!');
				//window.location.href = '/home';
				published = 1;
			}
		}
	}
	url = '/write'+'?title='+title+'&publish='+1;
	xmlhttp.open("GET",url,false);
	xmlhttp.send();
	if(published==1){
		return;
	}
	if(!category||(/^[ ]+$/.test(category))){
		alert('要分在哪一类呢...');
		return;
	}
	if (!text||(/^[ ]+$/.test(text))) {
		alert('少年,你的博客还没写呢');
		return;
	}
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
				alert('失败了,待会儿再试试吧');
			}
		}
	}
	url = '/write';
	xmlhttp.open("POST",url,true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send('title='+title+'&category='+category+'&text='+text+'&publish=1');
}
var g = function(tag){
	return document.getElementsByTagName(tag);
}
window.onload = function(){
	get('input1').setAttribute('index',1);
	get('input1').setAttribute('length',47);
	get('input1').focus();
	for (var i in g('img')){
		g('img')[i].src = get('hideImgPath').innerHTML;
	}
	if(get('title').innerHTML!=''&&get('category').innerHTML!=''){
		get('title').style.display = 'block';
		get('category').style.display = 'block';
		get('input1').value = get('hide').innerHTML;
		title = get('title').innerHTML;
		category = get('category').innerHTML;
		displayInput('input1');
	}
}