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
import struct
import subprocess
import queue
import threading

import socket
import socketio

import Adafruit_GPIO.SPI as SPI
import Adafruit_SSD1306

import dataController
import dataHelper

from array import *
from time import sleep

from dataClasses import *
from config import *
import displayData
import myutils
import pprint

#################################################################

#Global Var

gExitFlag = False
gInitialisationComplete = False


#Global Variables
gSelectedGigId = -1
gGig = {}
gCurrentSong = {}

gInstrumentChannelDict = {}
gPresetDict = {}
gInstrumentBankDict = {}

gDebugMessageCounter = 0
gMode = 'Live'
gConfigChannel = 0

gCurrentSongIdx = -1
gCurrentSongId = -1
gCurrentProgramIdx = -1
gCurrentPresetId = -1
gCurrentPreset = {}


gPedal1MaxVolume = 0
gPedal2MaxVolume = 0

#default value for second  volume pedal is 176 = 1st channel
#gPedal2_Channel = 176
#gChannel1 = 176
#gChannel2 = 177

gCurrentPCList = [0, 0, 0, 0]
gCurrentVolumeList = [0, 0, 0, 0]
gCurrentDelayList = [False, False, False, False]
gCurrentReverbList = [False, False, False, False]
gCurrentModList = [False, False, False, False]

gSystemCommandCounter = 0
gSystemCommandCode = -1

gMidiOutput = None

gDebugFlag = False



#---Print Debug utility-------------
def printDebug(message):
  global gDebugFlag
  if gDebugFlag:
    print(message)


#############################################################
#Socket

sio = socketio.Client()
#---SOCKET--CLIENT-------------
@sio.event
def connect():
  global displayData
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
  setCurrentSong(id)

#==
@sio.on('VIEW_PROGRAM_MESSAGE')
def processProgramMessage(idx):
  printDebug(f"VIEW_PROGRAM_MESSAGE IDX: {idx}")
  setSongProgram(idx)

#==

@sio.on('VIEW_EDIT_MODE_MESSAGE')
def processControllerModeMessage(payload):
  global gMode
  global gConfigChannel
  printDebug(f"->->  Received message VIEW_EDIT_MODE_MESSAGE = {payload}")
  if str(payload) == '0':
    gMode = 'Live'
    displayData.drawScreen()
  else:
    gMode = 'Config'
    displayData.drawMessage("Mode","Config")

  gConfigChannel = int(payload)

  printDebug(f"->->  Mode =>{gMode}  Channel={gConfigChannel}")
  
#==
def sendProgramNotificationMessage(idx):
  sio.emit(PROGRAM_MESSAGE, str(idx))
  #printDebug(f"{PROGRAM_MESSAGE} >> {str(idx)}")

#==
def sendSongNotificationMessage(id):
  sio.emit(SONG_MESSAGE, str(id))
  #printDebug(f'{SONG_MESSAGE}  >> { str(id)}')

#==
def sendGigNotificationMessage(id):
  sio.emit(GIG_MESSAGE, str(id))
  #printDebug(f'{GIG_MESSAGE}  >> {str(id)}')

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
def sendPresetVolume(value):
  sio.emit(PRESETVOLUME_MESSAGE, str(value))
  printDebug(f"Send message  PRESETVOLUME_MESSAGE {value}")

#----------------------------------------------------------------
def clearScreenDebug():
  global gDebugFlag
  global gDebugMessageCounter
  if gDebugFlag == 'Debug':
    print("\n" * 2)
    print(f'               >> ----- {gDebugMessageCounter} -------<<' )
    gDebugMessageCounter = gDebugMessageCounter + 1




#################################################################
#Selection

def selectNextSong(step):
  #global gGig
  global gCurrentSongIdx
  global gSystemCommandCounter
  #global gSelectedGigId

  gSystemCommandCounter = 0
  if step > 0:
    if (gCurrentSongIdx + step < len(gGig["shortSongList"])):
      gCurrentSongIdx = gCurrentSongIdx + step
    else:
      gCurrentSongIdx = 0
  else:
    if gCurrentSongIdx + step > -1:
      gCurrentSongIdx = gCurrentSongIdx + step
    else: 
      gCurrentSongIdx = len(gGig["shortSongList"]) - 1

  sendGigNotificationMessage(gSelectedGigId)
  #sleep(MIN_DELAY)
  id = gGig["shortSongList"][gCurrentSongIdx]["id"]
  #printDebug(f"Select song. id={id}")

  setCurrentSong(id)
  sendSongNotificationMessage(id)
  
  #displayData.drawScreen()
#----------------------------------------------------------------

