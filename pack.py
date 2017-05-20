#!/usr/bin/env python3
# -*- coding: utf-8 -*-

' Generate static webpage files '

import os
import sys

usage_prompt = '''Usage:
python3 pack.py
python3 pack.py -H <hostname>
python3 pack.py { ? | -h | --help }'''

protocal = "http"
hostname = 'localhost'
filename_host = os.path.join('scripts', 'host.js')

dir_site = 'site'
filename_pkg = dir_site + '.tar.gz'

for i, arg in enumerate(sys.argv[1:]):
    if (arg == '?' or arg == '-h' or arg == '--help'):
        print(usage_prompt)
        sys.exit(0)
    elif (arg == '-H' and i + 2 < len(sys.argv)):
        hostname = sys.argv[i + 2]

hostname = protocal + '://' + hostname

print("Hostname set to '%s'" % hostname)
host_file = open(filename_host, 'w')
host_file.write("var hostname = '%s'" % hostname)
host_file.close()

print("Gulp building...")
os.system("gulp clean --silent")
os.system("gulp build --silent")

print("Compressing...")
os.system("tar -zcf %s %s" % (filename_pkg, dir_site))

print("Files saved to '%s'" % filename_pkg)
