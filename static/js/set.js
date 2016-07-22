function displaySubMenu(subMenu) {
	subMenu.style.display = "block";
}
function hideSubMenu(subMenu) {
	subMenu.style.display = "none";
}
var $ = function(id){
	return document.getElementById(id);
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