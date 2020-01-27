#A MIDI channel voice message consists of a status Byte followed by one or two data Bytes. Click here for a list of
#currently assigned MIDI controller numbers. 
#              Status Byte	Data Byte 1	Data Byte 2	Message	Legend 1000nnnn	0kkkkkkk 0vvvvvvv	
#Note Off	n=channel* k=key # 0-127(60=middle C) v=velocity (0-127) 1001nnnn	0kkkkkkk 0vvvvvvv	
#Note On	n=channel k=key # 0-127(60=middle C) v=velocity (0-127) 1010nnnn	0kkkkkkk	0ppppppp
#Poly Key Pressure	n=channel k=key # 0-127(60=middle C) p=pressure (0-127) 1011nnnn	0ccccccc	0vvvvvv
#Controller Change	n=channel c=controller v=controller value(0-127) 1100nnnn 0ppppp  [none]	
#Program Change	n=channel p=preset number (0-127) 1101nnnn	0ppppppp	[none]	
#Channel Pressure	n=channel p=pressure (0-127) 1110nnnn	0fffffff	0ccccccc	
#Pitch Bend	n=channel c=coarse f=fine (c+f = 14-bit
#resolution) ----------------------------------------------------------------

## 176 -CC Channel 1
## 179 -CC Channel 4
## 181 -CC Channel 6
## 192 -PC on Channel 1
## 197 -PC on Channel 6


# -*- coding: utf-8 -*-
import json

# Make it work for Python 2+3 and with Unicode
import io

import pygame
import pygame.midi
import time
import sys
import socket
import struct
import subprocess
from array import *
from time import sleep

import pprint

import dataController
from dataClasses import *
from messageClient import MessageClient
from config import *

#----------------------------------------------------------------


#Global Variables

gGigSongList = []
gSongDict = {}

gMode = 'Live'
gPlaySongFromSelectedGigOnly = True
gCurrentBank = 0
gCorrentSongId = -1
gCorrentProgramIdx = -1

gResetAllCounter = 0
gResyncCounter = 0

gRaveloxClient = None
gNotificationMessageClient = None

#default value for second  volume pedal is 176 = 1st channel
gPedal2CC = 176
gChannel1 = 176 
gChannel2 = 177

gLastSynth1Program = 0
gLastSynth1Volume = 0

gLastSynth2Program = 0
gLastSynth2Volume = 0

gLastGuitar1Program = 0
gLastGuitar1Volume = 0

gLastGuitar2Program = 0
gLastGuitar2Volume = 0

#----------------------------------------------------------------

def printDebug(message):
  global gMode
  if gMode == 'Debug':
    print(message)

def InitAll():
  initAllSongs()
  initSongItems()
  initSongsForSelectedGig()

#----------------------------------------------------------------
def initAllSongs():
  global gSongDict
  gSongDict = dataController.getSongList()
  initSongItems()

#----------------------------------------------------------------
def initSongsForSelectedGig():
  global gGigSongList
  global gSongDict

  gigId = dataController.getCurrentGig()
  data = dataController.getGigSongs(gigId)
  gGigSongList = []

  for item in data:
    id = item['refsong']
    song = gSongDict[str(id)]
    song.sequencenumber = item['sequencenumber']
    gGigSongList.append(song)

#----------------------------------------------------------------
def initSongItems():
  global gSongDict

  data = dataController.allPresets()
  # Programs are saved as list withing a song
  # Presets are saved as a list withing a program
  x=0
  programId = -1
  presetId = -1
  songId = -1
  song = None
  for prg in data:
    if songId != int(prg["refsong"]):
      songId = int(prg["refsong"])
      song = gSongDict[str(songId)]
      programId = -1
      presetId = -1
    if programId != int(prg["refsongprogram"]):
      presetId = -1
      programId = prg["refsongprogram"]
      program = Program(
        prg["refsongprogram"],
        prg["SongProgram"]["name"],
        prg["SongProgram"]["midipedal"] 
      )
      # print(program.name)
      song.programs.append(program)
    if presetId != int(prg["refpreset"]):
      presetId = int(prg["refpreset"])
      preset = Preset(
        prg["id"],
        prg["delayflag"],
        prg["delayvalue"],
        prg["modeflag"],
        prg["muteflag"],
        prg["pan"],
        prg["reverbflag"],
        prg["reverbvalue"],
        prg["volume"],
        prg["Instrument"]["midichannel"],
        prg["InstrumentBank"]["number"],
        prg["Preset"]["midipc"]
      )    
      # print(preset.midipc)
      program.presets.append(preset)
  
