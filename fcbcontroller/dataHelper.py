import json
import struct
import subprocess
from array import *

# import pprint
import dataController
from dataClasses import *


#----------------------------------------------------------------
#----------------------------------------------------------------
#####
def initPresets():
  iList = dataController.getPresets()
  iDict = {}
  for item in iList:
    iDict[str(item['id'])] = item['midipc']
  # pprint.pprint(iDict)
  return iDict      
#----------------------------------------------------------------
#####
def initInstruments():
  iList = dataController.getInstruments()
  iDict = {}
  for item in iList:
    iDict[str(item['id'])] = item['midichannel']
  # pprint.pprint(iDict)
  return iDict
#----------------------------------------------------------------
#####
def initInstrumentBanks():
  iList = dataController.getInstrumentBanks()
  iDict = {}
  for item in iList:
    iDict[str(item['id'])] = item['number']
  # pprint.pprint(iDict)
  return iDict
#----------------------------------------------------------------
#####
def initGigSongs(items, allSongs):  
  ## Init Gig Songs
  gigSongList = []

  for item in items:
    id = item['id']
    song = allSongs[str(id)]
    song.sequencenumber = item['sequencenumber']
    gigSongList.append(song)
  # print( len(gSongList))
  return gigSongList


#----------------------------------------------------------------
#####
def initAllSongs(songDict):
  songList = []
  for item in songDict:
    songList.append(songDict[item])
  print( len(songList))  
  return songList

#----------------------------------------------------------------
#####
def loadCurrentGig():
  global gGig
  id = dataController.getCurrentGigId()
  print('Current id = ',id)

  gig = dataController.getGig(id)
  # pprint.pprint(gig)
  return gig

#----------------------------------------------------------------
#####
def loadSongs():
  songs = dataController.getSongList()
  return songs