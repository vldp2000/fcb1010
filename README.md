# fcb1010

I'm playing the guitar in a band using the applications on iPad an MacBook as guitar processors.

The are few types of applications used:
  1. Guitar processors to modify the sound of guitar
  2. Guitar-to-MIDI to convert the notes played on guitar into MIDI signals
  3. Synth applications to play the MIDI note received from Guitar-to-MIDI with the sounds of different music instruments.

I have modified the FCB1010 foot MIDI controller to send MIDI through the integrated Raspberry Pi.

There is the RaspberryPi computer integrated into it which does the following:
  1. Receives the wired MIDI signal from pedals,
  2. Converts them into PC (Program Change) and CC (Control Change) MIDI signals. 
It's all done y the Python application I wrote (Python MIDI Controller app)

The Python MIDI Controller now receives direct MIDI from the FCB1010 and sends direct USB MIDI output to the connected devices.

The live controller currently runs on a Raspberry Pi 2 instead of a Raspberry Pi Zero. The Pi 2 gives more CPU headroom for the Python controller, API/socket communication, OLED display updates, and live MIDI handling.

One important practical issue is MIDI pacing. The USB MIDI interface connected to the Raspberry Pi 2 can miss or mishandle commands if too many MIDI messages are sent too quickly, so the controller uses small delays between outgoing MIDI commands. Current timing targets are 2 ms after CC/note/small realtime messages, 2 ms after each expression-pedal volume CC message, and 20 ms after Program Change messages. After a preset Program Change, the controller also reasserts the preset volume after 150 ms because some apps/plugins apply their own preset volume shortly after loading. Expression-pedal movement cancels that pending reassert for the affected channel, so the pedal still wins when it is moved immediately after a preset change.

## Live MIDI Routing

The controller drives four MIDI targets:

1. BiasFX on iPad - MIDI channel 6
2. SampleTank on iPad - MIDI channel 1
3. BiasFX on MacBook - MIDI channel 4
4. Alchemy on MacBook - MIDI channel 2

The Raspberry Pi sends MIDI into Zoom UAC2 (1). Zoom UAC2 (1) forwards MIDI to the iPad over USB, and its MIDI cable output feeds Zoom UAC2 (2). Zoom UAC2 (2) then forwards MIDI to the MacBook over USB.

MIDI filtering is handled by MidiFire running on the iPad.

The iPad runs BiasFX, SampleTank, MidiFire, and MidiGuitar. MidiGuitar converts the guitar notes into MIDI notes and sends them to SampleTank, while BiasFX receives guitar processor control messages on channel 6.

The MacBook runs Reaper with MidiGuitar, BiasFX, and Alchemy plugins. MidiGuitar converts the guitar notes into MIDI notes and sends them to Alchemy, while BiasFX receives guitar processor control messages on channel 4.

The FCB1010 expression pedals send volume as CC 7. Expression pedal 1 controls both BiasFX apps on channels 6 and 4. Expression pedal 2 controls both synth apps: SampleTank on channel 1 and Alchemy on channel 2. The controller calibrates the raw pedal range because the pedals may not reach the full MIDI value of 127.

The live destination MIDI channels are configured in `fcbcontroller/config.py` as `DEV1_GUITAR_CHANNEL`, `DEV1_KEYBOARD_CHANNEL`, `DEV2_GUITAR_CHANNEL`, and `DEV2_KEYBOARD_CHANNEL`. `DEV1` is the iPad side and `DEV2` is the MacBook side. Expression-pedal output routing is then built from those named channels plus the matching preset-volume indexes, keeping the live device layout out of the main MIDI event loop.

The controller has two operating modes. In Live mode, the foot controller drives the configured live MIDI targets. In Config mode, selected from the Maintenance/Gig UI, both expression pedals are temporarily routed to one selected MIDI channel so the best preset volume can be found for a specific iPad or MacBook app. The UI sends the selected app channel with `VIEW_EDIT_MODE_MESSAGE`; payload `0` returns the controller to Live mode.

