#!/usr/bin/env python
# coding=utf-8

from flask import Flask,request,jsonify,render_template,session,redirect,url_for
#from werkzeug import secure_filename
import MySQLdb,os,sys

reload(sys)
sys.setdefaultencoding('utf-8')

UPLOAD_FOLDER='static/pics/'
ALLOWED_EXTENSIONS=set(['txt','pdf','png','jpg','jpeg','gif'])

app = Flask(__name__)
app.secret_key=os.urandom(30)
app.config['UPLOAD_FOLDER']=UPLOAD_FOLDER

from sae.const import (MYSQL_HOST, MYSQL_HOST_S,
    MYSQL_PORT, MYSQL_USER, MYSQL_PASS, MYSQL_DB
) 

@app.route('/logout')
def logout():
    session.pop('email',None)
    return redirect(url_for('index'))

def connect(host=MYSQL_HOST,port=int(MYSQL_PORT),user=MYSQL_USER,passwd=MYSQL_PASS,db=MYSQL_DB,charset='utf8'):
    conn=MySQLdb.connect(host=host,port=port,user=user,passwd=passwd,db=db)
    cur=conn.cursor()
    conn.set_character_set('utf8')
    cur.execute('set names utf8;')
    cur.execute('set character set utf8;')
    cur.execute('set character_set_connection=utf8;')
    return conn

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.',1)[1] in ALLOWED_EXTENSIONS

from index import *
from themes import *
from signin import *
from signup import *
from write import *
from home import *
from warehouse import *
from set import *

