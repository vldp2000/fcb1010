import json
import struct
import subprocess
from array import *

# import pprint
import dataController
from dataClasses import *


#----------------------------------------------------------------
def initPresets():
  iList = dataController.getPresets()
  iDict = {}
  for item in iList:
    iDict[str(item['id'])] = item
    #iDict[str(item['id'])] = item['midipc']
  # pprint.pprint(iDict)
  return iDict      
#----------------------------------------------------------------
def initInstruments():
  iList = dataController.getInstruments()
  iDict = {}
  for item in iList:
    iDict[str(item['id'])] = item['midichannel']
  # pprint.pprint(iDict)
  return iDict
#----------------------------------------------------------------
def initInstrumentBanks():
  iList = dataController.getInstrumentBanks()
  iDict = {}
  for item in iList:
    iDict[str(item['id'])] = item['number']
  # pprint.pprint(iDict)
  return iDict
#----------------------------------------------------------------
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
def initAllSongs(songDict):
  songList = []
  for item in songDict:
    songList.append(songDict[item])
  print( len(songList))  
  return songList

#----------------------------------------------------------------
def reloadSong(allSongs, id):
  song = allSongs[str(id)]
  data = dataController.getSong(id)
  for i in range(4):
    #print ('-----------------------')
    #print (data['programList'][i])

    program = song.programList[i]
    programNew = data['programList'][i]
    for x in range(4):
      program['presetList'][x]['volume'] = programNew['presetList'][x]['volume']
      program['presetList'][x]['delayflag'] = programNew['presetList'][x]['delayflag']
      program['presetList'][x]['modeflag'] = programNew['presetList'][x]['modeflag']
      program['presetList'][x]['muteflag'] = programNew['presetList'][x]['muteflag']
      program['presetList'][x]['pan'] = programNew['presetList'][x]['pan']
      program['presetList'][x]['refinstrumentbank'] = programNew['presetList'][x]['refinstrumentbank']
      program['presetList'][x]['refpreset'] = programNew['presetList'][x]['refpreset']
      program['presetList'][x]['refsongprogram'] = programNew['presetList'][x]['refsongprogram']
      program['presetList'][x]['reverbflag'] = programNew['presetList'][x]['reverbflag']
      program['presetList'][x]['reverbvalue'] = programNew['presetList'][x]['reverbvalue']
      print(program['presetList'][x]['id'])
      print(programNew['presetList'][x]['id'])

#----------------------------------------------------------------
def loadScheduledGig():
  global gGig
  id = dataController.getScheduledGigId()
  print('Current id = ',id)

  gig = dataController.getGig(id)
  # pprint.pprint(gig)
  return gig

#----------------------------------------------------------------
def loadSongs():
  songs = dataController.getSongList()
  return songs

#----------------------------------------------------------------
def findIndexById(list, id):
  try:
    idx = [x.id for x in list].index(id)
  except ValueError:
    idx = -1
  print(idx)
  return idx

def unicodetoASCII(textValue):
  result = (textValue.
    replace('\\xe2\\x80\\x99', "'").
      replace('\\xc3\\xa9', 'e').
      replace('\\xe2\\x80\\x90', '-').
      replace('\\xe2\\x80\\x91', '-').
      replace('\\xe2\\x80\\x92', '-').
      replace('\\xe2\\x80\\x93', '-').
      replace('\\xe2\\x80\\x94', '-').
      replace('\\xe2\\x80\\x94', '-').
      replace('\\xe2\\x80\\x98', "'").
      replace('\\xe2\\x80\\x9b', "'").
      replace('\\xe2\\x80\\x9c', '"').
      replace('\\xe2\\x80\\x9c', '"').
      replace('\\xe2\\x80\\x9d', '"').
      replace('\\xe2\\x80\\x9e', '"').
      replace('\\xe2\\x80\\x9f', '"').
      replace('\\xe2\\x80\\xa6', '...').#
      replace('\\xe2\\x80\\xb2', "'").
      replace('\\xe2\\x80\\xb3', "'").
      replace('\\xe2\\x80\\xb4', "'").
      replace('\\xe2\\x80\\xb5', "'").
      replace('\\xe2\\x80\\xb6', "'").
      replace('\\xe2\\x80\\xb7', "'").
      replace('\\xe2\\x81\\xba', "+").
      replace('\\xe2\\x81\\xbb', "-").
      replace('\\xe2\\x81\\xbc', "=").
      replace('\\xe2\\x81\\xbd', "(").
      replace('\\xe2\\x81\\xbe', ")")
    )
  return result