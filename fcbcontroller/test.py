
import json

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

#----------------------------------------------------------------

#Global Variables

gGigSongList = []
gSongDict = {}
sio = None


#----------------------------------------------------------------

def printDebug(message):
  global gMode
  if gMode == 'Debug':
    print(message)
#----------------------------------------------------------------



def initSongs():
  global gGigSongList
  global gSongDict

  gSongDict = dataController.getSongList()
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
  global gGigSongList
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
#Main Module 
#pygame.init()

# print ("Parms = " , str(sys.argv))
# if len(sys.argv) > 1: 
#   if str(sys.argv[1]) == 'Debug':
#     gMode = 'Debug'


# runInit=False
# if len(sys.argv) > 1: 
#   if str(sys.argv[1]) == 'Init':
#     runInit = True

initSongs()

initSongItems()

# pringSongs()  
mc = MessageClient()

mc.initMessenger()
mc.sendSongNotificationMessage(1)
mc.sendProgramNotificationMessage(1)

