#!/usr/bin/env python
# coding=utf-8

from blog import *

@app.route('/set',methods=['POST','GET'])
def set():
    if 'email' in session:
        conn=connect()
        cur=conn.cursor()
        email=session['email']
        imgPath=cur.fetchmany(cur.execute('select imgPath from basicInfo where email=%s',(email,)))[0][0]
        imgPath=os.path.join(app.config['UPLOAD_FOLDER'],imgPath)
        nickname=cur.fetchmany(cur.execute('select nickname from basicInfo where email=%s',(email,)))[0][0]
        intro=cur.fetchmany(cur.execute('select intro from basicInfo where nickname=%s',(nickname,)))[0][0]
        if request.method=='POST':
            if 'passwd' in request.form:
                passwd=request.form['passwd']
                a=cur.execute('select * from basicInfo where email=%s and passwd=%s',(session['email'],passwd))
                if a==1:
                    correct=1
                else:
                    correct=0
                return jsonify({'correct':correct})
            if 'newPasswd' in request.form:
                newPasswd=request.form['newPasswd']
                a=cur.execute('update basicInfo set passwd=%s where email=%s',(newPasswd,email))
                if a==1:
                    success=1
                else:
                    success=0
                cur.close()
                conn.commit()
                conn.close()
                return jsonify({'success':success})
            if 'intro' in request.form:
                intro=request.form['intro']
                a=cur.execute('update basicInfo set intro=%s where nickname=%s',(intro,nickname))
                cur.close()
                conn.commit()
                conn.close()
                return jsonify({'success':1})
            if 'upload' in request.files:
                file=request.files['upload']
                if file and allowed_file(file.filename):
                    filename=secure_filename(file.filename)
                    file.save(os.path.join(app.config['UPLOAD_FOLDER'],filename))
                    cur.execute('update basicInfo set imgPath=%s where email=%s',(filename,email))
                    cur.close()
                    conn.commit()
                    conn.close()
                    return redirect(url_for('set'))
            nickname=request.form['nickname']
            tel=request.form['tel']
            a=cur.execute('update basicInfo set nickname=%s where email=%s',(nickname,session['email']))
            b=cur.execute('update basicInfo set tel=%s where email=%s',(tel,session['email']))
            success=1
            cur.close()
            conn.commit()
            conn.close()
            return jsonify({'success':success})
        tel=cur.fetchmany(cur.execute('select tel from basicInfo where email=%s',(email,)))[0][0]
        if tel!=None:
            return render_template('set.html',email=email,nickname=nickname,tel=tel,imgPath=imgPath,intro=intro)
        return render_template('set.html',email=email,nickname=nickname,imgPath=imgPath,intro=intro)
    else:
        return redirect(url_for('signin'))