def setCurrentSong(id):
  #global gCurrentSongIdx
  global gCurrentSong
  global gCurrentSongId

  try:
    if gCurrentSong:
      gCurrentSong.clear()
      gCurrentSong = None

    #gCurrentSong = dataController.getSong(id)
    gCurrentSong = dataController.readSongFromJson(id)

    if gCurrentSong:
      gCurrentSongId = gCurrentSong["id"]
      name = gCurrentSong["name"]
      #printDebug( f"Selected song = {name}" )
      displayData.setSongName(f"{gCurrentSongIdx}.{name}")
      setSongProgram(0)
    else: 
      printDebug("Song corrupted")
      displayData.drawError("Song corrupted")
      #sleep(1)

  except:
      printDebug("Song not found")
      displayData.drawError("Song not found")
      #sleep(1)

    #displayData.setSongName()
    #displayData.drawScreen()


#----------------------------------------------------------------

def setSongProgram(idx):
  global gCurrentProgramIdx
  #global gCurrentSongIdx
  #global gCurrentSong
  global gPedal1MaxVolume
  global gPedal2MaxVolume
  global gSystemCommandCounter

  gSystemCommandCounter = 0
  gCurrentProgramIdx = idx
 
  program = gCurrentSong["programList"][idx]

  if program:
    printDebug( f"Selected program. idx={idx}" )
    i = 0
    for songPreset in program['presetList']:
      setPreset(program, songPreset, i)
      i = i + 1

    #sleep(MIN_DELAY)
    #setPreset(program, program['presetList'][1], 0)

    sendProgramNotificationMessage(idx)
    if  program['presetList'][0]['volume'] > 0:
      gPedal1MaxVolume = program['presetList'][0]['volume']
    else:
      gPedal1MaxVolume = program['presetList'][1]['volume']
    
    if program['presetList'][2]['volume'] > 0:
      gPedal2MaxVolume = program['presetList'][2]['volume']
    else:
      gPedal2MaxVolume = program['presetList'][3]['volume']
  else:
    printDebug(f"Program {idx} not found")    
    displayData.drawError(f"Program {idx} not found")
    #sleep(1)


#----------------------------------------------------------------
def setPreset(program, songPreset, idx):
  global gCurrentPCList
  global gCurrentVolumeList
  global gInstrumentChannelDict
  global gPresetDict


  id = songPreset['refpreset']
  preset = gPresetDict[str(id)] 
  #printDebug(f"Preset Selected  id={id} name ={preset['name']}")

  if preset:
    #printDebug(f" >>  idx = {idx} ")
    channel = int( gInstrumentChannelDict[str(songPreset['refinstrument'])] )
    newPC = int(preset['midipc'])
    newVolume = songPreset['volume']
    mute = songPreset['muteflag']
    #currentDelay
    oldPC = gCurrentPCList[idx]
    oldVolume = gCurrentVolumeList[idx]

    #printDebug(f" >> oldPC={oldPC} oldV={oldVolume} , newPC={newPC}  newV={newVolume}")  
    samePC = False
    if newPC == oldPC and newPC > 0:
      samePC = True
      if mute:
        muteChannel(channel, oldVolume, MIN_DELAY, 20)
        sendPCMessage(channel, newPC)
        processProgramEffects(samePC, idx, channel, songPreset)
        unmuteChannel(channel, newVolume, MIN_DELAY, 20)

    elif newPC != oldPC:
      if newPC == 0:
        sendCCMessage( channel, VOLUME_CC, 0)
        sendPCMessage(channel, newPC)
        sendCCMessage( channel, VOLUME_CC, 0)
      else:
        if mute:
          muteChannel(channel, oldVolume, MIN_DELAY, 10)

        sendPCMessage(channel, newPC)
        processProgramEffects(samePC, idx, channel, songPreset)

        if mute:
          unmuteChannel(channel, newVolume, MIN_DELAY, 20)

        #sleep(MIN_DELAY)
        sendCCMessage( channel, VOLUME_CC, newVolume )

      if preset['refinstrument'] == 1:
        #printDebug(f" Selected Program ={program['name']}  -  Preset = {preset['name']} ")    
        displayData.setProgramName(f"{program['name']}.{preset['name']}")

    gCurrentPCList[idx] = newPC
    gCurrentVolumeList[idx] = newVolume
    displayData.drawScreen()
  else:
    printDebug(f"Preset {id} not found")    
    displayData.drawError(f"Preset {id} not found")
    sleep(0.2)


################################################################
#Send Midi
#----------------------------------------------------------------

def sendCCMessage(channel, CC, value):
  global gMidiOutput
  gMidiOutput.write_short(0xb0 + int(channel) - 1, int(CC), int(value))
  sleep(MIN_DELAY)
#----------------------------------------------------------------

## 192 -PC on Channel 1
## 193 -PC on Channel 2
## 197 -PC on Channel 6

def sendPCMessage( channel, PC):
  sleep(MIN_DELAY)
  gMidiOutput.write_short(0xc0 + int(channel) - 1, int(PC))
  sleep(MIN_DELAY+MIN_DELAY)
  printDebug("SEND PC  MESSAGE %d %d" % (channel ,PC))

