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
import io

import pygame
import pygame.midi
import time
import sys
import socket
import socketio
import struct
import subprocess
from array import *
from time import sleep

# import pprint

import dataController
import dataHelper
from dataClasses import *
from messageClient import MessageClient
from config import *

#----------------------------------------------------------------

gProcessRaveloxMidi = True
gUseNewRaveloxMidi = True
gMidiDevice = MIDI_INPUT_DEVICE  # Input MIDI device

#Global Variables
gGig = {}

gSongList = []
gSongDict = {}

gGigSongList = []
gBankSongList = []

gInstrumentDict = {}
gPresetDict= {}
gInstrumentBankDict = {}

gMode = 'Live'
gPlaySongFromSelectedGigOnly = True
gCurrentBank = -1

gCurrentSongIdx = -1
gCurrentProgramIdx = -1

gReloadCounter = 0
gResyncCounter = 0

gRaveloxClient = None
gNotificationMessageClient = None

#default value for second  volume pedal is 176 = 1st channel
gPedal2_Channel = 176
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

sio = socketio.Client()


#---SOCKET---------------
@sio.event
def connect():
  print('SOCKET connection established')

@sio.event
def my_message(data):
  print('MY_message received with ', data)

@sio.event
def message(data):
  print('Message received with ', data)
  

@sio.event
def disconnect():
  print('disconnected from SOCKET server')

#----------------------------------------------------------------

def printDebug(message):
  global gMode
  if gMode == 'Debug':
    print(message)

#----------------------------------------------------------------
def loadAllData():
  global gGig
  global gSongDict
  global gSongList
  global gGigSongList
  global gInstrumentDict
  global gPresetDict
  global gInstrumentBankDict
  global gBankSongList

  if gGig != None and hasattr('gGig', 'shortSongList') :
    gGig.shortSongList.clear()
    gGig = None
  if gInstrumentDict != None:
    gInstrumentDict.clear()
  if gInstrumentBankDict != None:
    gInstrumentBankDict.clear()
  if gPresetDict != None:
    gPresetDict.clear()
  if gGigSongList != None:
    gGigSongList.clear()
  if gSongList != None:
    gSongList.clear()
  if gSongDict != None:
    gSongDict.clear()
  if gBankSongList != None:
    gBankSongList.clear()

  gGig = dataHelper.loadCurrentGig()
  gSongDict = dataHelper.loadSongs()
  gSongList = dataHelper.initAllSongs(gSongDict)
  gGigSongList = dataHelper.initGigSongs(gGig.shortSongList, gSongDict)
  gInstrumentDict = dataHelper.initInstruments()
  gPresetDict = dataHelper.initPresets()
  gInstrumentBankDict = dataHelper.initInstrumentBanks()
#----------------------------------------------------------------

def checkCurrentBank(bank):
  global gCurrentBank
  global gPlaySongFromSelectedGigOnly
  global gBankSongList
  global gGigSongList
  global gSongList

  if gCurrentBank != bank:
    if bank == 1:
      gPlaySongFromSelectedGigOnly = True
      gCurrentBank = bank
      gBankSongList = gGigSongList
      # initGigSongs()
    else:
      gPlaySongFromSelectedGigOnly = False
      gCurrentBank = 2
      gBankSongList = gSongList

  # printDebug('Current Bnk = ', gCurrentBank)
  # printDebug('gPlaySongFromSelectedGigOnly = ', gPlaySongFromSelectedGigOnly)
  # printDebug('gSongList length --' , len(gSongList))
  # printDebug('gGigSongList length --' , len(gGigSongList))
  # printDebug('gBankSongList length --' , len(gBankSongList))
#----------------------------------------------------------------

def resyncWithGigController():
  global gResyncCounter
  global gCurrentSongIdx
  global gCurrentProgramIdx

  # printDebug('== song ==',gCurrentSongIdx)
  # printDebug('-- Prog --',gCurrentProgramIdx) 
  if gResyncCounter < 2:
    gResyncCounter = gResyncCounter + 1
  else:
    MessageClient.sendSyncNotificationMessage( gBankSongList[gCurrentSongIdx].id, gCurrentProgramIdx)
    gResyncCounter = 0
#----------------------------------------------------------------

def isReloadRequired():
  global gReloadCounter

  if gReloadCounter < 2:
    gReloadCounter = gReloadCounter + 1
  else:
    loadAllData()
    gReloadCounter = 0

#----------------------------------------------------------------

def executeSystemCommand(code):
  global gSynthTest
  global gPianoTest

  # printDebug("EXECUTE SYSTEM COMMAND");
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
## 176 -CC Channel 1
## 177 -CC Channel 2
## 180 -CC Channel 5
## 181 -CC Channel 6