#----------------------------------------------------------------
    # for prs in songProgramPresets:
def pringSongs(): 
  for item in gSongDict:
    song = gSongDict[item]
    
    print('--------------------')

    pprint.pprint( json.dumps(song,
      indent=4, sort_keys=True, cls=CustomEncoder,
      separators=(',', ': '), ensure_ascii=False
    ))

#----------------------------------------------------------------

def checkCurrentBank(bank):
  if gCurrentBank != bank:
    if bank == 1:
      gPlaySongFromSelectedGigOnly = True
      gCurrentBank = bank
    else:
      gPlaySongFromSelectedGigOnly = False
      gCurrentBank = 2
#----------------------------------------------------------------

def resyncWithGigController():
  global gResyncCounter
  global gCorrentSongId
  global gCorrentProgramIdx
  if gResyncCounter < 2:
    gResyncCounter = gResyncCounter + 1
  else:
    MessageClient.sendSyncNotificationMessage( gCorrentSongId, gCorrentProgramIdx)
    gResyncCounter = 0

def reloadAllData():
  global gResetAllCounter

  if gResetAllCounter < 2:
    gResetAllCounter = gResetAllCounter + 1
  else:
    InitAll()
    gResetAllCounter = 0

def executeSystemCommand(code):
  global gSynthTest
  global gPianoTest

  printDebug("EXECUTE SYSTEM COMMAND");
  command = "";
  if code == 6:
    #shutdown RPi
    command = "/usr/bin/sudo /home/pi/midicontrol/syscommand/shutdown.sh"
  elif code == 7:
    #reboot RPi
    command = "/usr/bin/sudo /home/pi/midicontrol/syscommand/reboot.sh";
  elif code == 8:
    #Set as Access Point
    command = "/usr/bin/sudo /home/pi/midicontrol/syscommand/networkaccesspoint.sh";
  elif code == 9:
    #connect to home network
    command = "/usr/bin/sudo /home/pi/midicontrol/syscommand/networkhome.sh";
  elif code == 10:
    #connect to multiple networks phone/home/gz firebird
    command = "/usr/bin/sudo /home/pi/midicontrol/syscommand/networkmulti.sh";

  else:
    printDebug("ExecuteSystemCommand. Unknown command")
    return

  if command != "":
    printDebug("Code =%d, Command=%s" % (code, command))
    import subprocess
    process = subprocess.Popen(command.split(), stdout=subprocess.PIPE)
    output = process.communicate()[0]
    printDebug(output)

#----------------------------------------------------------------

def sendRaveloxCCMessage(message):
  global gRaveloxClient
  gRaveloxClient.send( message )
  sleep(MIN_DELAY)
  if gMode == 'Debug':
     msg = struct.unpack( "BBBB", message)
     printDebug("SEND RAVELOX CC  MESSAGE  %d %d %d %d" % (msg[0],msg[1],msg[2],msg[3]))
#----------------------------------------------------------------

def sendRaveloxPCMessage(message):
  global gRaveloxClient
  gRaveloxClient.send( message )
  sleep(MIN_DELAY)
  if gMode == 'Debug':
     msg = struct.unpack( "BBB", message)
     printDebug("SEND RAVELOX PC  MESSAGE  %d %d %d" % (msg[0],msg[1],msg[2]))
#----------------------------------------------------------------
## 176 -CC Channel 1
## 177 -CC Channel 2
## 180 -CC Channel 5
## 181 -CC Channel 6

## 192 -PC on Channel 1
## 193 -PC on Channel 2
## 197 -PC on Channel 6
#----------------------------------------------------------------
def muteChannel(channel, volume, delay, step):
  if volume > 0:
    x = volume
    while x > 0:
      sendRaveloxCCMessage(struct.pack( "BBBB", 0xaa, channel, VOLUME_CC, x ))
      x = x - step
      sleep(delay)
    sendRaveloxCCMessage(struct.pack( "BBBB", 0xaa, channel, VOLUME_CC, 0 ))
