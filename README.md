# fcb1010

I'm playing the guitar in a band using the applications on iPad an MacBook as guitar processors.

The are few types of applications used:
  1. Guitar processors to modify the sound of guitar
  2. Guitar-to-MIDI to convert the notes played on guitar into MIDI signals
  3. Synth applications to play the MIDI note received from Guitar-to-MIDI with the sounds of different music instruments.

I have modified the FCB1010 foot MIDI controller to be able to send the MIDI wireless signals 
to iPad and to MacBook. 

There is the RaspberryPi computer integrated into it which does the following:
  1. Receives the wired MIDI signal from pedals,
  2. Converts them into PC (Program Change) and CC (Control Change) MIDI signals. 
It's all done y the Python application I wrote (Python MIDI Controller app)

The Python MIDI Controller sends the MIDI messages, they are picked by ReveloxMidi 
(thanks to Dave Kelly https://github.com/ravelox/pimidi)
ReveloxMidi broadcasts the MIDI messages via WiFi. 
All the devices have to be connected to the same WiFi network to be able to connect to ReveloxMidi broadcasts service.

### Issues with the current solution
The current solution has a limitation related to the way the guitar presets are selected for the specific songs.
There is no simple way to combine the songs into a new gig songs list with the easy to reorder way of doing it.
The songs and presets are recorderd into JSON file.


# New Functionality

I would like to change the whole way of setting and using the FCB1010 MIDI foot controller.

## Solution Diagram
![FCB1010 Solution Diagram](/fcb1010_SolutionDiagram.png)

All the data will be saved into a SQLITE database with the following structure

### Tables:
  1. Instrument
  2. InstrumentBank
  3. Preset
  4. Song
  5. SongProgram
  6. SongProgramPreset
  7. Gig
  8. GigSong


I need to build two main applications:
 1. Maintenance Application
 2. Live Gig COntrol Application

Those apps as well as few other apps and API will be hosted on Raspberrypi


## Live Gig Control Application (LGCA)

Live Gig Control Application  should allow to select a gig from the list of gigs 

The songs recorded into gig list will be loaded from the database

Each song to have 4 programs

Each program can have up to 4 presets for 4 instruments specified

Each preset selected for a Song to have extra parameters for 
  - Volume
  - Panorama
  - Delay On/Off
  - Revereb On/Off 
  - Mode On/Off
  - Mute/Unmute Flag 

See the Image of FCB1010 in the list of files "fcb1010.png"

![FCB1010](/fcb1010.png)
Format: ![Alt Text](url)

FCB1010 pedal usage:
 - pedals 6, 7, 8, 9 send the command about the program change within the selected song
 - pedals 5, 10 send the commands to change the current song
 - pedals 1,2,3,4 are reserved for changing the parameters of the currently selected presets
 - pedals UP, DOWN allow to switch between the GIGS . there are 7 banks reserver for 7 gig.

The current bank number is displayd on FCB1010 2 digit monitor 

In fact all those pedals are programmed to send the predefind MIDI ControlChange messages to Python application running on RaspberryPi
(UP, DOWN pedals do net send any MIDI message)

The Python application needs to know the rules how to convert those pedal messages into required MIDI messages


The LGCA should provide the following info to a user:

 - show currnt gig
 - show current song
 - show current program
 - show list of presets for the selected program
 - show parameters for each preset

On one hand As soon as anything is changed in python controller app the LGCA has to reflect the change
On another hand User should be able to control the python controller using the GUI provided by LGCA
It means the LGCA and python MIDI controller have to be always in sync


Whould be nice to have the graphical user controls similar to what is used by MidiDesigner (see mididesigner_example.jpg)
It can be achieved by using the gauge components)

see the examples:
 
  https://www.jqwidgets.com/vue/vue-gauge/#https://www.jqwidgets.com/vue/vue-gauge/vue-gauge-lineargauge.htm
  https://hellocomet.github.io/vue-svg-gauge/
  https://www.vuescript.com/svg-gauge-component-for-vue-js/


### Problems to be resolved :

  1. Implement the communication between the Vue.js web application and Python MIDI Controller.
     Options: 
        - Use SignalR to send messages from  Python MIDI Controller to Vue client
        - Use MIDI messages:  Vue-idi-plugin  https://www.npmjs.com/package/vue-midi     



## Maintenance Application (MA)


 1. MA has to provide tools for managing all the maintenace DB tables
  - **Instrument**
  - **InstrumentBank**
  - **Preset**

 2. Configure Songs
  - **Song.**
    When new song created add four SongProgram records with names set to "A", "B", "C", "D"  automatically
    It has to be a config file which defines the number of defauls SongProgram and their names
  - **SongProgram.**
    When new SongProgram record created add four SongProgramPreset records (one foreach Instrument). 
    Use Instrument->InstrumentBank->Preset records where Preset.IsDefault=1 
    There must be one single preset only with Preset.IsDefault=1 for any existing Instrument
  - **SongProgramPreset**
 3. Set the Gigs
  - **Gig**
  - **GigSong**

