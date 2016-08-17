#!/usr/bin/env python
# coding=utf-8

import logging; logging.basicConfig(level=logging.INFO)

from flask import Flask,request,jsonify,render_template,session,redirect,url_for
from werkzeug import secure_filename
import MySQLdb,os,sys

reload(sys)
sys.setdefaultencoding('utf-8')

UPLOAD_FOLDER='static/pics/'
ALLOWED_EXTENSIONS=set(['txt','pdf','png','jpg','jpeg','gif'])

app = Flask(__name__)
app.debug = True
app.secret_key = os.urandom(30)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/logout')
def logout():
    session.pop('email',None)
    return redirect(url_for('index'))

def connect(charset = 'utf8'):
    host = 'localhost'
    port = 3306
    user = 'root'
    passwd = 'zjh2416256hg'
    db = 'blogcenter'
    conn=MySQLdb.connect(host=host,port=port,user=user,passwd=passwd,db=db)
    cur=conn.cursor()
    conn.set_character_set('utf8')
    cur.execute('set names utf8;')
    cur.execute('set character set utf8;')
    cur.execute('set character_set_connection=utf8;')
    return conn

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.',1)[1] in ALLOWED_EXTENSIONS


from blogcenter.index import *
from blogcenter.themes import *
from blogcenter.signin import *
from blogcenter.signup import *
from blogcenter.write import *
from blogcenter.home import *
from blogcenter.warehouse import *
from blogcenter.set import *

if __name__ == '__main__':
    app.run()