#----------------------------------------------------------------
def unmuteChannel(channel, volume, delay, step):
  x = step
  while x < volume:
    sendRaveloxCCMessage(struct.pack( "BBBB", 0xaa, channel, VOLUME_CC, x ))
    x = x + step
    sleep(delay)
  sendRaveloxCCMessage(struct.pack( "BBBB", 0xaa, channel, VOLUME_CC, volume ))
#----------------------------------------------------------------



def sendChangeBankProgram():
  global gPedal2CC
  global gLastSynth1Program
  global gLastSynth1Volume
  global gLastGuitar1Program
  global gLastGuitar1Volume
  global gLastSynth2Program
  global gLastSynth2Volume
  global gLastGuitar2Program
  global gLastGuitar2Volume

  # if gCurrentSong <> 0:
  #   if gCurrentSong == 1:
  #     selectNextSong()
  #   elif gCurrentSong == -1:
  #     selectPreviousSong()
  # printDebug("send ChangeBank Program. Bank %d, Programm %d, Reset%d" % (gBank,gProgram,gResetAllCounter))


  # item = gProgramList.banks[gBank].items[gProgram]

  # if item["synth1"] <> 0 and item["synth2"] == 0:
  #   gPedal2CC = gChannel1
  # elif item["synth1"] == 0 and item["synth2"] <> 0:
  #   gPedal2CC = gChannel2
  # elif item["synth1"] <> 0:
  #   gPedal2CC = gChannel2
  # else:
  #   gPedal2CC = gChannel1


  # #Guitar1 BIAS FX CHALLEL6 #181  mute Bias FX
  # muteChannel(181,gLastGuitar1Volume, 0.02, 10)
  # sleep(0.06)
  # #Bias FX program
  # sendRaveloxPCMessage(struct.pack( "BBB", 0xaa, 197, item["guitar1"] ))
  # sleep(0.02)
  # unmuteChannel(181,item["guitar1volume"],0.03, 10)

  # gLastGuitar1Program = item["guitar1"]
  # gLastGuitar1Volume = item["guitar1volume"]
  # sleep(0.02)

  # #Guitar2 BIAS FX CHALLEL4 #179  mute Bias FX
  # muteChannel(179,gLastGuitar2Volume, 0.02, 10)
  # sleep(0.0)
  # #Bias FX program
  # sendRaveloxPCMessage(struct.pack( "BBB", 0xaa, 195, item["guitar2"] ))
  # sleep(0.03)
  # unmuteChannel(179,item["guitar2volume"],0.03, 10)
  # gLastGuitar2Program = item["guitar2"]
  # gLastGuitar2Volume = item["guitar2volume"]
  # sleep(0.04)

  # #SampleTank program CHANNEL1 #176
  # sendRaveloxPCMessage(struct.pack( "BBB", 0xaa, 192, item["synth1"] ))
  # sleep(0.04)

  # #SampleTank volume
  # if gLastSynth1Volume != item["synth1volume"]:
  #   sendRaveloxCCMessage(struct.pack( "BBBB", 0xaa, 176, 7, item["synth1volume"] ))
  #   sleep(0.03)

  # gLastSynth1Program = item["synth1"]
  # gLastSynth1Volume = item["synth1volume"]


  # #Alchemy Synth CHANNEL2
  # if gLastSynth2Program > 0 and gLastSynth2Program != item["synth2"] :
  #   muteChannel(177, gLastSynth2Volume, 0.07, 20)

  # if gLastSynth2Program != item["synth2"] :
  #   #Program Change 
  #   sendRaveloxPCMessage(struct.pack( "BBB", 0xaa, 193, item["synth2"] ))
  #   sleep(0.04)
  #   unmuteChannel(177, item["synth2volume"], 0.07, 20)
  # else:
  #   sendRaveloxCCMessage(struct.pack( "BBBB", 0xaa, 177, 7, item["synth2volume"] ))

  # sleep(0.03)
  # gLastSynth2Program = item["synth2"]
  # gLastSynth2Volume = item["synth2volume"]


  # #next section is to send the values for MidiDesigner to dispay 
  # #Midi Designer Guitar Display
  # sendRaveloxCCMessage(struct.pack( "BBBB", 0xaa, 180, 16, gFileNumber ))
  # sendRaveloxCCMessage(struct.pack( "BBBB", 0xaa, 180, 17, gBank ))
  # sendRaveloxCCMessage(struct.pack( "BBBB", 0xaa, 180, 18, item["guitar1"] ))
  # sendRaveloxCCMessage(struct.pack( "BBBB", 0xaa, 180, 22, item["guitar2"] ))
  # #Midi Designer SampleTank Display
  # sendRaveloxCCMessage(struct.pack( "BBBB", 0xaa, 180, 20, item["synth1"] ))
  # #Midi Designer Alchemy Display
  # sendRaveloxCCMessage(struct.pack( "BBBB", 0xaa, 180, 21, item["synth2"] ))

  # printDebug("Send Combined Command. Name %s,Guitar %d, GuitarVol %d, Piano %d, PianoVol %d"% 
  #     (item["name"] , item["guitar1"] , item["guitar1volume"],  item["synth1"], item["synth1volume"]))
  printDebug("#----------------------------------------------------------------")