#----------------------------------------------------------------

def sendGenericMidiCommand(msg0, msg1, msg2):
  #    message = struct.pack("BBB", msg0, msg1, msg2)
  gMidiOutput.write_short(0xb0 + int(msg0), msg1, msg2)
  printDebug("SEND GENERIC MESSAGE %d %d %d" % (msg0, msg1, msg2))

#----------------------------------------------------------------

def muteChannel(channel, volume, delay, step):
  if volume > 0:
    x = volume
    while x > 0:
      sendCCMessage( channel, VOLUME_CC, x )
      x = x - step
      #sleep(delay)
    sendCCMessage(channel, VOLUME_CC, 0 )

#----------------------------------------------------------------
def unmuteChannel(channel, volume, delay, step):
  x = step
  while x < volume:
    sendCCMessage( channel, VOLUME_CC, x )
    x = x + step
    sleep(delay)

def processProgramEffects(samePCFlag, idx,channel, songPreset):
  global gCurrentDelayList
  global gCurrentReverbList
  global gCurrentModList

  oldDelay = False
  oldReverb = False
  oldMod = False
  
  if (samePCFlag):   
    oldDelay = int(gCurrentDelayList[idx]) == 1
    oldReverb = int(gCurrentReverbList[idx]) == 1
    oldMod = int(gCurrentModList[idx]) == 1

  delayFlag = int(songPreset['delayflag']) == 1
  if delayFlag != oldDelay:
    sendCCMessage( channel,DELAY_EFFECT_OFF_CC, 0)

  reverbFlag = int(songPreset['reverbflag']) == 1
  if reverbFlag != oldReverb:
    sendCCMessage( channel,REVERB_EFFECT_OFF_CC, 0)

  modeFlag = int(songPreset['modeflag']) == 1
  if modeFlag != oldMod:
    sendCCMessage( channel, MOD_EFFECT_OFF_CC, 0)

  if (idx==0):
    printDebug(songPreset)
    printDebug(f">>>  idx = {idx},  samepc = {samePCFlag}, delay {oldDelay} >> {delayFlag} , reverb {oldReverb} >> {reverbFlag} ,  mod {oldMod} >> {modeFlag} ,  channel = {channel}")

  gCurrentDelayList[idx] = delayFlag
  gCurrentReverbList[idx] = reverbFlag
  gCurrentModList[idx] = modeFlag

###############################################################
def executeSystemCommand(code):
  global gExitFlag
  global gSystemCommandCounter
  global gSystemCommandCode
  
  printDebug("EXECUTE SYSTEM COMMAND")
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
  #elif code == 4:
    #reboot RPi

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
    gGig.clear()
#    gGig = None
  if gCurrentSong:
    gCurrentSong.clear()
#    gCurrentSong = None
  if gInstrumentChannelDict:
    gInstrumentChannelDict.clear()
    gInstrumentChannelDict.clear()
  if gInstrumentBankDict:
    gInstrumentBankDict.clear()
    gInstrumentBankDict.clear()
  if gPresetDict:
    gPresetDict.clear()
    gPresetDict.clear()
  
  printDebug(' << All objects and collections are cleared>>')

  try:
    gGig = dataHelper.loadScheduledGig()
    
    if gGig: # check if dictionary is not empty
      gSelectedGigId = gGig["id"]
      displayData.drawMessage("Gig loaded", gGig["name"])
    else:
      displayData.drawError("Gig not found")
      printDebug("Gig not found")
    sleep(1)

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
    printDebug ('<< Exception. loadAllData >>')
    gInitialisationComplete = False

#----------------------------------------------------------------


