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
	      var $ = function (id) { return document.getElementById(id); };
	      var n = 1;
	      $('input1').setAttribute('index',1);
	      window.onload = function()
	      {
	      	$('input1').focus();
	      }
	      function toStr()
	      {
	      	str = $('input1').value;
	      	for(var i=2;i<=n;i++)
	      	{
	      		str += '\n'+$('input'+i).value;
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
	      					$('input').style.height = n*37+'px';
	      					$('countline').style.height = n*37+'px';
	      					$('scrollbar').style.height = n*37+'px';
	      					$('preview').style.height = n*37+'px';
	      				}
		      			input = document.createElement('input');
		      			document.getElementById('input').appendChild(input);
		      			style=input.style;
		      			input.name="input"+n;
		      			input.id="input"+n;
		      			input.setAttribute('index',n);
		      			input.setAttribute('maxlength',47);
		      			input.onkeydown=function onkeydown(event){
		      				check(window.event,this.id);
		      			}
		      			input.oninput=function oninput(event){
		      				new Editor(toStr(),$('preview'));
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
		      			$('countline').appendChild(line);
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
	      				$('input' + (parseInt($(id).getAttribute('index')) + 1)).focus();
	      			}
	      		}
	      		if (e.keyCode == 8) {
	      			if((parseInt($(id).getAttribute('index'))>1)&&($(id).value == ''))
	      			{
	      				$('input' + (parseInt($(id).getAttribute('index'))-1)).focus();
	      				setCursorEnd($('input' + (parseInt($(id).getAttribute('index'))-1)));
	      				for(var i=n;i>parseInt($(id).getAttribute('index'));i--)
	      				{
	      					target = $('input'+i);
	      					target.name="input"+(i-1);
		      				target.id="input"+(i-1);
		      				target.setAttribute('index',i-1);
		      				target = $('l'+i);
		      				target.id = 'l' + (i-1);
		      				target.innerHTML = i-1;
	      				}
	      				$('l'+$(id).getAttribute('index')).parentNode.removeChild($('l'+$(id).getAttribute('index')));
	      				$('input'+$(id).getAttribute('index')).parentNode.removeChild($('input'+$(id).getAttribute('index')));
	      				n--;
	      				id = $('input'+n).id; 
	      				if(n>15)
	      				{
	      					$('input').style.height = n*37+'px';
		      				$('countline').style.height = n*37+'px';
		      				$('scrollbar').style.height = n*37+'px';
		      				$('preview').style.height = n*37+'px';
	      				}
	      			}
	      		}
	      		if (e.keyCode == 40) {
	      			if ($('input' + (parseInt($(id).getAttribute('index')) + 1))) {
	      				$('input' + (parseInt($(id).getAttribute('index')) + 1)).focus();
	      			}
	      		}
	      		if (e.keyCode == 38) {
	      			$('input' + (parseInt($(id).getAttribute('index'))-1)).focus();
	      		}
	      		if (($(id).value)&&(e.keyCode != 8)&&(e.keyCode != 13)) {
	      			if ($(id).value.length == parseInt($(id).getAttribute('maxlength'))) {
		      			addLine();
		      			$('input'+(parseInt($(id).getAttribute('index'))+1)).focus();
		      		}
	      		}
	      	}
	      }