#----------------------------------------------------------------
def sendGenericMidiCommand(msg0, msg1, msg2):

  if  msg0 == gChannel1  or msg0 == gChannel2:
    msg0 = gPedal2CC
  printDebug("SEND GENERIC MIDI COMMAND")
  message = struct.pack( "BBBB", 0xaa, msg0, msg1, msg2 )
  sendRaveloxCCMessage( message )

  printDebug("Send Generic Midi Command to Ravelox %d, %d, %d"% (msg0,msg1,msg2))

#----------------------------------------------------------------

def selectNextSong():
  printDebug("INCREASE BIASFX BANK")
  message = struct.pack( "BBBB", 0xaa, 181, 27, 100 )
  sendRaveloxCCMessage( message )
  printDebug("increase bank")

#----------------------------------------------------------------

def selectPreviousSong():
  printDebug("DECREASE BIASFX BANK")
  message = struct.pack( "BBBB", 0xaa, 181, 28, 100 )
  sendRaveloxCCMessage( message )
  printDebug("decrease bank")

#----------------------------------------------------------------
def setBankProgram(msg0, msg1, msg2):
  printDebug("SET BANK PROGRAMM")
  global gBank
  global gProgram
  global gResetAllCounter
  global gCurrentSong
  global gMode
  global gPedal2CC

  if msg2 == 11:  #pedal 1
    gResetAllCounter = gResetAllCounter + 1
    if gResetAllCounter > 2:
      resetPrograms()
    printDebug("Reset. Bank %d, Programm %d, Reset%d" % (gBank,gProgram,gResetAllCounter))
    return
  elif msg2 == 13: #pedal 3 #Second Volume pedal sends messages to ch 1
    gPedal2CC = gChannel1
    return
  elif  msg2 == 14: #pedal 4 #Second Volume pedal sends messages to ch 2
    gPedal2CC = gChannel2
    return
   
    #printDebug("BiasFX Control Change. %d" % msg2)
#    return

  #Select bank
  elif msg2 == 20:  #pedal 10
    #increase bank#
    gBank += 1
    gCurrentSong = 1

    if gBank > 7:
      gBank = 0
    gProgram = 0

    printDebug("Bank %d, Programm %d, Reset%d" % (gBank,gProgram,gResetAllCounter))

  elif msg2 == 15: #pedal 5
    #decrease bank#
    gBank -= 1
    gCurrentSong = -1

    if gBank < 1:
      gBank = 7
    gProgram = 0

    printDebug("Bank %d, Programm %d, Reset%d" % (gBank,gProgram,gResetAllCounter))


  gCurrentSong = 0
  #Select programm
  if msg2 == 16: #pedal 6
    gProgram = 0
  elif msg2 == 17: #pedal 7
    gProgram = 1
  elif msg2 == 18: #pedal 8
    gProgram = 2
  elif msg2 == 19: #pedal 9
    gProgram = 3

  gResetAllCounter = 0


#----------------------------------------------------------------
def getActionForReceivedMessage(midiMsg):
  printDebug("SEND MIDI MSG")
  global gResetAllCounter
  global gSynthTest
  global gPianoTest

  msg = midiMsg[0]
  msg0 = msg[0]
  msg1 = msg[1]
  msg2 = msg[2]
  msgParameter = midiMsg[1]

