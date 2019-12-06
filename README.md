# fcb1010

I'm playing the guitan in a band using the applications on iPad an MacBook as guitar processors.

the are few types of applications used:
  1. Guitar processors to modify the sound of guitar
  2. Guitar-to-MIDI to convert the notes played on guitar into MIDI signals
  3. Synth applications
  ese
I have modified the FCB1010 foot MIDI controller to be able to send the MIDI wireless signals 
to iPad and to MacBook. There is the RaspberryPi computer integrated into it which receives the wired MIDI signal,
convert them into PC and CC MIDI signals by the Python application I wrote and broadcasts them via WiFi.


The current solution has a limitation related to the way the guitar presets are selected for the specific songs.

There is no simle way to combine the songs into a new gig songs list with the easy to reorder way of doing it.


The songs and presets are recorderd into JSON file.

I would like to change the whole way of setting and using the FCB1010 MIDI foot controller.


All the data will be saved into a SQLITE database with the following structure

Tables:
1.Instrument
  
2.PresetBank

3.Preset

4.Song

5.SongPreset

6.Gig

7.GigSong


I need to build two main applications:

1. Maintenance Application
2. Live Gig COntrol Application


Live Gig Control Application (LGCA) should allow to select a gig from the list of gigs 

The songs recorded into gig list will be loaded from the database

Each song to have 4 programms

Each program can have up to 4 presets for 4 instruments specified

Each preset to have etra parameters for 

  - Volume
  - Panorama
  - Delay On/Off
  - Revereb On/Off 
  - Mode On/Off
  - Mute/Unmute Flag 

