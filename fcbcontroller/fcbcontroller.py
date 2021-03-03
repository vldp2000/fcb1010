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
import queue
import threading

import dataController
import dataHelper

from array import *
from time import sleep

from dataClasses import *
from config import *

import Adafruit_GPIO.SPI as SPI
import Adafruit_SSD1306

import displayData
import myutils
import pprint


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

gUseMessageQueue = True
gMessageQueue = None
gQueueLock = None

gProcessRaveloxMidi = True
gUseNewRaveloxMidi = True
gExitFlag = False
gInitialisationComplete = False
gMidiDevice = MIDI_INPUT_DEVICE  # Input MIDI device

#Global Variables
gSelectedGigId = -1
gGig = {}
gCurrentSong = {}

gInstrumentChannelDict = {}
gPresetDict= {}
gInstrumentBankDict = {}

gDebugMessageCounter = 0
gMode = 'Live'

gCurrentSongIdx = -1
gCurrentSongId = -1
gCurrentProgramIdx = -1
gCurrentPresetId = -1
gCurrentPreset = {}

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

gSystemCommandCounter = 0
gSystemCommandCode = -1

#---Print Debug utility-------------
def printDebug(message):
  global gMode
  if gMode == 'Debug':
    print(message)



sio = socketio.Client()
#---SOCKET--CLIENT-------------
@sio.event
def connect():
  try:
    printDebug('SOCKET connection established')
    displayData.setMessageAPIStatus(255)
    #displayData.drawScreen()
  except:
    printDebug('SOCKET connection can not be established')
    displayData.setMessageAPIStatus(0)
    displayData.drawScreen() 

#==
@sio.event
def message(data):
  printDebug(f"Message received with  {data}")

#== 
@sio.event
def disconnect():
  printDebug('disconnected from SOCKET server')
  displayData.setMessageAPIStatus(0)
  displayData.drawScreen() 

#==
@sio.on('VIEW_SONG_MESSAGE')
def processSongMessage(id):
  global gSongDict
  printDebug(f"VIEW_SONG_MESSAGE ID:  {id}")
  dataHelper.reloadSong(gSongDict, id)
  setSong(id)

#==
@sio.on('VIEW_PROGRAM_MESSAGE')
def processProgramMessage(idx):
  printDebug(f"VIEW_PROGRAM_MESSAGE IDX: {idx}")
  setSongProgram(idx)

#==
@sio.on('VIEW_PRESET_VOL_MESSAGE')
def processPresetVolumeMessage(payload):
  global gPresetDict
  global gInstrumentChannelDict
  global gCurrentSongId
  global gCurrentSongIdx
  global gCurrentPresetId
  global gCurrentPreset
  global gCurrentProgramIdx

  global gSystemCommandCounter
  gSystemCommandCounter = 0
  # print(payload)

  # print('gCurrentSongId ', gCurrentSongId)
  # print('gCurrentSongIdx ', gCurrentSongIdx)
  # print('gCurrentPresetId ', gCurrentPresetId)
  # print('gCurrentProgramIdx ', gCurrentProgramIdx)

  if payload['songId'] == gCurrentSongId and payload['programIdx'] == gCurrentProgramIdx:
    if payload['presetId'] != gCurrentPresetId:
      song = gBankSongList[gCurrentSongIdx]
      program = song["programList"][gCurrentProgramIdx]
      # print(program)
      # print(' ?? Not the same Preset > ', gCurrentPresetId)
      # print(program['presetList'])
      for preset in program['presetList']:
        if preset['refpreset'] == payload['presetId']:
          gCurrentPresetId = payload['presetId']
          gCurrentPreset = preset
          printDebug('Found new Preset')
          printDebug(gCurrentPreset)
          break
        # else:
        #   print(' <><><> Not the expected preset', preset['refpreset'])

    # else:
    #   print(' !! Same Preset > ', gCurrentPresetId)

    volume = payload['value']
    gCurrentPreset['volume'] = volume
    # printDebug(volume)
    #  'programIdx': 1, 'presetId': 3, 'instrumentId': 3, 'value': 73}
    channel = int( gInstrumentChannelDict[str(gCurrentPreset['refinstrument'])] )
    if channel > 0:
      sendRaveloxCCMessage(channel, 7, volume)
  # else:
  #   print('Not a current Song ??? ', gCurrentSongId)

