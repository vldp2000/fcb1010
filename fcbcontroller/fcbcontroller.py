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

import dataController
import dataHelper
from dataClasses import *
from config import *
import queue
import threading


#################################################################
class raveloxBackgroundThread (threading.Thread):
  def __init__(self, threadID):
    threading.Thread.__init__(self)
    self.threadID = threadID
  def run(self):
    print ("Starting raveloxBackgroundThread")
    processRaveloxMessageQueue()
    print ("Exiting raveloxBackgroundThread")
#################################################################
#----------------------------------------------------------------
gMessageQueue = None
gQueueLock = None

gProcessRaveloxMidi = True
gUseNewRaveloxMidi = True
gExitFlag = False

gMidiDevice = MIDI_INPUT_DEVICE  # Input MIDI device

#Global Variables
gGig = {}
gSelectedGigId = -1

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
gCurrentSongId = -1
gCurrentProgramIdx = -1
gCurrentPresetId = -1
gCurrentPreset = {}
gReloadCounter = 0
gResyncCounter = 0

gRaveloxClient = None

gPedal1Value = 1
gPedal2Value = 1

#default value for second  volume pedal is 176 = 1st channel
#gPedal2_Channel = 176
#gChannel1 = 176
#gChannel2 = 177

gLastSynth1Program = 0
gLastSynth1Volume = 0

gLastSynth2Program = 0
gLastSynth2Volume = 0

gLastGuitar1Program = 0
gLastGuitar1Volume = 0

gLastGuitar2Program = 0
gLastGuitar2Volume = 0

sio = socketio.Client()


#---SOCKET--CLIENT-------------
@sio.event
def connect():
  print('SOCKET connection established')
#==
@sio.event
def message(data):
  print('Message received with ', data)
#== 
@sio.event
def disconnect():
  print('disconnected from SOCKET server')
#==
@sio.on('VIEW_SONG_MESSAGE')
def processSongMessage(id):
  print("VIEW_SONG_MESSAGE ID: " , id)
  setSong(id)
#==
@sio.on('VIEW_PROGRAM_MESSAGE')
def processProgramMessage(idx):
  print("VIEW_PROGRAM_MESSAGE IDX: " , idx)
  setSongProgram(idx)
#==
@sio.on('VIEW_PRESET_VOL_MESSAGE')
def processPresetVolumeMessage(payload):
  global gPresetDict
  global gInstrumentDict
  global gCurrentSongId
  global gCurrentSongIdx
  global gCurrentPresetId
  global gCurrentPreset

  printDebug(payload)
  if payload['songId'] == gCurrentSongId:
    if payload['presetId'] != gCurrentPresetId:
      song = gBankSongList[gCurrentSongIdx]
      program = song.programList[payload['programIdx']]
      print(' ?? Not the same Preset > ', gCurrentPresetId)
      for preset in program['presetList']:
        if preset['refpreset'] == payload['presetId']:
          gCurrentPresetId = payload['presetId']
          gCurrentPreset = preset
          printDebug('Found new Preset')
          printDebug(gCurrentPreset)
          break
    else:
      print(' !! Same Preset > ', gCurrentPresetId)

    volume = payload['value']
    gCurrentPreset['volume'] = volume
    # printDebug(volume)
    #  'programIdx': 1, 'presetId': 3, 'instrumentId': 3, 'value': 73}
    channel = int( gInstrumentDict[str(gCurrentPreset['refinstrument'])] )
    if channel > 0:
      sendRaveloxCCMessage(channel, 7, volume)
  else:
    print('Not a current Song', gCurrentSongId)

#==
@sio.on('VIEW_PRESET_PAN_MESSAGE')
def processPresetVolumeMessage(payload):
  print(payload)
  # setSongProgram(idx)
#==
def sendProgramNotificationMessage(idx):
  sio.emit(PROGRAM_MESSAGE, str(idx))
  print(PROGRAM_MESSAGE + " >> " + str(idx))
#==
def sendSongNotificationMessage(id):
  sio.emit(SONG_MESSAGE, str(id))
  print(SONG_MESSAGE + " >>" + str(id))
#==
def sendGigNotificationMessage(id):
  sio.emit(GIG_MESSAGE, str(id))
  print(GIG_MESSAGE + " >>" + str(id))
