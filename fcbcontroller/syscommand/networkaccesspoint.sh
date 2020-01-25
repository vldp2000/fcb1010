#!/bin/bash
sudo cp /home/pi/midicontrol/syscommand/interfaces.ap /etc/network/interfaces
sudo cp /home/pi/midicontrol/syscommand/dhcpcd.conf.ap /etc/dhcpcd.conf
sudo cp /home/pi/midicontrol/syscommand/wpa_supplicant.conf.ap /etc/wpa_supplicant/wpa_supplicant.conf

sudo ifconfig wlan0 down
sudo sleep 30
sudo ifconfig wlan0 up
sudo reboot