#==
@sio.on('VIEW_PRESET_PAN_MESSAGE')
def processPresetVolumeMessage(payload):
  printDebug(payload)
  # setSongProgram(idx)

#==
def sendProgramNotificationMessage(idx):
  sio.emit(PROGRAM_MESSAGE, str(idx))
  printDebug(f"{PROGRAM_MESSAGE} >> {str(idx)}")

#==
def sendSongNotificationMessage(id):
  sio.emit(SONG_MESSAGE, str(id))
  printDebug(f'{SONG_MESSAGE}  >> { str(id)}')

#==
def sendGigNotificationMessage(id):
  sio.emit(GIG_MESSAGE, str(id))
  printDebug(f'{GIG_MESSAGE}  >> {str(id)}')

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
  global gSystemCommandCounter
  gSystemCommandCounter = 0

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


def clearScreenDebug():
  global gMode
  global gDebugMessageCounter
  if gMode == 'Debug':
    print("\n" * 10)
    print(f'               >> ----- {gDebugMessageCounter} -------<<' )
    gDebugMessageCounter = gDebugMessageCounter + 1


#----------------------------------------------------------------


def executeSystemCommand(code):
  global gExitFlag
  global gSystemCommandCounter
  global gSystemCommandCode
  # printDebug("EXECUTE SYSTEM COMMAND");
  command = ""
  displayText = ""

  if gSystemCommandCode != code and gSystemCommandCounter > 0:
    gSystemCommandCounter = 0

  if code == 1:
    #shutdown RPi
    displayText = 'SHUTDOWN'
    if gSystemCommandCounter > 0:
      displayData.drawShutdown()
    command = "/usr/bin/sudo /home/pi/sys/shutdown.sh"
  elif code == 2:
    #reboot RPi
    displayText = 'REBOOT'
    if gSystemCommandCounter > 0:
      displayData.drawReboot()
    command = "/usr/bin/sudo /home/pi/sys/reboot.sh"
  elif code == 3:
    #reboot RPi
    displayText = 'RESTART FCB1010'
    if gSystemCommandCounter > 0:
      displayData.drawReboot()
    command = "/usr/bin/sudo systemctl restart fcb1010.service"
  elif code == 4:
    #reboot RPi
    displayText = 'RESTART RAVELOX'
    if gSystemCommandCounter > 0:
      displayData.drawReboot()
    command = "/usr/bin/sudo systemctl restart raveloxmidi.service fcb1010.service"      

  #elif code == 6:
    #Set as Access Point
    #displayText = "Local Network"
    #command = "/usr/bin/sudo /home/pi/sys/net_local.sh"
  #elif code == 7:
    #Set as Access Point
    #displayText = 'Access Point'
    #command = "/usr/bin/sudo /home/pi/sys/net_accesspoint.sh"
  #elif code == 8:
    #connect to home network
    #displayText = 'VP NET'
    #command = "/usr/bin/sudo /home/pi/sys/net_vpnet.sh"
  #elif code == 9:
    #connect to iPhone
    #displayText = 'VP iPhone'
    #command = "/usr/bin/sudo /home/pi/sys/net_phone.sh"
  #elif code == 10:
    #connect to GZ Sphera
    #displayText = 'GZ Sphera'
    #command = "/usr/bin/sudo /home/pi/sys/net_sphera.sh"

  else:
    printDebug("ExecuteSystemCommand. Unknown command")
    return

  if gSystemCommandCounter > 0:
    gExitFlag = True 
    if command != "":
       printDebug("Code =%d, Command=%s" % (code, command))
       import subprocess
       process = subprocess.Popen(command.split(), stdout=subprocess.PIPE)
       output = process.communicate()[0]
       printDebug(output)
  else:
    displayData.drawSysCommand(displayText)
    printDebug(displayText)
    gSystemCommandCounter = gSystemCommandCounter + 1
    gSystemCommandCode = code  

