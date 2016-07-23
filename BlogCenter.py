#!/usr/bin/env python
# coding=utf-8

from flask import Flask,request 
import MySQLdb
from flask import render_template
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/themes')
def themes():
    return render_template('themes.html')

@app.route('/collection')
def collection():
    return render_template('collection.html')

@app.route('/write')
def write():
    return render_template('write.html')

@app.route('/signin',methods=['POST','GET'])
def signin():
    if request.method=='POST':
        email=request.form['email']
        passwd=request.form['passwd']

    return render_template('signin.html')

@app.route('/signup',methods=['POST','GET'])
def signup():
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
        return render_template('write.html')
    return render_template('signup.html')

@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/set')
def set():
    return render_template('set.html')

@app.route('/logout')
def logout():
    return render_template('index.html')

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
