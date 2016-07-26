#!/usr/bin/env python
# coding=utf-8

from flask import Flask,request,jsonify,render_template,session,redirect,url_for
import MySQLdb,os,sys

reload(sys)
sys.setdefaultencoding('utf-8')

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
                print publish
                if exist==1:
                    nickname=cur.fetchmany(cur.execute('select nickname from basicInfo where email=%s',(session['email'],)))[0][0]
                    a=cur.execute('update blog set published=%s where title=%s and author=%s',(1,title,nickname))
                    print 'a=',a
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
            return render_template('write.html',p=p)
        p={'title':'','category':'','text':''}
        return render_template('write.html',p=p)
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
        session['email']=email
        return redirect(url_for('home'))
    return render_template('signup.html')

@app.route('/home')
def home():
    if 'email' in session:
        conn=connect()
        cur=conn.cursor()
        nickname=cur.fetchmany(cur.execute('select nickname from basicInfo where email=%s',(session['email'],)))[0][0]
        title=request.args.get('title')
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
                text=cur.fetchmany(cur.execute('select text from blog where title=%s and author=%s',(title[0],nickname)))[0][0]
                comt=cur.execute('select * from comment where title=%s and author=%s',(title[0],nickname))
                time=cur.fetchmany(cur.execute('select createTime from blog where title=%s and author=%s',(title[0],nickname)))[0][0]
                category=cur.fetchmany(cur.execute('select category from blog where title=%s and author=%s',(title[0],nickname)))[0][0]
                ps.append({'title':title[0],'text':text,'comt':comt,'time':time,'category':category})
            cur.close()
            conn.close()
            return render_template('home.html',newPassTime=newTime,newPassTitle=newPassTitle,readt=readt,commentt=commentt,liket=liket,nickname=nickname,ps=ps)
        else:
            return render_template('home.html',nickname=nickname)
    else:
        return redirect(url_for('signin'))

@app.route('/set')
def set():
    return render_template('set.html')

@app.route('/warehouse')
def warehouse():
    if 'email' in session:
        conn=connect()
        cur=conn.cursor()
        nickname=cur.fetchmany(cur.execute('select nickname from basicInfo where email=%s',(session['email'],)))[0][0]
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
                print ps
            cur.close()
            conn.close()
        else:
            ps=[]
            cur.close()
            conn.close()
        return render_template('warehouse.html',nickname=nickname,ps=ps)
    return redirect(url_for('index'))

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