#----------------------------------------------------------------
## 176 -CC Channel 1
## 177 -CC Channel 2
## 180 -CC Channel 5
## 181 -CC Channel 6

def connectRavelox():
  global gRaveloxClient
  try:
    #local_port = 5006

    #if len(sys.argv) == 1:
    #  family = socket.AF_INET
    #  connect_tuple = ( 'localhost', local_port )
    #else:
    #  details = socket.getaddrinfo( sys.argv[1], local_port, socket.AF_UNSPEC, socket.SOCK_DGRAM)
    #  family = details[0][0]
    #  if family == socket.AF_INET6:
    #    connect_tuple = ( sys.argv[1], local_port, 0, 0)
    #  else:   
    #    connect_tuple = ( sys.argv[1], local_port)

    #s = socket.socket( family, socket.SOCK_DGRAM )
    #s.connect( connect_tuple )

    connect_tuple = ( 'localhost', 5006 )
    gRaveloxClient = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    gRaveloxClient.connect( connect_tuple )
    
    displayData.setRaveloxmidiStatus(255)
    displayData.drawScreen()
    return True
  except:
    displayData.setRaveloxmidiStatus(0)
    displayData.drawScreen()
    printDebug('<<< exception. connectRavelox >>')
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
      #print (gMessageQueue.qsize())  
      broadcastMessage = gMessageQueue.get()
      gMessageQueue.task_done()
      gQueueLock.release()
      try:
        if (broadcastMessage.messageType == 'PC'):
          sleep(MIN_DELAY * 3.0)
          gRaveloxClient.send( broadcastMessage.message )
          #sleep(MIN_DELAY * 2.0)
          # gRaveloxClient.send( broadcastMessage.message )

        if (broadcastMessage.messageType == 'CC'):
          gRaveloxClient.send( broadcastMessage.message )

      except:
        displayData.setRaveloxmidiStatus(0)
        displayData.drawScreen()
        printDebug(f'<<< exception. processRaveloxMessageQueue >>{broadcastMessage}')

      delay = MIN_DELAY
      #printDebug (f'Processed Message ->>>  {message}')
    else:
      gQueueLock.release()
      delay = MIN_DELAY * 2.0
    sleep(delay)

#----------------------------------------------------------------
def pushRaveloxMessageToQueue(broadcastMessage):
  global gMessageQueue 
  global gQueueLock

  gQueueLock.acquire()
  gMessageQueue.put(broadcastMessage)
  gQueueLock.release()

#----------------------------------------------------------------

def sendRaveloxCCMessage(channel, CC, value):
  global gRaveloxClient
  global gUseNewRaveloxMidi
  global gProcessRaveloxMidi
  global gUseMessageQueue

  if not gProcessRaveloxMidi: return
  
  message = ""
  if gUseNewRaveloxMidi:
    message = struct.pack( "BBB", 176 + int(channel) - 1, int(CC), int(value))
  else:
    message = struct.pack("BBBB", 0xaa, 176 + int(channel) - 1, int(CC), int(value))

  if gUseMessageQueue:
    broadcastMessage = BroadcastMessage(message, 'CC')  
    pushRaveloxMessageToQueue(broadcastMessage)
  else:
    gRaveloxClient.send(message )
    sleep(MIN_DELAY)

  printDebug(f"channel {channel} , CC {CC} value {value} ")

#----------------------------------------------------------------

## 192 -PC on Channel 1
## 193 -PC on Channel 2
## 197 -PC on Channel 6

