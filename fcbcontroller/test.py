
import json

import io

import pygame
import pygame.midi
import time
import sys
# import socket
import struct
import subprocess
from array import *
from time import sleep

import pprint


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




#----------------------------------------------------------------
#Main Module 
pygame.midi.init()

printDebug(pygame.midi.get_count())
if gMode == 'Debug':
  for id in range(pygame.midi.get_count()):
    printDebug( "Id=%d Device=%s" % (id,pygame.midi.get_device_info(id)) )


quit