#==
def sendPedal1NotificationMessage(value):
  sio.emit(PEDAL1_MESSAGE, str(value))
  printDebug(value)
#==
def sendPedal2NotificationMessage(value):
  sio.emit(PEDAL2_MESSAGE, str(value))
  printDebug(value)
#==

def sendSyncNotificationMessage(bankId, songId, programIdx):
  syncmessage = {}
  syncmessage['songId'] = songId
  syncmessage['programIdx'] = programIdx
  syncmessage['bankId'] = bankId

  jsonStr = json.dumps(syncmessage,
    indent=4, sort_keys=True, cls=CustomEncoder,
    separators=(',', ': '), ensure_ascii=False
  )
  sio.emit(SYNC_MESSAGE, jsonStr)
  # print(SYNC_MESSAGE + "=" +  jsonStr)
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
  global gSelectedGigId

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

  gGig = dataHelper.loadScheduledGig()
  gSelectedGigId = gGig.id
  # printDebug(gGig.shortSongList)

  gSongDict = dataHelper.loadSongs()
  # printDebug(gSongDict)

  gSongList = dataHelper.initAllSongs(gSongDict)
  # printDebug(gSongList)

  gGigSongList = dataHelper.initGigSongs(gGig.shortSongList, gSongDict)
  gInstrumentDict = dataHelper.initInstruments()
  gPresetDict = dataHelper.initPresets()
  gInstrumentBankDict = dataHelper.initInstrumentBanks()
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
  command = ""
  if code == 5:
    #shutdown RPi
    command = "/usr/bin/sudo ls -l //home/pi/sys"
  elif code == 6:
    #shutdown RPi
    gExitFlag = True
    command = "/usr/bin/sudo /home/pi/sys/shutdown.sh"
  elif code == 7:
    #reboot RPi
    gExitFlag = True
    command = "/usr/bin/sudo /home/pi/sys/reboot.sh"
  elif code == 8:
    #Set as Access Point
    gExitFlag = True
    command = "/usr/bin/sudo /home/pi/sys/net_accesspoint.sh"
  elif code == 9:
    #connect to home network
    gExitFlag = True
    command = "/usr/bin/sudo /home/pi/sys/net_vpnet.sh"
  elif code == 10:
    #connect to multiple networks phone/home/gz firebird
    command = "/usr/bin/sudo /home/pi/sys/networkmulti.sh-h"
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
def processRaveloxMessageQueue():
  global gRaveloxClient
  global gExitFlag
  global gMessageQueue
  global gQueueLock
  delay = MIN_DELAY
  while not gExitFlag:
    gQueueLock.acquire()
    if not gMessageQueue.empty():
      print (gMessageQueue.qsize())  
      message = gMessageQueue.get()
      gRaveloxClient.send( message )
      gQueueLock.release()
      delay = MIN_DELAY
      print ('Processed Message ->>>  ', message)
    else:
      gQueueLock.release()
      delay = MIN_DELAY * 100
    sleep(delay)
#----------------------------------------------------------------
def pushRaveloxMessageToQueue(message):
  global gMessageQueue 
  global gQueueLock

  gQueueLock.acquire()
  gMessageQueue.put(message)
  gQueueLock.release()
#----------------------------------------------------------------

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
  pushRaveloxMessageToQueue(message)
  # gRaveloxClient.send( message )
  # sleep(MIN_DELAY)
  print('new message ###  ', message)
  
  if gMode == 'Debug':
     printDebug("SEND RAVELOX CC  MESSAGE  to  queue %d %d %d" % (channel , CC, value))
#----------------------------------------------------------------
## 192 -PC on Channel 1
## 193 -PC on Channel 2
## 197 -PC on Channel 6

def sendRaveloxPCMessage( channel, PC):
  # global gRaveloxClient
  global gUseNewRaveloxMidi
  global gProcessRaveloxMidi

  if not gProcessRaveloxMidi: return

  message = ""
  if gUseNewRaveloxMidi:
    message = struct.pack( "BB", 192 + channel - 1, PC)
  else:
    message = struct.pack("BBB", 0xaa, 192 + channel - 1, PC)

  pushRaveloxMessageToQueue(message)
  # gRaveloxClient.send( message )
  # sleep(MIN_DELAY)
  
  if gMode == 'Debug':
     printDebug("SEND RAVELOX PC  MESSAGE %d %d" % (channel ,PC))
