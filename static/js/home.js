function displaySubMenu(subMenu) {
	subMenu.style.display = "block";
}
function hideSubMenu(subMenu) {
	subMenu.style.display = "none";
}
var $ = function(id){
	return document.getElementById(id);
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
	var summit = document.createElement('a');
	$('edit').appendChild(summit);
	summit.href = "javascript:void(0)";
	summit.innerHTML = "保存";
	summit.id = "summit";
	summit.onclick = function onclick(event){
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
	var cancel = document.createElement('a');
	$('edit').appendChild(cancel);
	cancel.href = "javascript:void(0)";
	cancel.innerHTML = "取消";
	cancel.id = "cancel";
	cancel.onclick = summit.onclick;
}
function underline(id){
	$('new').style.borderBottomColor = "#ddd";
	$('state').style.borderBottomColor = "#ddd";
	$('hot').style.borderBottomColor = "#ddd";
	$(id).style.borderBottom = "2px solid #555555";
}