import socketio
from config import *
from dataClasses import *
import pprint 

class MessageClient(object):
  socketIOClinet: None

  # def __init__(self):
  #   self.socketIOClinet: None

  def initMessenger(self):
    self.socketIOClinet = socketio.Client()
    self.socketIOClinet.connect(MESSAGE_URL)
    print('---------------socket--------------------')
    pprint.pprint(self.socketIOClinet)

  def sendProgramNotificationMessage(self,id):
    self.socketIOClinet.emit(PROGRAM_MESSAGE, str(id))
    print(PROGRAM_MESSAGE + "=" + str(id))

  def sendSongNotificationMessage(self,id):
    self.socketIOClinet.emit(SONG_MESSAGE, str(id))
    print(SONG_MESSAGE + "=" + str(id))

  def sendSyncNotificationMessage(self,songId, programId):
    syncmessage = {}
    syncmessage.songId = songId
    syncmessage.programId = programId

    jsonStr = json.dumps(syncmessage,
      indent=4, sort_keys=True, cls=CustomEncoder,
      separators=(',', ': '), ensure_ascii=False
    )
    self.socketIOClinet.emit(SYNC_MESSAGE, jsonStr)
    print(SYNC_MESSAGE + "=" +  jsonStr)

  # ---------ASYNC-------------
  async def asyncInitMessenger():
    self.socketIOClinet = socketio.AsyncClient()
    await self.socketIOClinet.connect(MESSAGE_URL)

  async def asyncSendProgramNotificationMessage(id):
    self.socketIOClinet.emit(PROGRAM_MESSAGE, str(id))

  async def asyncSendSongNotificationMessage(id):
    await self.socketIOClinet.emit(SONG_MESSAGE, str(id))

  async def asyncSendSyncNotificationMessage(songId, programId):
    syncmessage = {}
    syncmessage.songId = songId
    syncmessage.programId = programId
    jsonStr = json.dumps(syncmessage,
      indent=4, sort_keys=True, cls=CustomEncoder,
      separators=(',', ': '), ensure_ascii=False
    )
    await self.socketIOClinet.emit(SYNC_MESSAGE, jsonStr)