#!/bin/bash
sudo cp /etc/network/interfaces.phone /etc/network/interfaces
sudo ifconfig wlan0 down
sudo sleep 30
sudo ifconfig wlan0 up
