#!/usr/bin/env python
# coding=utf-8

from blog import *

@app.route('/signin',methods=['POST','GET'])
def signin():
    #if request.method=='GET':
    if 'email' in session:
        return redirect(url_for('home'))
    email=request.args.get('email')
    passwd=request.args.get('passwd')
    if email!=None and passwd!=None:
        conn=connect()
        cur=conn.cursor()
        userNum=cur.execute('select * from basicInfo where email=%s',(email,))
        if userNum==0:
            error='用户不存在'
            return jsonify({'success':0,'error':error})
        elif cur.execute('select * from basicInfo where email=%s and passwd=%s',(email,passwd))==0:
            error='密码错误'
            cur.close()
            conn.close()
            return jsonify({'success':0,'error':error})
        session['email']=email
        if 'comment' in session:
            return jsonify({'comment':1})
        return jsonify({'success':1})
    return render_template('signin.html')