#System events
#FCB1010 has 10 banks 0..9
#Banks 0..3 are set to control the external Midi Devices. 
#    CC1 messages : Channel 5 (msg0 = 180 ) 
#    Pedals send (msg1 = 20, msg2 = 11..20)
#    Epression Pedal 1 sends messages on channel 6 msg0 = 181, msg1 = 7
#    Epression Pedal 2 sends messages on channel 1 msg0 = 176, msg1 = 7
#    Selected bank can be identified by CC2 message
#       where msg1 = 1 and msg2 = 1..4 

#Bank  8 is programmed to initiate the Raspberry Pi system commands. 
#    Pedals send (msg0 = 180, msg1 == 3, msq2 = 1..10)

# This vesion of the software will use Bank 1 to control the songs of the "Current Gig"
# Bank 2 will be used to select any song in a dictionary of available songs 

  if msg0 == 180:
    if msg1 == 3: #FCB1010 bank 8 is programmed to send msg1 == 3 for system actions 
      executeSystemCommand(msg2)
      printDebug(">>1--" + str(gResetAllCounter))
      return
    elif msg1 == 1:
      checkCurrentBank(msg2)
      printDebug(">>2--" + str(gResetAllCounter))
      return
    elif msg1 == 20: #FCB1010 bank 8 is programmed to send msg1 == 20  for Banks 0 - 3 
      if msg2 == 12:
          sendBiasFxCommand(181, msg2, 110)
          printDebug(">>3--" + str(gResetAllCounter))
          gResetAllCounter = 0
      else:
          setBankProgram(msg0, msg1, msg2)
          printDebug(">>4--" + str(gResetAllCounter))
          if msg2 ==11  or msg2 > 14:
            sendChangeBankProgram()
            printDebug('>>5--' +str(gResetAllCounter))
      gSynthTest = 0
      gPianoTest = 0

  elif msg0 == 176 and msg1 == 7:
    # Send Volume to Channel 1 or 2 (or both ?)
    printDebug('>>6--' + msg)

  elif msg0 == 181 and msg1 == 7:
    # Send Volume to Channel 6 or 7 (or both ?)
    printDebug('>>7--' + msg)

  else:
     sendGenericMidiCommand(msg0, msg1, msg2)
     printDebug('>>8--' + msg)

#----------------------------------------------------------------
def getMidiMsg(midiInput):
#  printDebug(""))
  printDebug("..... LISTEN TO MIDI MSG")
  gotMsg = 0
  while not(gotMsg):
    sleep(MIN_DELAY)
    if midiInput.poll():    
      gotMsg = 1
      inp = midiInput.read(100)
      for msg in inp:
        printDebug(">>New Message Received<")
        printDebug(msg)
        getActionForReceivedMessage(msg)  

#----------------------------------------------------------------
def initRaveloxClient():
  global gRaveloxClient
  try:
    gRaveloxClient = socket.socket( socket.AF_INET, socket.SOCK_DGRAM )
    gRaveloxClient.connect( RAVELOX_HOST, RAVELOX_PORT )
    gRaveloxClient.send("")
    gRaveloxClient.send("") # have to send twice to throw an error if ravelox not running
    return True
  except:
    return False

#----------------------------------------------------------------
#Main Module 
#pygame.init()
pygame.midi.init()

print(str(sys.argv))
if len(sys.argv) > 1: 
  if str(sys.argv[1]).upper() == 'DEBUG':
    gMode = 'Debug'

#Show the list of available midi devices
if gMode == 'Debug':
  for id in range(pygame.midi.get_count()):
    printDebug( "Id=%d Device=%s" % (id,pygame.midi.get_device_info(id)) )

gNotificationMessageClient = MessageClient()
gNotificationMessageClient.initMessenger()

# gNotificationMessageClient.sendSongNotificationMessage(1)
# gNotificationMessageClient.sendProgramNotificationMessage(1)

port = MIDI_PORT
portOk = False

while not portOk:
  try:
    result = initRaveloxClient()
    if result:
      midiInput = pygame.midi.Input(port)
      portOk = True  
    else:
      printDebug("waiting for raveloxmidi...")
      sleep(1)

  except:
    printDebug("MIDI device not ready....")
    pygame.midi.quit()
    pygame.midi.init()
    sleep(2)

readData()

printDebug("Everything ready now...")

while 1:
  getMidiMsg(midiInput)

#---Close application
#gRaveloxClient.close()
gRaveloxClient.shutdown(2)
del midiInput
pygame.midi.quit()

