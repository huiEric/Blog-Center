#!/usr/bin/env python
# coding=utf-8

from blog import *

@app.route('/home',methods=['POST','GET'])
def home():
    if 'email' in session:
        conn=connect()
        cur=conn.cursor()
        nickname=cur.fetchmany(cur.execute('select nickname from basicInfo where email=%s',(session['email'],)))[0][0]
        intro=cur.fetchmany(cur.execute('select intro from basicInfo where nickname=%s',(nickname,)))[0][0]
        imgPath=cur.fetchmany(cur.execute('select imgPath from basicInfo where nickname=%s',(nickname,)))[0][0]
        imgPath=os.path.join(app.config['UPLOAD_FOLDER'],imgPath)
        title=request.args.get('title')
        if request.method=='POST':
            nickname=request.form['nickname']
            intro=request.form['intro']
            cur.execute('update basicInfo set nickname=%s where email=%s',(nickname,session['email'],))
            cur.execute('update basicInfo set intro=%s where email=%s',(intro,session['email']))
            cur.close()
            conn.commit()
            conn.close()
            return jsonify({'success':1})
        if title!=None:
            a=cur.execute('update blog set published=0 where title=%s and author=%s',(title,nickname))
            if a==1:
                success=1
            else:
                success=0
            cur.close()
            conn.commit()
            conn.close()
            return jsonify({'success':success})
        a=cur.execute('select createTime from blog where author=%s and published=1',(nickname,))
        if a!=0:
            newTime=cur.fetchmany(cur.execute('select createTime from blog where author=%s and published=1 order by createTime desc',(nickname,)))[0][0]
            newPassTitle=cur.fetchmany(cur.execute('select title from blog where createTime=%s',(newTime,)))[0][0]
            readt=cur.execute('select * from readInfo where author=%s and title=%s',(nickname,newPassTitle))
            commentt=cur.execute('select * from comment where author=%s and title=%s',(nickname,newPassTitle))
            liket=cur.execute('select * from likeInfo where author=%s and title=%s',(nickname,newPassTitle))
            titles=cur.fetchmany(cur.execute('select title from blog where author=%s and published=1 order by createTime desc',(nickname,)))
            ps=[]
            for title in titles:
                comments=[]
                b=cur.fetchmany(cur.execute('select * from comment where title=%s and author=%s order by commentTime desc',(title[0],nickname)))
                for c in b:
                    comments.append({'commentor':c[1],'commentTime':c[5],'comment':c[4]})
                text=cur.fetchmany(cur.execute('select text from blog where title=%s and author=%s',(title[0],nickname)))[0][0]
                comt=cur.execute('select * from comment where title=%s and author=%s',(title[0],nickname))
                time=cur.fetchmany(cur.execute('select createTime from blog where title=%s and author=%s',(title[0],nickname)))[0][0]
                category=cur.fetchmany(cur.execute('select category from blog where title=%s and author=%s',(title[0],nickname)))[0][0]
                ps.append({'title':title[0],'text':text,'comt':comt,'time':time,'category':category,'comments':comments})
            cur.close()
            conn.close()
            return render_template('home.html',newPassTime=newTime,newPassTitle=newPassTitle,readt=readt,commentt=commentt,liket=liket,nickname=nickname,ps=ps,imgPath=imgPath,intro=intro)
        else:
            return render_template('home.html',nickname=nickname,imgPath=imgPath,intro=intro)
    else:
        return redirect(url_for('signin'))