System commands such as shutdown, reboot, and restart require two consecutive matching MIDI messages. The first message arms the command and shows it on the controller display. The second matching message executes it. Selecting another command or changing normal controller state resets the confirmation, so the command can be cancelled by changing your mind before the second press.

### Issues with the current solution
The current solution has a limitation related to the way the guitar presets are selected for the specific songs.
There is no simple way to combine the songs into a new gig songs list with the easy to reorder way of doing it.
The songs and presets are recorderd into JSON file.


# New Functionality

I would like to change the whole way of setting and using the FCB1010 MIDI foot controller.

## Solution Diagram
![FCB1010 Solution Diagram](/fcb1010_SolutionDiagram.png)

The live controller avoids SQLite on the Raspberry Pi to reduce SD-card writes. Runtime data is stored as JSON files and served by the Node API.

### Tables:
  1. Instrument
  2. InstrumentBank
  3. Preset
  4. Song
  5. SongProgram
  6. SongProgramPreset
  7. Gig
  8. GigSong


The solution uses the following applications:
 1. Maintenance Application
 2. Gig Manager Application
 3. APIServer  (JSON file backed)
 
 

Those apps as well as few other apps and API will be hosted on Raspberrypi

## Gig Manager  (GM)

Gig Manager  should allow to select a gig from the list of gigs 

The songs recorded into the gig list are loaded from JSON data.
Each song to have 4 programs

Each program can have up to 4 presets for 4 instruments specified

Each preset selected for a Song to have extra parameters for 
  - Volume
  - Panorama (kept in data only; not used for live MIDI control)
  - Delay On/Off
  - Revereb On/Off 
  - Mode On/Off
  - Mute/Unmute Flag 

Panorama and effect control flags are kept in the data model for possible future use, but the live controller does not currently send PAN or effect-control MIDI messages. These can be enabled later after the best preset/effect mapping is decided for BiasFX, SampleTank, and Alchemy.

See the Image of FCB1010 in the list of files "fcb1010.png"

![FCB1010](/fcb1010.png)

FCB1010 pedal usage:
 - pedals 6, 7, 8, 9 send the command about the program change within the selected song
 - pedals 5, 10 send the commands to change the current song
 - pedals 1,2,3,4 are reserved for changing the parameters of the currently selected presets
 - pedals UP, DOWN allow to switch between the GIGS . there are 7 banks reserver for 7 gig.

The current bank number is displayd on FCB1010 2 digit monitor 

In fact all those pedals are programmed to send the predefind MIDI ControlChange messages to Python application running on RaspberryPi
(UP, DOWN pedals do net send any MIDI message)

The Python application needs to know the rules how to convert those pedal messages into required MIDI messages


The GM should provide the following info to a user:

 - show currnt gig
 - show current song
 - show current program
 - show list of presets for the selected program
 - show parameters for each preset

On one hand As soon as anything is changed in python controller app the GM has to reflect the change
On another hand User should be able to control the python controller using the GUI provided by GM
It means the GM and python MIDI controller have to be always in sync


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
        - socketIO-client-nexus 0.7.6 ( pip install socketIO-client-nexus)



## Maintenance Application (MA)

start the local service:

cd maintenance
npm run serve

to see the logs of the maintenance app run the chrome browser and enter address
http://localhost:8080/
click f12 and select "Console" tab

there is a Vue plugin for Chrome which helps to debug



 1. MA has to provide tools for managing the live JSON-backed data
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



## JSON Data API
ApiServer

NodeJS based API backed by JSON files.

start service :

cd apiserver
npm start

you will see the logs of the apiserver in you terminal window



1. test the load of all the records from a required table:
  http://127.0.0.1:8081/songs/
  

3. Update the existing record in a table. PUT request
http://127.0.0.1:8081/song
body:

 {
    "id": 16,
    "name": "Name of a song",
    "tempo": 10,
  }


3. Inser a new record into a table. Post request
http://127.0.0.1:8081/song
body:
  {
    "name": "Name of a song",
    "tempo": 100,
  }
