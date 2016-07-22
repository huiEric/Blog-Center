function displaySubMenu(subMenu) {
	subMenu.style.display = "block";
}
function hideSubMenu(subMenu) {
	subMenu.style.display = "none";
}
var $ = function(id){
	return document.getElementById(id);
}
function underline(id){
	$('friend').style.borderBottomColor = "#d9d9d9";
	$('collect').style. 	borderBottomColor = "#d9d9d9";
	$(id).style.borderBottom = "2px solid #555555"
}