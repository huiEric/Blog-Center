#!/usr/bin/env python
# coding=utf-8

from blog import *
from blog import connect

@app.route('/themes',methods=['POST','GET'])
def themes():
    conn=connect()
    cur=conn.cursor()
    if 'read' in session:
        read=session['read']
        session.pop('read',None)
        title=read['title']
        author=read['author']
        createTime=cur.fetchmany(cur.execute('select createTime from blog where title=%s and author=%s',(title,author)))[0][0]
        comment={'title':title,'author':author,'createTime':createTime}
        return render_template('themes.html',comment=comment)
    if request.method=='POST':
        title=request.form['title']
        author=request.form['author']
        if 'comment' in request.form:
            comment=request.form['comment']
            nickname=cur.fetchmany(cur.execute('select nickname from basicInfo where email=%s',(session['email'],)))[0][0]
            a=cur.execute('insert into comment(nickname,title,author,comment) values(%s,%s,%s,%s)',(nickname,title,author,comment))
            if a!=0:
                commentTimes=int(cur.fetchmany(cur.execute('select commentTimes from blog where title=%s and author=%s',(title,author)))[0][0])
                cur.execute('update blog set commentTimes=%s where title=%s and author=%s',(commentTimes+1,title,author))
                commentTime=cur.fetchmany(cur.execute('select distinct commentTime from comment where comment=%s and nickname=%s and title=%s and author=%s',(comment,nickname,title,author)))[0][0]
                success=1
            else:
                success=0
            cur.close()
            conn.commit()
            conn.close()
            return jsonify({'success':success,'commentor':nickname,'comment':comment,'commentTime':commentTime})
        readTimes=cur.fetchmany(cur.execute('select readTimes from blog where title=%s and author=%s',(title,author)))[0][0]
        cur.execute('update blog set readTimes=%s where title=%s and author=%s',(int(readTimes)+1,title,author))
        a=cur.fetchmany(cur.execute('select * from blog where author=%s and title=%s',(author,title)))[0]
        text=a[1]
        category=a[5]
        createTime=cur.fetchmany(cur.execute('select createTime from blog where title=%s and author=%s',(title,author)))[0][0]
        readTimes=a[7]
        commentTimes=a[8]
        comments=[]
        a=cur.fetchmany(cur.execute('select * from comment where title=%s and author=%s order by commentTime',(title,author)))
        for b in a:
            comments.append({'commentor':b[1],'comment':b[4],'commentTime':b[5]})
        if 'email' not in session:
            session['comment']={'title':title,'author':author,'createTime':createTime}
            login=0
        else:
            login=1
        cur.close()
        conn.commit()
        conn.close()
        return jsonify({'text':'哈哈哈'})
        return jsonify({'login':login,'text':text,'category':category,'createTime':createTime,'readTimes':readTimes,'commentTimes':commentTimes,'comments':comments})
    if ('comment' in session) and ('email' in session):
        comment=session['comment']
        session.pop('comment',None)
        return render_template('themes.html',comment=comment)
    a=cur.execute('select * from blog')
    if a!=0:
        categories=cur.fetchmany(cur.execute('select distinct category from blog'))
        ps=[]
        for category in categories:
            passages=[]
            c=cur.execute('select * from blog where category=%s and published=1',(category[0],))
            if c==0:
                continue
            b=cur.fetchmany(cur.execute('select * from blog where category=%s and published=1 order by readTimes desc',(category[0],)))
            n=0
            for p in b:
                n+=1
                if n>10:
                    break
                title=p[3]
                author=p[4]
                time=p[2]
                readTimes=p[7]
                commentTimes=p[8]
                passages.append({'title':title,'author':author,'readTimes':readTimes,'commentTimes':commentTimes,'time':time})
            ps.append({'category':category[0],'passages':passages})
        cur.close()
        conn.close()
    else:
        ps=[]
        cur.close()
        conn.close()
    return render_template('themes.html',ps=ps)
