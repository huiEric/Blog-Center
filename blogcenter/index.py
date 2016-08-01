#!/usr/bin/env python
# coding=utf-8

from blog import *

@app.route('/',methods=['POST','GET'])
def index():
    q=request.args.get('q')
    if q!=None:
        if 'email' in session:
            isLogin=1
        else:
            isLogin=0
        return jsonify({'isLogin':isLogin})
    if request.method=='POST':
        title=request.form['title']
        author=request.form['author']
        session['read']={'title':title,'author':author}
        return jsonify({'ok':1})
    passages=[]
    n=0
    conn=connect()
    cur=conn.cursor()
    a=cur.fetchmany(cur.execute('select * from blog order by readTimes desc'))
    for b in a:
        n+=1
        if n>10:
            break
        passages.append({'title':b[3],'readTimes':b[7],'commentTimes':b[8],'time':b[2],'author':b[4]})
    return render_template('index.html',passages=passages)
