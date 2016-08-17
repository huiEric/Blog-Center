#!/usr/bin/env python
# coding=utf-8

from blog import *

@app.route('/write',methods=['GET','POST'])
def write():
    if 'email' in session:
        conn=connect()
        cur=conn.cursor()
        imgPath=cur.fetchmany(cur.execute('select imgPath from basicInfo where email=%s',(session['email'],)))[0][0]
        imgPath=os.path.join(app.config['UPLOAD_FOLDER'],imgPath)
        if request.method=='POST':
            nickname=cur.fetchmany(cur.execute('select nickname from basicInfo where email=%s',(session['email'],)))[0][0]
            title=request.form['title']
            category=request.form['category']
            text=request.form['text']
            publish=request.form['publish']
            if publish=='0':
                a=cur.execute("insert into blog(title,category,author,text) values(%s,%s,%s,%s)",(title,category,nickname,text))
            else:
                a=cur.execute('insert into blog(title,category,author,text,published) values(%s,%s,%s,%s,%s)',(title,category,nickname,text,1))
            if a==1:
                success=1
            else:
                success=0
            cur.close()
            conn.commit()
            conn.close()
            return jsonify({'success':success})
        title=request.args.get('title')
        publish=request.args.get('publish')
        if title!=None:
            conn=connect()
            cur=conn.cursor()
            titleNum=cur.execute('select * from blog where title=%s',(title,))
            if titleNum==0:
                exist=0
            else:
                exist=1
            if publish=='1':
                if exist==1:
                    nickname=cur.fetchmany(cur.execute('select nickname from basicInfo where email=%s',(session['email'],)))[0][0]
                    a=cur.execute('update blog set published=%s where title=%s and author=%s',(1,title,nickname))
                    if a==1:
                        cur.close()
                        conn.commit()
                        conn.close()
                        return jsonify({'published':1})
                    else:
                        cur.close()
                        conn.close()
                        return jsonify({'published':0})
                else:
                    cur.close()
                    conn.close()
                    return jsonify({'published':0})
            cur.close()
            conn.close()
            return jsonify({'exist':exist})
        if 'p' in session:
            p=session['p']
            session.pop('p',None)
            return render_template('write.html',p=p,imgPath=imgPath)
        p={'title':'','category':'','text':''}
        return render_template('write.html',p=p,imgPath=imgPath)
    else:
        return redirect(url_for('index'))
