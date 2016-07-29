#!/usr/bin/env python
# coding=utf-8

from flask import Flask,request,jsonify,render_template,session,redirect,url_for
from werkzeug import secure_filename
import MySQLdb,os,sys

reload(sys)
sys.setdefaultencoding('utf-8')

UPLOAD_FOLDER='static/pics/'
ALLOWED_EXTENSIONS=set(['txt','pdf','png','jpg','jpeg','gif'])

app = Flask(__name__)
app.secret_key=os.urandom(30)
app.config['UPLOAD_FOLDER']=UPLOAD_FOLDER

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
        #comment=None
        #comment=request.form['comment']
        #print comment
        if 'comment' in request.form:
            comment=request.form['comment']
            nickname=cur.fetchmany(cur.execute('select nickname from basicInfo where email=%s',(session['email'],)))[0][0]
            a=cur.execute('insert into comment(nickname,title,author,comment) values(%s,%s,%s,%s)',(nickname,title,author,comment))
            if a==1:
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

@app.route('/collection')
def collection():
    return render_template('collection.html')

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
            return render_template('write.html',p=p,imgPath=imgPath)
        p={'title':'','category':'','text':''}
        return render_template('write.html',p=p,imgPath=imgPath)
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
        if 'comment' in session:
            return jsonify({'comment':1})
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

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.',1)[1] in ALLOWED_EXTENSIONS

if __name__=='__main__':
    app.run(debug=True)