def sendRaveloxPCMessage( channel, PC):
  # global gRaveloxClient
  global gUseNewRaveloxMidi
  global gProcessRaveloxMidi
  global gUseMessageQueue

  if not gProcessRaveloxMidi: return

  message = ""
  if gUseNewRaveloxMidi:
    message = struct.pack( "BB", 192 + int(channel) - 1, int(PC))
  else:
    message = struct.pack("BBB", 0xaa, 192 + int(channel) - 1, int(PC))

  if gUseMessageQueue:
    broadcastMessage = BroadcastMessage(message, 'PC')  
    pushRaveloxMessageToQueue(broadcastMessage)
  else:
    gRaveloxClient.send(message )    
    sleep(MIN_DELAY)
  
  #if gMode == 'Debug':
  #   printDebug("SEND RAVELOX PC  MESSAGE %d %d" % (channel ,PC))

#----------------------------------------------------------------

def sendGenericMidiCommand(msg0, msg1, msg2):
  # global gRaveloxClient
  global gUseNewRaveloxMidi
  global gProcessRaveloxMidi
  global gUseMessageQueue

  if not gProcessRaveloxMidi: return

  message = ""
  if gUseNewRaveloxMidi:   
    message = struct.pack("BBB", msg0, msg1, msg2)
  else:
    message = struct.pack("BBBB", 0xaa, msg0, msg1, msg2)

  if gUseMessageQueue:
    broadcastMessage = BroadcastMessage(message, 'CC')  
    pushRaveloxMessageToQueue(broadcastMessage)
  else:
    gRaveloxClient.send(message )      
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
      #sleep(delay)
    sendRaveloxCCMessage(channel, VOLUME_CC, 0 )

#----------------------------------------------------------------
def unmuteChannel(channel, volume, delay, step):
  x = step
  while x < volume:
    sendRaveloxCCMessage( channel, VOLUME_CC, x )
    x = x + step
    #sleep(delay)
  sendRaveloxCCMessage(channel, VOLUME_CC, volume )

#----------------------------------------------------------------
#----------------------------------------------------------------
#----------------------------------------------------------------
def loadAllData():
  global gSelectedGigId
  global gGig
  global gCurrentSong
  global gInstrumentChannelDict
  global gInstrumentBankDict
  global gPresetDict
  global gInitialisationComplete

  printDebug(' << Load All Data >>')
  if gGig: # check if dictionary is not empty
    gGig = None
  if gCurrentSong:
    gCurrentSong = None
  if gInstrumentChannelDict:
    gInstrumentChannelDict.clear()
  if gInstrumentBankDict:
    gInstrumentBankDict.clear()
  if gPresetDict:
    gPresetDict.clear()
  
  printDebug(' << All objects and collections are cleared>>')

  try:
    gGig = dataHelper.loadScheduledGig()
    if gGig: # check if dictionary is not empty
      print(gGig)
      gSelectedGigId = gGig["id"]
      pprint.pprint(gGig["shortSongList"])
    else:
      displayData.drawError("Gig not found")
      sleep(1)
    #gGigSongList = dataHelper.initGigSongs(gGig.shortSongList, gSongDict)
    
    gInstrumentChannelDict = dataHelper.initInstruments()
    if not gInstrumentChannelDict:
      displayData.drawError("Instruments not found")
      sleep(1)
    
    gPresetDict = dataHelper.initPresets()
    if not gInstrumentChannelDict:
      displayData.drawError("Presets not found")
      sleep(1)
      
    gInstrumentBankDict = dataHelper.initInstrumentBanks()
    if not gInstrumentChannelDict:
      displayData.drawError("Banks not found")
      sleep(1)

    displayData.setDataAPIStatus(255)
    gInitialisationComplete = True

  except:
    displayData.setDataAPIStatus(0)
    displayData.drawScreen()
    print ('<< Exception. loadAllData >>')
    gInitialisationComplete = False

#----------------------------------------------------------------

