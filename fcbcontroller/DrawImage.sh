#!/bin/sh
# launcher.sh
# navigate to home directory, then to this directory, then execute python script, then back home

cd /
cd /home/pi/fcb1010/fcbcontroller/
sudo python3 displayImage.py
cd /