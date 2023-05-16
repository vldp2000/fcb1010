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
def getSong(id):
  song = dataController.getSong(id)
  return song
  #for i in range(4):
    #print ('-----------------------')
    #print (data['programList'][i])
#----------------------------------------------------------------
def loadScheduledGig():
  #global gGig
  id = dataController.getScheduledGigId()
  print('Current Gig id = ',id)
  gig = dataController.getGig(id)
  print(gig)
  return gig

#----------------------------------------------------------------
def findIndexById(list, id):
  try:
    idx = [x.id for x in list].index(id)
  except ValueError:
    idx = -1
  #print(idx)
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