def selectNextSong(step):
  global gGig
  global gCurrentSongIdx
  global gSystemCommandCounter

  gSystemCommandCounter = 0
  
  if step > 0:
    if gCurrentSongIdx + step < len(gGig["shortSongList"]):
      gCurrentSongIdx = gCurrentSongIdx + step
    else:
      gCurrentSongIdx = 0
  else:
    if gCurrentSongIdx - step > -1:
      gCurrentSongIdx = gCurrentSongIdx - step
    else: 
      gCurrentSongIdx = len(gGig["shortSongList"]) - 1
  
  printDebug(gCurrentSongIdx) 
  #sendGigNotificationMessage(gSelectedGigId)
  id = gGig["shortSongList"][gCurrentSongIdx]["id"]
  printDebug(id); 
  setCurrentSong(id)
  sendSongNotificationMessage(gCurrentSongId)
  
  #displayData.drawScreen()
#----------------------------------------------------------------

def setCurrentSong(id):
  global gCurrentSongIdx
  global gCurrentSong

  try:
    gCurrentSong = dataController.getSong(id)
    pprint.pprint(gCurrentSong)
    if gCurrentSong:
      gCurrentSongId = gCurrentSong["id"]
      name = gCurrentSong["name"]
      printDebug("next song " +name)
      displayData.setSongName(f"{gCurrentSongIdx}.{name}")
    
      setSongProgram(0)
      # sendSongNotificationMessage(id)
      printDebug(f"Song selected. idx ={idx}")
    else: 
      printDebug(f"Error.Song id={id}")
      displayData.drawError("Song corrupted")
      sleep(1)

  except:
      displayData.drawError("Song not found")
      sleep(1)


    #displayData.setSongName()
    #displayData.drawScreen()


#----------------------------------------------------------------

def setSongProgram(idx):
  global gCurrentProgramIdx
  global gCurrentSongIdx
  global gBankSongList
  global gPedal1Value
  global gPedal2Value
  global gSystemCommandCounter
  gSystemCommandCounter = 0

  gCurrentProgramIdx = idx

  program = gCurrentSong["programList"][idx]
  #printDebug(program['name'])
  #printDebug(program['tytle'])

  for preset in program['presetList']:
    #pprint.pprint(preset)
    setPreset(program, preset)
    
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
def setPreset(program, songPreset):
  id = songPreset['refpreset']
  #print(id)
  preset = gPresetDict[str(id)] 
  #print(preset)

  midiProgramChange = int(preset['midipc'])
  channel = int( gInstrumentChannelDict[str(songPreset['refinstrument'])] )

  mute = songPreset['muteflag']
  if mute:
    muteChannel(channel, songPreset['volume'], MIN_DELAY, 10)

  sendRaveloxPCMessage(channel, midiProgramChange)

  if mute:
    unmuteChannel(channel, songPreset['volume'], MIN_DELAY, 10)
  else:
    sendRaveloxCCMessage( channel, VOLUME_CC, songPreset['volume'] )

  if preset['refinstrument'] == 1:
    displayData.setProgramName(f"{program['name']}.{preset['name']}")
    displayData.drawScreen()

  #printDebug(f"channel {channel} , instrument {preset['refinstrument']} preset {songPreset['refpreset']}  preset volume {songPreset['volume']} , delay {songPreset['delayvalue']}, reverb {songPreset['reverbvalue']}  ")

  #delayFlag = songPreset['delayflag']
  #if delayFlag:
  #  sendRaveloxCCMessage( channel, DELAY_TIME_CC , songPreset['delayvalue'] )

  #reverbFlag = songPreset['reverbflag']
  #if reverbFlag:
  #  sendRaveloxCCMessage( channel, REVERB_LENGTH_CC , songPreset['reverbvalue'] )


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

      if msg2 == 11: #Pedal1 
        clearScreenDebug()
        setSongProgram(0)
      elif msg2 == 12: #Pedal2
        clearScreenDebug()
        setSongProgram(1)
      elif msg2 == 13: #Pedal3
        clearScreenDebug()
        setSongProgram(2)
      elif msg2 == 14: #Pedal4
        clearScreenDebug()
        setSongProgram(3)


      elif msg2 == 18: #pedal 8 #Second Volume pedal sends messages to ch 1
        setPedal1Value()
        #gPedal2_Channel = gChannel1
      elif  msg2 == 19: #pedal 9 #Second Volume pedal sends messages to ch 2
        setPedal2Value()
        #gPedal2_Channel = gChannel2

      elif msg2 == 15: #Pedal5
        clearScreenDebug()
        selectNextSong(-1)
        setSongProgram(0)
      elif msg2 == 20: #Pedal10
        clearScreenDebug()
        selectNextSong(1)
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
    printDebug(f'sendGenericMidiCommand  -- >>-- {str(msg)}')

