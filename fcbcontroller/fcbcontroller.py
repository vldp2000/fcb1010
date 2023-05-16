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
#import pygame
#import pygame.midi
import time
import sys
import struct
import subprocess
import queue
import threading

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
from tools import *
from midiMessage import *
from socketMessage import *
from itemSelection import *
from globalVar import *

#################################################################

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
      printDebug(gGig)

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
        printDebug(f">>>>>>----- Incoming Input = >>>>> {listInp} ")                   
        if ignoreInputMessage(msg[0]):  # Message comes as an array [[180,1,1],0] 
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