def sendRaveloxCCMessage(channel, CC, value):
  global gRaveloxClient
  global gUseNewRaveloxMidi
  global gProcessRaveloxMidi

  if not gProcessRaveloxMidi: return
  
  message = ""
  if gUseNewRaveloxMidi:
    message = struct.pack( "BBB", 176 + channel - 1, CC, value)
  else:
    message = struct.pack("BBBB", 0xaa, 176 + channel - 1, CC, value)

  gRaveloxClient.send( message )
  sleep(MIN_DELAY)
  
  if gMode == 'Debug':
     printDebug("SEND RAVELOX CC  MESSAGE  %d %d %d" % (channel , CC, value))
#----------------------------------------------------------------
## 192 -PC on Channel 1
## 193 -PC on Channel 2
## 197 -PC on Channel 6

def sendRaveloxPCMessage( channel, PC):
  global gRaveloxClient
  global gUseNewRaveloxMidi
  global gProcessRaveloxMidi

  if not gProcessRaveloxMidi: return

  message = ""
  if gUseNewRaveloxMidi:
    message = struct.pack( "BB", 192 + channel - 1, PC)
  else:
    message = struct.pack("BBB", 0xaa, 192 + channel - 1, PC)

  gRaveloxClient.send( message )
  sleep(MIN_DELAY)
  
  if gMode == 'Debug':
     printDebug("SEND RAVELOX PC  MESSAGE %d %d" % (channel ,PC))
#----------------------------------------------------------------

def sendGenericMidiCommand(msg0, msg1, msg2):
  global gRaveloxClient
  global gUseNewRaveloxMidi
  global gProcessRaveloxMidi

  if not gProcessRaveloxMidi: return

  message = ""
  if  msg0 == gChannel1  or msg0 == gChannel2:
    msg0 = gPedal2_Channel
  # printDebug("SEND GENERIC MIDI COMMAND")
  if gUseNewRaveloxMidi:
    message = struct.pack("BBB", msg0, msg1, msg2)
  else:
    message = struct.pack("BBBB", 0xaa, msg0, msg1, msg2)

  gRaveloxClient.send( message )
  sleep(MIN_DELAY)
  
if gMode == 'Debug':
     printDebug("SEND RAVELOX GENERIC MESSAGE %d %d %d" % (msg0, msg1, msg2))
#----------------------------------------------------------------
def muteChannel(channel, volume, delay, step):
  if volume > 0:
    x = volume
    while x > 0:
      sendRaveloxCCMessage( channel, VOLUME_CC, x )
      x = x - step
      sleep(delay)
    sendRaveloxCCMessage(channel, VOLUME_CC, 0 )
#----------------------------------------------------------------
def unmuteChannel(channel, volume, delay, step):
  x = step
  while x < volume:
    sendRaveloxCCMessage( channel, VOLUME_CC, x )
    x = x + step
    sleep(delay)
  sendRaveloxCCMessage(channel, VOLUME_CC, volume )
#----------------------------------------------------------------

def setSongProgram(idx):
  global gCurrentProgramIdx
  global gCurrentSongIdx
  global gBankSongList

  gCurrentProgramIdx = idx

  song = gBankSongList[gCurrentSongIdx]
  program = song.programList[idx]
  # printDebug(song.name)

  for preset in program['presetList']:
    #pprint.pprint(preset)
    setPreset(preset)

  gNotificationMessageClient.sendProgramNotificationMessage(idx)

#----------------------------------------------------------------
def setPreset(preset):
  pc = int( gPresetDict[str(preset['refpreset'])] )
  channel = int( gInstrumentDict[str(preset['refinstrument'])] )
  mute = preset['muteflag']

  if mute:
    muteChannel(channel, preset['volume'], 0.01, 10)

  sendRaveloxPCMessage(channel, pc)

  if mute:
    unmuteChannel(channel, preset['volume'], 0.01, 10)

#----------------------------------------------------------------

def selectNextSong():
  global gCurrentSongIdx
  global gBankSongList

  if gCurrentSongIdx + 1 < len(gBankSongList):
    gCurrentSongIdx = gCurrentSongIdx + 1
  else:
    gCurrentSongIdx = 0

  gNotificationMessageClient.sendSongNotificationMessage(gBankSongList[gCurrentSongIdx].id)
  printDebug("next song " + gBankSongList[gCurrentSongIdx].name)

#----------------------------------------------------------------

def selectPreviousSong():
  global gCurrentSongIdx
  global gBankSongList

  if gCurrentSongIdx - 1 > -1:
    gCurrentSongIdx = gCurrentSongIdx - 1
  else: 
    gCurrentSongIdx = len(gBankSongList) - 1
  gNotificationMessageClient.sendSongNotificationMessage(gBankSongList[gCurrentSongIdx].id)
  printDebug("previous song " + gBankSongList[gCurrentSongIdx].name)