#----------------------------------------------------------------
#----------------------------------------------------------------
def getActionForReceivedMessage(midiMsg):
  global gMode
  global gConfigChannel
  global gReloadCounter
  global gSynthTest
  global gPianoTest
  global gPedal1MaxVolume
  global gPedal2MaxVolume

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
      if msg2 < 5:
        gMode = 'Live'
        executeSystemCommand(msg2)
      return
    elif msg1 == 1:
      return
    elif msg1 == 20: #FCB1010 bank 8 is programmed to send msg1 == 20  for Banks 0 - 3 
      gMode = 'Live'
      gConfigChannel = 0
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


      #elif msg2 == 18: #pedal 8 #Second Volume pedal sends messages to ch 1
        #gPedal2_Channel = gChannel1
      #elif  msg2 == 19: #pedal 9 #Second Volume pedal sends messages to ch 2
        #gPedal2_Channel = gChannel2

      elif msg2 == 15: #Pedal5
        clearScreenDebug()
        selectNextSong(-1)
        #setSongProgram(0)
      elif msg2 == 20: #Pedal10
        clearScreenDebug()
        selectNextSong(1)
        #setSongProgram(0)

      # gSynthTest = 0
      # gPianoTest = 0

  elif msg0 == 176 and msg1 == 7:
    # Send Volume to Channel 1  and channel 2
    printDebug(gMode)
    if (gMode == 'Live'):
      if (msg2 <= gPedal2MaxVolume):
        channel = 1
        sendCCMessage(channel, 7, msg2)
        channel = 2
        sendCCMessage(channel, 7, msg2)
      else:
        printDebug(f"The volume for Pedal2 is higher than the limit {msg2} > {gPedal2MaxVolume}")
    elif gMode == 'Config':
      if gConfigChannel > 0:
        sendCCMessage(gConfigChannel, 7, msg2)
      sendPresetVolume(msg2)        
    else:
      printDebug(f"Unknown application mode")
      displayData.drawError('Unknown mode')
      gMode = 'Live'
      gConfigChannel = 0

  elif msg0 == 181 and msg1 == 7:
    # Send Volume to Channel 6  and  channel 4
    printDebug(gMode)
    if (gMode == 'Live'):
      if (msg2 <= gPedal1MaxVolume):
        channel = 4
        sendCCMessage(channel, 7, msg2)
        channel = 6
        sendCCMessage(channel, 7, msg2)
      else:
        printDebug(f"The volume for Pedal1 is higher than the limit {msg2} > {gPedal1MaxVolume}")
    elif gMode == 'Config':
      if gConfigChannel > 0:
        sendCCMessage(gConfigChannel, 7, msg2)
        sendPresetVolume(msg2)          
    else:
      printDebug(f"Unknown application mode")
      displayData.drawError('Unknown mode')
      gMode = 'Live'
      gConfigChannel = 0
  else:    
    gMode = 'Live'
    gConfigChannel = 0
#----------------------------------------------------------------

def ignoreInputMessage(msg):
  if msg[0] == 176 and msg[1] == 7:
    return False
  elif msg[0] == 181 and msg[1] == 7:    
    return False
  elif msg[0] == 180 and msg[1] == 20:
    return False
  elif msg[0] == 180 and msg[1] == 3:
    return False
  elif msg[0] == 180 and msg[1] == 1 and msg[2] > 0 and msg[2] < 5:
    return True
  else:
    return True

#----------------------------------------------------------------
def getMidiMsg(midiInput):
  keepAliveCounter = 0
  gotMsg = False
  print("-----")
  if not gMidiOutput:
    print("gMidiOutput is not set")  
  
  while not(gotMsg):
    if midiInput.poll():    
      gotMsg = True
      inputData = midiInput.read(100)
      for msg in inputData:
        listInp = list(msg)
        if ignoreInputMessage(msg[0]):  # Message comes as an array [[180,1,1],0] 
          printDebug(f"xxxxxx----- Ignore  Input = xxxxx {listInp} ")                   
          continue
        else:
          printDebug(f">>>>>>----- Incoming Input = >>>>> {listInp} ")       
          getActionForReceivedMessage(msg)

#----------------------------------------------------------------


#Main Module 
pygame.midi.init()

displayData.initDisplay()
displayData.clearScreen()


if len(sys.argv) > 1: 
  if str(sys.argv[1]).upper() == 'DEBUG':
    gDebugFlag = True

#Show the list of available midi devices
printDebug(pygame.midi.get_count())
if gDebugFlag :
  for id in range(pygame.midi.get_count()):
    printDebug( "Id=%d Device=%s" % (id,pygame.midi.get_device_info(id)) )

# sio = socketio.Client()
sio.connect('http://localhost:8081')

#displayData.setMessageAPIStatus(255)
#displayData.drawScreen()

midiInput = None

while True:
  try:
    midiInput = pygame.midi.Input(MIDI_INPUT_DEVICE)  # Input MIDI device
    gMidiOutput = pygame.midi.Output(MIDI_OUTPUT_DEVICE, 0)  # Output MIDI device

    if midiInput:
      printDebug("Input MIDI devices is connected")
      sleep(0.04)

      if gMidiOutput:
        gMidiOutput.set_instrument(0)
        printDebug("Output MIDI devices is connected")
        sleep(0.04)
        break
  except:
    printDebug("MIDI device not ready....")
    pygame.midi.quit()
    sleep(1)
    pygame.midi.init()
  sleep(0.5)

printDebug("Everything ready now...")

loadAllData()

sleep(MIN_DELAY)
if (gGig):
  if (gGig["shortSongList"]):
    gCurrentSongIdx = -1
    gCurrentSongId = -1
    selectNextSong(1)
    gCurrentProgramIdx = 0
    #setSongProgram(gCurrentProgramIdx)

while not gExitFlag:
  getMidiMsg(midiInput)

del midiInput
pygame.midi.quit()
