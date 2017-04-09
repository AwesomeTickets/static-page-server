#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os, sys

if (len(sys.argv) == 1):
    print("Usage: 'python3 deploy.py <server_path>'")
else:
    path = sys.argv[1] + "src/main/webapp"
    filename = "tmp.tar.gz"
    os.system("tar -zcvf %s tmp/" % filename)
    os.system("mv tmp.tar.gz %s" % path)
    os.system("tar -zxvf %s/%s --directory=%s --strip-components 1" % (path, filename, path))
    os.system("rm %s/%s" % (path, filename))
    os.system("mv %s/index.html %s/WEB-INF/templates/tickets.html" % (path, path))
