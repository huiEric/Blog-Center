#!/usr/bin/env python
# coding=utf-8

import os, re
from datetime import datetime

from fabric.api import *

env.user = 'ubuntu'
env.sudo_user = 'root'
env.hosts = ['123.207.230.108']

db_user = 'root'
db_password = 'zjh2416256hg'

_TAR_FILE = 'dist-BlogCenter.tar.gz'

def build():
    includes = ['static', 'templates', 'transwrap', 'favicon.ico','*.py']
    excludes = ['test', '.*', '*.pyc','*.pyo']
    local('rm -f dist/%s' %_TAR_FILE)
    with lcd(os.path.join(os.path.abspath('.'),'www')):
        cmd = ['tar', '--dereference', '-czvf', '../dist/%s' %_TAR_FILE]
        cmd.extend(['--exclude=\'%s\'' % ex for ex in excludes])
        cmd.extend(includes)
        local(' '.join(cmd))


_REMOTE_TMP_TAR = '/tmp/%s' %_TAR_FILE
_REMOTE_BASE_DIR = '/srv/BlogCenter'

def deploy():
    newdir = 'www-%s' %datetime.now().shrftime('%y-%m-%d_%H.%M.%S')
    run('rm -f %s' %_REMOTE_TMP_TAR)
    put('dist/%s' %_TAR_FILE, _REMOTE_TMP_TAR)
    with cd(_REMOTE_BASE_DIR):
        sudo('mkdir %s' %newdir)
    with cd('%s/%s' %(_REMOTE_BASE_DIR, newdir)):
        sudo('tar -xzvf %s' %_REMOTE_TMP_TAR)
    with cd(_REMOTE_BASE_DIR):
        sudo('rm -f www')
        sudo('ln -s %s www' %newdir)
        sudo('chown root:root www')
        sudo('chown -R root:root %s' %newdir)
    with settings(warn_only=True):
        sudo('supervisorctl stop blogcenter')
        sudo('supervisorctl start blogcenter')
        sudo('/etc/init.d/nginx reload')
