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

#----------------------------------------------------------------

def printDebug(message):
  global gMode
  if gMode == 'Debug':
    print(message)

#----------------------------------------------------------------
class CustomEncoder(json.JSONEncoder):
  def default(self, o):
    return {'{}'.format(o.__class__.__name__): o.__dict__}

#----------------------------------------------------------------

#Global Variables

gGigSongList = []
gSongDict = {}

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

  x=0
  for prg in data:
    # program = Program(**prg)
    # song.programs.append(program)
    print('--------------------')
    # p = song.programs[x]
    print(prg)
    x = x + 1
  

    # for prs in songProgramPresets:


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



