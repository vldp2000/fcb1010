import requests
import json
import pprint
from dataClasses import *

#----------------------------------------------------------------

def getSongList():
  # pp = pprint.PrettyPrinter(indent=4)
  songList = {}
  response = requests.get('http://localhost:8081/songs')
  data = response.json()
  for item in data:
    song = Song(**item)
    songList[str(song.id)] = song 
  # pprint.pprint(songList)  
  return songList

def getCurrentGig():
  gigId = -1
  response = requests.get('http://localhost:8081/currentgig')
  data = response.json()
  if len(data) > 0:
    gigId = data[0]['id']
  return gigId

def getGigSongs(id):
  URL = "http://localhost:8081/gigsongs"
  PARAMS = {'id':id} 
  response = requests.get(url = URL, params = PARAMS) 
  data = response.json()
  # if len(data) > 0:
  # pprint.pprint(data)
  return data

def getSongItems(id):
  URL = "http://localhost:8081/songitems/"+str(id)
  response = requests.get(url = URL)
  data = response.json()
  return data

def allPresets():
  URL = 'http://localhost:8081/songprogrampreset'
  response = requests.get(url = URL)
  data = response.json()
  # pprint.pprint(data)
  return data
