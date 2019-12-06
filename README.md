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

Those apps as well as few other apps and API will be hosted on Raspberrypi


Live Gig Control Application (LGCA) should allow to select a gig from the list of gigs 

The songs recorded into gig list will be loaded from the database

Each song to have 4 programs

Each program can have up to 4 presets for 4 instruments specified

Each preset to have extra parameters for 

  - Volume
  - Panorama
  - Delay On/Off
  - Revereb On/Off 
  - Mode On/Off
  - Mute/Unmute Flag 

See the Image of FCB1010 in the list of files

- pedals 6, 7, 8, 9 send the command about the program change within the selected song
- pedals 5, 10 send the commands to change the current song
- pedals 1,2,3,4 are reserved for changing the parameters of the currently selected presets
- pedals UP, DOWN allow to switch between the GIGS . there are 7 banks reserver for 7 gig.

The current bank number is displayd on FCB1010 2 digit monitor 

In fact those pedals are programmed to send the predefind MIDI ControlChange messages to Python application running on RaspberryPi

The Python application needs to know the rules how to convert those messages into required MIDI messages

The LGCA should provide the following info to a user:

- show currnt gig
- show current song
- show current program
- show list of presets for the selected program
- show parameters for each preset

As soon as anything is changed in python controller app the LGCA has to reflect the change

User should be able to control the pythin controller using the GUI provided by LGCA

 -------------------------------------------------------------------------------------------------------------------
 
 Maintenance Application (MA)
 
 The MA has to provide the tools for managing all the maintenace DB tables
and build the configuration for the Songs and Gigs
