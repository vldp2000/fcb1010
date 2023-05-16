import pygame
import pygame.midi
import time
from time import sleep
from config import *
from tools import *

gMidiOutput = None

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

def processProgramEffects(channel, songPreset):
  delayFlag = songPreset['delayflag']
  if delayFlag:
    sendCCMessage( channel,DELAY_EFFECT_OFF_CC, 0)

  reverbFlag = songPreset['reverbflag']
  if reverbFlag:
    sendCCMessage( channel,REVERB_EFFECT_OFF_CC, 0)

  modeflag = songPreset['modeflag']
  if modeflag:
    sendCCMessage( channel, MOD_EFFECT_OFF_CC, 0)
  

