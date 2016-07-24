#!/usr/bin/env python
# coding=utf-8

from flask import Flask,request,jsonify,render_template,session,redirect,url_for
import MySQLdb,os
app = Flask(__name__)
app.secret_key=os.urandom(30)

@app.route('/')
def index():
    q=request.args.get('q')
    if q!=None:
        if 'email' in session:
            isLogin=1
        else:
            isLogin=0
        return jsonify({'isLogin':isLogin})
    return render_template('index.html')

@app.route('/themes')
def themes():
    return render_template('themes.html')

@app.route('/collection')
def collection():
    return render_template('collection.html')

@app.route('/write',methods=['GET','POST'])
def write():
    if 'email' in session:
        if request.method=='POST':
            conn=connect()
            cur=conn.cursor()
            nickname=cur.fetchmany(cur.execute('select nickname from basicInfo where email=%s',(session['email'],)))[0][0]
            title=request.form['title']
            category=request.form['category']
            text=request.form['text']
            print title,category,text
            a=cur.execute("insert into blog(title,category,author,text) values(%s,%s,%s,%s)",(title,category,nickname,text))
            if a==1:
                success=1
            else:
                success=0
            cur.close()
            conn.commit()
            conn.close()
            return jsonify({'success':success})
        title=request.args.get('title')
        if title!=None:
            conn=connect()
            cur=conn.cursor()
            titleNum=cur.execute('select * from blog where title=%s',(title,))
            if titleNum==0:
                exist=0
            else:
                exist=1
            return jsonify({'exist':exist})
        return render_template('write.html')
    else:
        return redirect(url_for('index'))

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
        return jsonify({'success':1})
    return render_template('signin.html')

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
        return render_template('home.html')
   
    return render_template('signup.html')

@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/set')
def set():
    return render_template('set.html')

@app.route('/logout')
def logout():
    session.pop('email',None)
    return redirect(url_for('index'))

def connect(host='localhost',port=5000,user='root',passwd='zjh2416256hg',db='blogcenter',charset='utf8'):
    conn=MySQLdb.connect(host=host,port=port,user=user,passwd=passwd,db=db)
    cur=conn.cursor()
    conn.set_character_set('utf8')
    cur.execute('set names utf8;')
    cur.execute('set character set utf8;')
    cur.execute('set character_set_connection=utf8;')
    return conn

if __name__=='__main__':
    app.run(debug=True)