#----------------------------------------------------------------
def getMidiMsg(midiInput):
#  printDebug(""))
  # printDebug("..... LISTEN TO MIDI MSG")
  keepAliveCounter = 0
  checkRaveloxCounter = 0
  gotMsg = 0
  while not(gotMsg):
    sleep(MIDI_RECEIVE_DELAY)
    if midiInput.poll():    
      gotMsg = 1
      inp = midiInput.read(100)
      for msg in inp:
        getActionForReceivedMessage(msg)  
        #sleep(0.002)
      keepAliveCounter = 0
      checkRaveloxCounter = 0
    else:
      keepAliveCounter = keepAliveCounter + 1
      checkRaveloxCounter = checkRaveloxCounter + 1

    if keepAliveCounter > KEEPALIVE_FREQUENCY:
      sendRaveloxCCMessage(KEEPALIVE_CHANNEL, 7, 0)
      keepAliveCounter = 0

    if checkRaveloxCounter > CHECK_RAVELOX_CLIENT_FREQUENCY:
      getListOfRaveloxMidiClients()
      checkRaveloxCounter = 0
#----------------------------------------------------------------

def getListOfRaveloxMidiClients():
  global gRaveloxClient
  # Request status
  bytes = struct.pack( '4s', b'LIST' )

  #print(bytes)
  data = ''
  result = ''
  gRaveloxClient.sendall( bytes )

  x = 0
  while True:
    try:
      data,addr = gRaveloxClient.recvfrom(8192)
      if data:
        result = dataHelper.unicodetoASCII(str(data))
        break
    except:
      pass
    sleep(MIN_DELAY)
    if (x > 5):
      break
    x = x + 1   
  #----  
  if result.find("Vlad-iPad") > -1:
    displayData.g_iPadStatus = 255
  else:
   displayData.g_iPadStatus = 0
  if result.find("Vlad's MacBook Pro") > -1:
    displayData.g_MacBookStatus = 255
  else:
    displayData.g_MacBookStatus = 0

  displayData.drawScreen()
  printDebug(result)
#----------------------------------------------------------------
#----------------------------------------------------------------
#----------------------------------------------------------------

#Main Module 
#pygame.init()
pygame.midi.init()

displayData.initDisplay()
displayData.clearScreen()

displayData.drawScreen()
sleep(3)
#displayData.clearScreen()

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

#displayData.setMessageAPIStatus(255)
#displayData.drawScreen()

if gUseMessageQueue:
  gQueueLock = threading.Lock()
  gMessageQueue = queue.Queue(0)
  threadID = 1
  thread = raveloxBackgroundThread(threadID)
  thread.start()
  sleep(1)

portOk = False
midiInput = None

while not portOk:
  try:
    # result = initRaveloxClient()
    result = connectRavelox()

    if result:
      midiInput = pygame.midi.Input(gMidiDevice)
      sleep(0.04)
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

getListOfRaveloxMidiClients()

sleep(MIN_DELAY)
loadAllData()
sleep(MIN_DELAY)

if gGig["shortSongList"]:
  gCurrentSongIdx = -1
  gCurrentSongId = -1
  selectNextSong(1)
  gCurrentProgramIdx = 0
  #setSongProgram(gCurrentProgramIdx)

while not gExitFlag:
  getMidiMsg(midiInput)

#---Close application
#gRaveloxClient.close()
if gProcessRaveloxMidi:
  gRaveloxClient.shutdown(2)

del midiInput
pygame.midi.quit()
