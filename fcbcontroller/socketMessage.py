import socket
import socketio
from tools import *
from config import *
import displayData

sio = socketio.Client()
#---SOCKET--CLIENT-------------
@sio.event
def connect():
  global displayData
  try:
    printDebug('SOCKET connection established')
    displayData.setMessageAPIStatus(255)
    #displayData.drawScreen()
  except:
    printDebug('SOCKET connection can not be established')
    displayData.setMessageAPIStatus(0)
    displayData.drawScreen() 

#==
@sio.event
def message(data):
  printDebug(f"Message received with  {data}")

#== 
@sio.event
def disconnect():
  printDebug('disconnected from SOCKET server')
  displayData.setMessageAPIStatus(0)
  displayData.drawScreen() 

#==
@sio.on('VIEW_SONG_MESSAGE')
def processSongMessage(id):
  global gSongDict
  printDebug(f"VIEW_SONG_MESSAGE ID:  {id}")
  setCurrentSong(id)

#==
@sio.on('VIEW_PROGRAM_MESSAGE')
def processProgramMessage(idx):
  printDebug(f"VIEW_PROGRAM_MESSAGE IDX: {idx}")
  setSongProgram(idx)

#==

@sio.on('VIEW_EDIT_MODE_MESSAGE')
def processControllerModeMessage(payload):
  global gMode
  global gConfigChannel
  printDebug(f"->->  Received message VIEW_EDIT_MODE_MESSAGE = {payload}")
  if str(payload) == '0':
    gMode = 'Live'
    displayData.drawScreen()
  else:
    gMode = 'Config'
    displayData.drawMessage("Mode","Config")

  gConfigChannel = int(payload)

  printDebug(f"->->  Mode =>{gMode}  Channel={gConfigChannel}")
  
#==
def sendProgramNotificationMessage(idx):
  sio.emit(PROGRAM_MESSAGE, str(idx))
  #printDebug(f"{PROGRAM_MESSAGE} >> {str(idx)}")

#==
def sendSongNotificationMessage(id):
  sio.emit(SONG_MESSAGE, str(id))
  #printDebug(f'{SONG_MESSAGE}  >> { str(id)}')

#==
def sendGigNotificationMessage(id):
  sio.emit(GIG_MESSAGE, str(id))
  #printDebug(f'{GIG_MESSAGE}  >> {str(id)}')

#==
def sendSyncNotificationMessage(bankId, songId, programIdx):
  global gSystemCommandCounter
  gSystemCommandCounter = 0

  syncmessage = {}
  syncmessage['songId'] = songId
  syncmessage['programIdx'] = programIdx
  syncmessage['bankId'] = bankId

  jsonStr = json.dumps(syncmessage,
    indent=4, sort_keys=True, cls=CustomEncoder,
    separators=(',', ': '), ensure_ascii=False
  )
  sio.emit(SYNC_MESSAGE, jsonStr)
  # print(SYNC_MESSAGE + "=" +  jsonStr)
#----------------------------------------------------------------
def sendPresetVolume(value):
  sio.emit(PRESETVOLUME_MESSAGE, str(value))
  printDebug(f"Send message  PRESETVOLUME_MESSAGE {value}")

#----------------------------------------------------------------
def clearScreenDebug():
  global gDebugFlag
  global gDebugMessageCounter
  if gDebugFlag == 'Debug':
    print("\n" * 2)
    print(f'               >> ----- {gDebugMessageCounter} -------<<' )
    gDebugMessageCounter = gDebugMessageCounter + 1

