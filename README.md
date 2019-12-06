# fcb1010

I'm playing the guitan in a band using the applications on iPad an MacBook as guitar processors.

the are few types of applications used:
  1. Guitar processors to modify the sound of guitar
  2. Guitar-to-MIDI to convert the notes played on guitar into MIDI signals
  3. Synth applications
  
I have modified the FCB1010 foot MIDI controller to be able to send the MIDI wireless signals 
to iPad and to MacBook. There is the RaspberryPi computer integrated into it which receives the wired MIDI signal,
convert them into PC and CC MIDI signals by the Python application I wrote and broadcasts them via WiFi.


The current solution has a limitation related to 
