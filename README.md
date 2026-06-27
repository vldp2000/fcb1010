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

## BiasFX Effect Control

BiasFX effect power assignments are handled as MIDI toggle commands, not absolute ON/OFF commands. The controller therefore uses a strict baseline rule: every BiasFX preset managed by the controller must be saved in BiasFX with Delay, Reverb, and Modulation blocks switched OFF by default on both the iPad and MacBook.

The song-program checkboxes in the UI represent the desired live state for that song program:

- `Del` checked means Delay should be ON after the song program is selected.
- `Rev` checked means Reverb should be ON after the song program is selected.
- `Mod` checked means Modulation should be ON after the song program is selected.
- `Boost` checked means Boost/Special should be ON after the song program is selected.

The configured BiasFX power-toggle CCs are:

- Delay: CC 20
- Reverb: CC 21
- Modulation: CC 22
- Boost/Special: CC 23

When a song program is selected, the controller first sets the app volume to 0. If the requested BiasFX Program Change is different from the currently loaded Program Change, it sends the new PC and assumes the BiasFX effect baseline is OFF/OFF/OFF/OFF. If the requested PC is the same as the currently loaded one, it skips the PC to avoid unnecessary latency and uses the controller's runtime effect state instead. It then sends only the toggle CCs required to reach the song-program checkbox state, and only after that restores the requested volume.

This means effect toggles must not be resent blindly. Sending the same BiasFX effect CC twice would flip the effect back to the opposite state.

FCB1010 pedals 6, 7, and 8 are live BiasFX effect controls:

- Pedal 6 toggles Delay for both BiasFX apps.
- Pedal 7 toggles Reverb for both BiasFX apps.
- Pedal 8 toggles Modulation for both BiasFX apps.
- Pedal 9 toggles live Boost/Special for both BiasFX apps.

These live buttons affect BiasFX guitar targets only: iPad channel 6 and MacBook channel 4. SampleTank and Alchemy are intentionally ignored even if their song-program data contains effect flags. The iPad BiasFX target is treated as the primary/master sound, while the MacBook BiasFX target follows it when present. This matches the live workflow where the iPad sound is configured first and the MacBook can be mixed in as an additional beautifier layer.

For live effect button presses, the controller toggles the iPad/master effect state and then makes the MacBook/secondary effect state match it. For example, if iPad Modulation is ON and MacBook Modulation is OFF, pressing pedal 8 targets Modulation OFF and sends CC 22 only to the iPad. If iPad Modulation is OFF and MacBook Modulation is ON, pressing pedal 8 targets Modulation ON and sends CC 22 only to the iPad. The live buttons are temporary performance overrides; selecting the same song program again restores the saved song-program checkbox state without resending the Program Change when the PC is unchanged.

Boost is stored as `boostflag` in the song-program preset data. Existing song JSON files that do not contain `boostflag` are treated as `false` by default. The old `muteflag` field is left in the data for compatibility, but it is not processed by the Python live controller. BiasFX presets that should support Boost/Special should include the required block saved OFF by default. Pressing pedal 9 sends CC 23 as a live override to the BiasFX targets that need to change. Selecting a song program restores Boost to the saved `boostflag` state.

The OLED top row shows `D`, `R`, `M`, and Boost status boxes based on the iPad/master BiasFX state. A plain `D`, `R`, or `M` means the master effect is ON. A crossed `D`, `R`, or `M` means that effect is OFF. Boost shows `B` when active and `X` when not boosted.

## Live MIDI Routing

The controller drives four MIDI targets:

1. BiasFX on iPad - MIDI channel 6
2. SampleTank on iPad - MIDI channel 1
3. BiasFX on MacBook - MIDI channel 4
4. Alchemy on MacBook - MIDI channel 2

Song-program preset slots use this same fixed order. The controller's current PC, volume, Delay, Reverb, Modulation, and Boost state arrays also use this order. Expression pedal 1 controls slots 1 and 3. Expression pedal 2 controls slots 2 and 4. BiasFX effect toggles are only processed for slots 1 and 3.

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
  - Modulation On/Off
  - Boost/Special On/Off
  - Legacy Mute/Unmute flag, kept in old data but not used by the live controller

Panorama is kept in the data model but is not used for live MIDI control. Delay, Reverb, Modulation, and Boost flags are used for BiasFX effect toggles according to the baseline rules above. The historical JSON/API field name for Modulation is still `modeflag`.

See the Image of FCB1010 in the list of files "fcb1010.png"

![FCB1010](/fcb1010.png)

FCB1010 pedal usage:
 - pedals 1, 2, 3, 4 select programs A, B, C, and D within the current song
 - pedals 5 and 10 change the current song
 - pedals 6, 7, 8 toggle BiasFX Delay, Reverb, and Modulation live
 - pedal 9 toggles live BiasFX Boost/Special
 - pedals UP and DOWN allow switching between FCB1010 banks

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
