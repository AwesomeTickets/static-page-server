#!/usr/bin/env python3
# -*- coding: utf-8 -*-

' Generate static webpage files '

import os
import sys
import shutil

usage_prompt = 'Usage: python3 pack.py <destination_path> [-H <hostname>]'

protocal = "http"
hostname = ''
host_path = os.path.join('scripts', 'host.js')
site_dir = 'site'

if (len(sys.argv) < 2):
    print(usage_prompt)
    sys.exit(0)
else:
    des_path = sys.argv[1] + site_dir
    for i, arg in enumerate(sys.argv[2:]):
        if (arg == '-H' and i + 3 < len(sys.argv)):
            hostname = protocal + '://' + sys.argv[i + 3]

if hostname != '':
    print("Hostname changed to '%s'" % hostname)
    host_file = open(host_path, 'w')
    host_file.write("window.global_url = '%s';" % hostname)
    host_file.close()

print("Gulp building...")
os.system("gulp clean --silent")
os.system("gulp build --silent")

print("Copying files to '%s'..." % des_path)
shutil.rmtree(des_path, ignore_errors=True)
shutil.copytree(site_dir, des_path)
print("Done.")
