#!/usr/bin/env python
# coding=utf-8

from blog import *

@app.route('/signin',methods=['POST','GET'])
def signin():
    if 'email' in session:
        return redirect(url_for('home'))
    nickname=request.args.get('nickname')
    passwd=request.args.get('passwd')
    if nickname!=None and passwd!=None:
        conn=connect()
        cur=conn.cursor()
        userNum=cur.execute('select * from basicInfo where nickname=%s',(nickname,))
        if userNum==0:
            error='用户不存在'
            return jsonify({'success':0,'error':error})
        elif cur.execute('select * from basicInfo where nickname=%s and passwd=%s',(nickname,passwd))==0:
            error='密码错误'
            cur.close()
            conn.close()
            return jsonify({'success':0,'error':error})
        email=cur.fetchmany(cur.execute('select email from basicInfo where nickname=%s',(nickname,)))[0][0]
        session['email']=email
        if 'comment' in session:
            return jsonify({'comment':1})
        return jsonify({'success':1})
    return render_template('signin.html')