#----------------------------------------------------------------

def sendGenericMidiCommand(msg0, msg1, msg2):
  # global gRaveloxClient
  global gUseNewRaveloxMidi
  global gProcessRaveloxMidi

  if not gProcessRaveloxMidi: return

  message = ""
  if gUseNewRaveloxMidi:
    message = struct.pack("BBB", msg0, msg1, msg2)
  else:
    message = struct.pack("BBBB", 0xaa, msg0, msg1, msg2)

  pushRaveloxMessageToQueue(message)
  # gRaveloxClient.send( message )
  # sleep(MIN_DELAY)
  
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

def checkCurrentBank(bank):
  global gCurrentBank
  global gPlaySongFromSelectedGigOnly
  global gBankSongList
  global gGigSongList
  global gSongList
  global gGig
  global gSelectedGigId 

  if gCurrentBank != bank:
    if bank == 1:
      gPlaySongFromSelectedGigOnly = True
      gCurrentBank = bank
      gBankSongList = gGigSongList
      gSelectedGigId = gGig.id
    else:
      gPlaySongFromSelectedGigOnly = False
      gCurrentBank = 2
      gBankSongList = gSongList
      gSelectedGigId = -1

    sendGigNotificationMessage(gSelectedGigId)
#----------------------------------------------------------------

def resyncWithGigController():
  global gResyncCounter
  global gCurrentSongIdx
  global gCurrentSongId
  global gCurrentProgramIdx
  global gSelectedGigId 

  if gResyncCounter < 2:
    gResyncCounter = gResyncCounter + 1
  else:
    gCurrentSongId = gBankSongList[gCurrentSongIdx].id
    print('== gig ==', gSelectedGigId)
    print('== song ==', gCurrentSongId)
    print('-- Prog --', gCurrentProgramIdx) 
    sendSyncNotificationMessage( gSelectedGigId, gCurrentSongId, gCurrentProgramIdx)
    gResyncCounter = 0
#----------------------------------------------------------------
#----------------------------------------------------------------
def setSongProgram(idx):
  global gCurrentProgramIdx
  global gCurrentSongIdx
  global gBankSongList
  global gPedal1Value
  global gPedal2Value

  gCurrentProgramIdx = idx

  song = gBankSongList[gCurrentSongIdx]
  program = song.programList[idx]
  # printDebug(song.name)

  for preset in program['presetList']:
    #pprint.pprint(preset)
    setPreset(preset)

  sendProgramNotificationMessage(idx)

  # print(program['presetList'][0]['volume'])

  if  program['presetList'][0]['volume'] > 0:
    gPedal1Value = 1
  else:
    gPedal1Value = 2
  sendPedal1NotificationMessage(gPedal1Value)

  # print(program['presetList'][2]['volume'])
  if  program['presetList'][2]['volume'] > 0:
    gPedal2Value = 1
  else:
    gPedal2Value = 2
  sendPedal2NotificationMessage(gPedal2Value)

#----------------------------------------------------------------
def setPreset(preset):
  midiProgramChange = int( gPresetDict[str(preset['refpreset'])] )
  channel = int( gInstrumentDict[str(preset['refinstrument'])] )
  mute = preset['muteflag']

  if mute:
    muteChannel(channel, preset['volume'], 0.01, 10)

  sendRaveloxPCMessage(channel, midiProgramChange)

  if mute:
    unmuteChannel(channel, preset['volume'], 0.01, 10)
  else:
    sendRaveloxCCMessage( channel, VOLUME_CC, preset['volume'] )
#----------------------------------------------------------------

def selectNextSong():
  global gCurrentSongIdx
  global gBankSongList
  global gSelectedGigId
  global gCurrentSongId

  if gCurrentSongIdx + 1 < len(gBankSongList):
    gCurrentSongIdx = gCurrentSongIdx + 1
  else:
    gCurrentSongIdx = 0

  sendGigNotificationMessage(gSelectedGigId)
  gCurrentSongId = gBankSongList[gCurrentSongIdx].id
  sendSongNotificationMessage(gCurrentSongId)
  printDebug("next song " + gBankSongList[gCurrentSongIdx].name)