#----------------------------------------------------------------


#----------------------------------------------------------------
def getActionForReceivedMessage(midiMsg):
  # printDebug("SEND MIDI MSG")
  global gReloadCounter
  global gSynthTest
  global gPianoTest
  global gPedal2_Channel

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
      # printDebug(">>1--")
      return
    elif msg1 == 1:
      checkCurrentBank(msg2)
      # printDebug(">>2--")
      return
    elif msg1 == 20: #FCB1010 bank 8 is programmed to send msg1 == 20  for Banks 0 - 3 
      if msg2 == 11:
        resyncWithGigController()  ## press pedal 3 times to resync
      elif msg2 == 12:
        isReloadRequired()  ## press pedal 3 times to reload data
      elif msg2 == 13: #pedal 3 #Second Volume pedal sends messages to ch 1
        gPedal2_Channel = gChannel1
      elif  msg2 == 14: #pedal 4 #Second Volume pedal sends messages to ch 2
        gPedal2_Channel = gChannel2
      elif msg2 == 15:
        selectPreviousSong()
        setSongProgram(0)
      elif msg2 == 16:
        setSongProgram(0)
      elif msg2 == 17:
        setSongProgram(1)
      elif msg2 == 18:
        setSongProgram(2)
      elif msg2 == 19:
        setSongProgram(3)
      elif msg2 == 20:
        selectNextSong()
        setSongProgram(0)

      # gSynthTest = 0
      # gPianoTest = 0

  elif msg0 == 176 and msg1 == 7:
    # Send Volume to Channel 1 or 2 (or both ?)
    sendGenericMidiCommand(msg0, msg1, msg2)
    # printDebug('>>6--' + str(msg))

  elif msg0 == 181 and msg1 == 7:
    # Send Volume to Channel 6 or 7 (or both ?)
    sendGenericMidiCommand(msg0, msg1, msg2)
    # printDebug('>>7--' + str(msg))

  else:
     sendGenericMidiCommand(msg0, msg1, msg2)
    #  printDebug('>>8--' + str(msg))

#----------------------------------------------------------------
def getMidiMsg(midiInput):
#  printDebug(""))
  # printDebug("..... LISTEN TO MIDI MSG")
  gotMsg = 0
  while not(gotMsg):
    sleep(MIN_DELAY)
    if midiInput.poll():    
      gotMsg = 1
      inp = midiInput.read(100)
      for msg in inp:
        # print(msg)
        # printDebug(">>New Message Received<")
        # printDebug(msg)
        getActionForReceivedMessage(msg)  

#----------------------------------------------------------------

def connectRavelox():
  global gRaveloxClient
  try:
    connect_tuple = ( 'localhost', 5006 )
    gRaveloxClient = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    gRaveloxClient.connect( connect_tuple )

    return True
  except:
    printDebug('<<< exception >>')
    # pprint.pprint(sys.exc_info())
    return False

#----------------------------------------------------------------
#Main Module 
#pygame.init()
pygame.midi.init()

# print(str(sys.argv))
if len(sys.argv) > 1: 
  if str(sys.argv[1]).upper() == 'DEBUG':
    gMode = 'Debug'

#Show the list of available midi devices
printDebug(pygame.midi.get_count())
if gMode == 'Debug':
  for id in range(pygame.midi.get_count()):
    printDebug( "Id=%d Device=%s" % (id,pygame.midi.get_device_info(id)) )

# sio = socketio.Client()
sio.connect('http://localhost:8081')

#gNotificationMessageClient = MessageClient()
#gNotificationMessageClient.initMessenger()

# gNotificationMessageClient.sendSongNotificationMessage(1)
# gNotificationMessageClient.sendProgramNotificationMessage(1)

loadAllData()

checkCurrentBank(1)

if len(gBankSongList) > 0:
  gCurrentSongIdx = 0
  gCurrentProgramIdx = 0

# port = MIDI_PORT
portOk = False
midiInput = None

while not portOk:
  try:
    # result = initRaveloxClient()
    result = connectRavelox()

    if result:
      midiInput = pygame.midi.Input(gMidiDevice)
      portOk = True
    else:
      printDebug("waiting for raveloxmidi...")
      sleep(1)

  except:
    printDebug("MIDI device not ready....")
    pygame.midi.quit()
    pygame.midi.init()
    sleep(2)


printDebug("Everything ready now...")

while 1:
  getMidiMsg(midiInput)

#---Close application
#gRaveloxClient.close()
if gProcessRaveloxMidi:
  gRaveloxClient.shutdown(2)

del midiInput
pygame.midi.quit()
