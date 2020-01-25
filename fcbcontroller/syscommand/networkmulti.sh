#!/bin/bash
sudo cp /home/pi/midicontrol/syscommand/interfaces.vpnet /etc/network/interfaces
sudo cp /home/pi/midicontrol/syscommand/wpa_supplicant.conf.vpnet /etc/wpa_supplicant/wpa_supplicant.conf
sudo cp /home/pi/midicontrol/syscommand/dhcpcd.conf.vpnet /etc/dhcpcd.conf

sudo ifconfig wlan0 down
sudo sleep 30
sudo ifconfig wlan0 up
sudo reboot
