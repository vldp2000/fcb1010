#!/bin/sh
 
echo "stop unwanted processes!"

sudo launchctl kill -TERM gui/$UID/com.apple.photoanalysisd
sudo launchctl disable gui/$UID/com.apple.photoanalysisd
sudo launchctl kill -TERM gui/$UID/com.apple.photoanalysisd
sudo mdutil -a -i off




#aunchctl enable gui/$UID/com.apple.photoanalysisd
#sudo mdutil -a -i on