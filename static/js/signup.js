var get = function(id){
	return document.getElementById(id);
}
function isEmailValid(email){
	var pattern = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/; 
	if (!pattern.test(email)) {  
        return false;  
    }  
    return true; 
}
function checkEmail(id){
	email = get(id).value;
	get('correct1').style.display = 'none';
	get('error1').style.display = 'none';
	if (isEmailValid(email)) {
		get('correct1').style.display = 'inline';
		get('username').focus();
	}
	else{
		get('error1').style.display = 'inline';
	}
}
function checkNickname(id){
	nickname = get(id).value;
	get('error2').style.display = 'none';
	get('correct2').style.display = 'none';
	if(nickname == ''||(/^[ ]+$/.test(nickname))){
		get('error2').style.display = 'inline';
	}
	else{
		get('correct2').style.display = 'inline';
		get('passwd').focus();
	}
}
//判断输入密码的类型  
function CharMode(iN){  
if (iN>=48 && iN <=57) //数字  
return 1;  
if (iN>=65 && iN <=90) //大写  
return 2;  
if (iN>=97 && iN <=122) //小写  
return 4;  
else  
return 8;   
}  
//bitTotal函数  
//计算密码模式  
function bitTotal(num){  
modes=0;  
for (i=0;i<4;i++){  
if (num & 1) modes++;  
num>>>=1;  
}  
return modes;  
}  
//返回强度级别  
function checkStrong(sPW){  
if (sPW.length<=4)  
return 0; //密码太短  
Modes=0;  
for (i=0;i<sPW.length;i++){  
//密码模式  
Modes|=CharMode(sPW.charCodeAt(i));  
}  
return bitTotal(Modes);  
}  
  
//显示颜色  
function pwStrength(pwd){  
O_color="white";  
L_color="#ff9c3a";  
M_color="#61d01c";  
H_color="#61d01c";  
get('char').innerHTML='';
if (pwd==null||pwd==''){  
Lcolor=Mcolor=Hcolor=O_color;  
get('strength_L').style.borderColor=get('strength_M').style.borderColor=get('strength_H').style.borderColor=O_color;
}  
else{  
S_level=checkStrong(pwd);  
switch(S_level) {  
case 0:  
Lcolor=Mcolor=Hcolor=O_color;  
case 1:  
Lcolor=L_color;  
Mcolor=Hcolor=O_color;  
get('strength_L').style.borderColor=get('strength_M').style.borderColor=get('strength_H').style.borderColor=get('char').style.color=Lcolor;
get('char').innerHTML='弱';
break;  
case 2:  
Lcolor=Mcolor=M_color;  
Hcolor=O_color;  
get('char').innerHTML='中';
get('strength_L').style.borderColor=get('strength_M').style.borderColor=get('strength_H').style.borderColor=get('char').style.color=Mcolor;
break;  
default:  
Lcolor=Mcolor=Hcolor=H_color;  
get('char').innerHTML='强';
get('strength_L').style.borderColor=get('strength_M').style.borderColor=get('strength_H').style.borderColor=get('char').style.color=Hcolor;
}  
}  
document.getElementById("strength_L").style.background=Lcolor;  
document.getElementById("strength_M").style.background=Mcolor;  
document.getElementById("strength_H").style.background=Hcolor;  
return;  
}  
function summit(){
	get('form').submit();
}