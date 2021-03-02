import requests
import json

import pprint

from dataClasses import *
from config import *

#----------------------------------------------------------------

def getSongList():
  # pp = pprint.PrettyPrinter(indent=4)
  songList = {}
  response = requests.get(API_URL +  '/all/song')
  data = response.json()
  for item in data:
    # pprint.pprint(item)
    song = Song(**item)
    songList[str(song.id)] = song   
  return songList
#----------------------------------------------------------------

def getScheduledGigId():
  gigId = -1
  response = requests.get(API_URL + '/currentgig')
  pprint.pprint(response)
  data = response.json()
  pprint.pprint(data)
  if len(data) > 0:
    gigId = data['id']
    pprint.pprint(gigId)
  return gigId
#----------------------------------------------------------------

def getGig(id):
  # print('----------------------------------------------------')
  URL = API_URL + "/gig/"+str(id)
  pprint.pprint(URL)
  # PARAMS = {'id':id} 
  # response = requests.get(url = URL, params = PARAMS) 
  response = requests.get(url = URL) 
  pprint.pprint(response)
  print('----------------------------------------------------')
  data = response.json()
  pprint.pprint(data)
  print('----------------------------------------------------')
  if len(data) > 0:
    gig = Gig(data)
    pprint.pprint(gig.__dict__)
    print('----------------------------------------------------')
    return gig
#----------------------------------------------------------------

def getPresets():
  URL = API_URL + '/all/preset'
  response = requests.get(url = URL)
  data = response.json()
  # pprint.pprint(data)
  return data
#----------------------------------------------------------------

def getInstruments():
  URL = API_URL + '/all/instrument'
  response = requests.get(url = URL)
  data = response.json()
  # pprint.pprint(data)
  return data
#----------------------------------------------------------------

def getInstrumentBanks():
  URL = API_URL + '/all/instrumentbank'
  response = requests.get(url = URL)
  data = response.json()
  # pprint.pprint(data)
  return data

#----------------------------------------------------------------

def getSong(id):
  response = requests.get(API_URL +  '/song/' + str(id))
  data = response.json()
  #for key, value in data.items():
  #  print (key, value)
  #pprint.pprint(data)
  return data
