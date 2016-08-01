#!/usr/bin/env python
# coding=utf-8

from blog import *

@app.route('/warehouse')
def warehouse():
    if 'email' in session:
        conn=connect()
        cur=conn.cursor()
        nickname=cur.fetchmany(cur.execute('select nickname from basicInfo where email=%s',(session['email'],)))[0][0]
        imgPath=cur.fetchmany(cur.execute('select imgPath from basicInfo where nickname=%s',(nickname,)))[0][0]
        imgPath=os.path.join(app.config['UPLOAD_FOLDER'],imgPath)
        title=request.args.get('title')
        if title!=None:
            delete=request.args.get('del')
            if delete!=None:
                a=cur.execute('delete from blog where title=%s and author=%s',(title,nickname))
                if a==1:
                    success=1
                else:
                    success=0
                cur.close()
                conn.commit()
                conn.close()
                return jsonify({'success':success})
            update=request.args.get('update')
            if update!=None:
                a=cur.execute('select * from blog where title=%s and author=%s',(title,nickname))
                if a!=0:
                    category=cur.fetchmany(cur.execute('select category from blog where title=%s and author=%s',(title,nickname)))[0][0]
                    text=cur.fetchmany(cur.execute('select text from blog where title=%s and author=%s',(title,nickname)))[0][0]
                    p={'title':title,'category':category,'text':text}
                    cur.execute('delete from blog where title=%s and author=%s',(title,nickname))
                    cur.close()
                    conn.commit()
                    conn.close()
                    session['p']=p
                    return jsonify({'success':1})
            a=cur.execute('update blog set published=%s where title=%s and author=%s',(1,title,nickname))
            if a==1:
                success=1
            else:
                success=0
            cur.close()
            conn.commit()
            conn.close()
            return jsonify({'success':success})
        a=cur.execute('select * from blog where author=%s',(nickname,))
        if a!=0:
            categories=cur.fetchmany(cur.execute('select distinct category from blog where author=%s',(nickname,)))
            ps=[]
            for category in categories:
                titles=cur.fetchmany(cur.execute('select title from blog where author=%s and category=%s order by createTime desc',(nickname,category[0])))
                passages=[]
                for title in titles:
                    text=cur.fetchmany(cur.execute('select text from blog where title=%s and author=%s',(title[0],nickname)))[0][0]
                    comt=cur.execute('select * from comment where title=%s and author=%s',(title[0],nickname))
                    time=cur.fetchmany(cur.execute('select createTime from blog where title=%s and author=%s',(title[0],nickname)))[0][0]
                    published=int(cur.fetchmany(cur.execute('select published from blog where title=%s and author=%s',(title[0],nickname)))[0][0])
                    passages.append({'title':title[0],'text':text,'comt':comt,'time':time,'published':published})
                ps.append({'category':category[0],'passages':passages})
            cur.close()
            conn.close()
        else:
            ps=[]
            cur.close()
            conn.close()
        return render_template('warehouse.html',nickname=nickname,ps=ps,imgPath=imgPath)
    return redirect(url_for('index'))