#----------------------------------------------------------------

def selectPreviousSong():
  global gCurrentSongIdx
  global gCurrentSongId
  global gBankSongList
  global gSelectedGigId

  if gCurrentSongIdx - 1 > -1:
    gCurrentSongIdx = gCurrentSongIdx - 1
  else: 
    gCurrentSongIdx = len(gBankSongList) - 1

  sendGigNotificationMessage(gSelectedGigId)  
  gCurrentSongId = gBankSongList[gCurrentSongIdx].id
  sendSongNotificationMessage(gCurrentSongId)
  printDebug("previous song " + gBankSongList[gCurrentSongIdx].name)

#----------------------------------------------------------------
def setSong(id):
  global gCurrentSongIdx
  global gBankSongList
  global gCurrentSongId

  idx = dataHelper.findIndexById(gBankSongList, id)
  if idx > -1:
    gCurrentSongId = id
    gCurrentSongIdx = idx
    setSongProgram(0)
    # sendSongNotificationMessage(id)
    print("Song selected. idx =", idx)
  else: 
    print("There is no Song with id =", id)
#----------------------------------------------------------------
def setPedal1Value():
  global gPedal1Value
  if gPedal1Value == 1:
    gPedal1Value = 2
  else:
    gPedal1Value = 1
  sendPedal1NotificationMessage(gPedal1Value)
#----------------------------------------------------------------
def setPedal2Value():
  global gPedal2Value
  if gPedal2Value == 1:
    gPedal2Value = 2
  else:
    gPedal2Value = 1
  sendPedal2NotificationMessage(gPedal2Value)
#----------------------------------------------------------------
def getActionForReceivedMessage(midiMsg):
  # printDebug("SEND MIDI MSG")
  global gReloadCounter
  global gSynthTest
  global gPianoTest
  global gPedal1Value
  global gPedal2Value

  msg = midiMsg[0]
  msg0 = msg[0]
  msg1 = msg[1]
  msg2 = msg[2]
  msgParameter = midiMsg[1]
  channel=-1

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
        setPedal1Value()
        #gPedal2_Channel = gChannel1
      elif  msg2 == 14: #pedal 4 #Second Volume pedal sends messages to ch 2
        setPedal2Value()
        #gPedal2_Channel = gChannel2

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
    if gPedal2Value == 1:
      channel = 1
    else:  
      channel = 2
    if channel > 0:
      sendRaveloxCCMessage(channel, 7, msg2)
    # printDebug('>>6--' + str(msg))

  elif msg0 == 181 and msg1 == 7:
    if gPedal1Value == 1:
      channel = 6
    else:  
      channel = 4
    # Send Volume to Channel 6 or 4 (or both ?)
    if channel > 0:
      sendRaveloxCCMessage(channel, 7, msg2)

  else:
     sendGenericMidiCommand(msg0, msg1, msg2)
    #  printDebug('>>8--' + str(msg))

#----------------------------------------------------------------
def getMidiMsg(midiInput):
#  printDebug(""))
  # printDebug("..... LISTEN TO MIDI MSG")
  x = 0
  gotMsg = 0
  while not(gotMsg):
    sleep(MIDI_RECEIVE_DELAY)
    if midiInput.poll():    
      gotMsg = 1
      inp = midiInput.read(100)
      for msg in inp:
        getActionForReceivedMessage(msg)  
      x = 0
    else:
      x = x + 1
    if x > KEEPALIVE_FREQUENCY:
      sendRaveloxCCMessage(KEEPALIVE_CHANNEL, 7, 0)
      printDebug('<<<keep alive >>>>')
      printDebug(x)
      x = 0

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

loadAllData()

checkCurrentBank(1)

gQueueLock = threading.Lock()
gMessageQueue = queue.Queue(60)
threadID = 1
thread = raveloxBackgroundThread(threadID)
thread.start()

if len(gBankSongList) > 0:
  gCurrentSongIdx = -1
  selectNextSong()
  gCurrentProgramIdx = 0

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


while not gExitFlag:
  getMidiMsg(midiInput)

#---Close application
#gRaveloxClient.close()
if gProcessRaveloxMidi:
  gRaveloxClient.shutdown(2)

del midiInput
pygame.midi.quit()
