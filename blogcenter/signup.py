#!/usr/bin/env python
# coding=utf-8

from blog import *

@app.route('/signup',methods=['POST','GET'])
def signup():
    nickname=request.args.get('nickname')
    if nickname!=None:
        conn=connect()
        cur=conn.cursor()
        nickNum=cur.execute('select * from basicInfo where nickname=%s',(nickname,))
        if nickNum!=0:
            exist=1
        else:
            exist=0
        cur.close()
        conn.close()
        return jsonify({'exist':exist})
    email=request.args.get('email')
    if email!=None:
        conn=connect()
        cur=conn.cursor()
        emailNum=cur.execute('select * from basicInfo where email=%s',(email,))
        if emailNum!=0:
            exist=1
        else:
            exist=0
        cur.close()
        conn.close()
        return jsonify({'exist':exist})
    if request.method=='POST':
        email=request.form['email']
        nickname=request.form['nickname']
        passwd=request.form['passwd']
        conn=connect()
        cur=conn.cursor()
        cur.execute("insert into basicInfo(email,nickname,passwd) values(%s,%s,%s)",(email,nickname,passwd))
        cur.close()
        conn.commit()
        conn.close()
        session['email']=email
        return redirect(url_for('home'))
    return render_template('signup.html')
