import requests
import json
import pprint
from dataClasses import *

#----------------------------------------------------------------

def getSongList():
  # pp = pprint.PrettyPrinter(indent=4)
  songList = {}
  response = requests.get('http://localhost:8081/all/song')
  data = response.json()
  for item in data:
    # pprint.pprint(item)
    song = Song(**item)
    songList[str(song.id)] = song   
  return songList
#----------------------------------------------------------------

def getCurrentGigId():
  gigId = -1
  response = requests.get('http://localhost:8081/currentgig')
  data = response.json()
  if len(data) > 0:
    gigId = data['id']
  return gigId
#----------------------------------------------------------------

def getGig(id):
  print('----------------------------------------------------')
  URL = "http://localhost:8081/gig/"+str(id)
  # PARAMS = {'id':id} 
  # response = requests.get(url = URL, params = PARAMS) 
  response = requests.get(url = URL) 
  # pprint.pprint(response)
  # print('----------------------------------------------------')
  data = response.json()
  if len(data) > 0:
    # pprint.pprint(data)
    gig = Gig(**data)
    return gig
#----------------------------------------------------------------

def getPresets():
  URL = 'http://localhost:8081/all/preset'
  response = requests.get(url = URL)
  data = response.json()
  # pprint.pprint(data)
  return data
#----------------------------------------------------------------

def getInstruments():
  URL = 'http://localhost:8081/all/instrument'
  response = requests.get(url = URL)
  data = response.json()
  # pprint.pprint(data)
  return data
#----------------------------------------------------------------

def getInstrumentBanks():
  URL = 'http://localhost:8081/all/instrumentbank'
  response = requests.get(url = URL)
  data = response.json()
  # pprint.pprint(data)
  return data