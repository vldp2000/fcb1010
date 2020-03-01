import socketio
from config import *
from dataClasses import *
# import pprint 

class MessageClient(object):
  socketIOClient: None

  @socketIOClient.on(VIEW_PROGRAM_MESSAGE)
  def on_message(data):
    print('I received a VIEW_PROGRAM_MESSAGE message!',data)

  @socketIOClient.on(VIEW_SONG_MESSAGE)
  def on_message(data):
    print('I received a VIEW_SONG_MESSAGE message!',data)

  def initMessenger(self):
    self.socketIOClient = socketio.Client()
    self.socketIOClient.connect(MESSAGE_URL)
    # print('---------------socket--------------------')
    # pprint.pprint(self.socketIOClient)

  def sendProgramNotificationMessage(self,id):
    self.socketIOClient.emit(PROGRAM_MESSAGE, str(id))
    # print(PROGRAM_MESSAGE + "=" + str(id))

  def sendSongNotificationMessage(self,id):
    self.socketIOClient.emit(SONG_MESSAGE, str(id))
    # print(SONG_MESSAGE + "=" + str(id))

  def sendSyncNotificationMessage(self,songId, programId):
    syncmessage = {}
    syncmessage.songId = songId
    syncmessage.programId = programId

    jsonStr = json.dumps(syncmessage,
      indent=4, sort_keys=True, cls=CustomEncoder,
      separators=(',', ': '), ensure_ascii=False
    )
    self.socketIOClient.emit(SYNC_MESSAGE, jsonStr)
    # print(SYNC_MESSAGE + "=" +  jsonStr)

  # ---------ASYNC-------------
  async def asyncInitMessenger():
    self.socketIOClient = socketio.AsyncClient()
    await self.socketIOClient.connect(MESSAGE_URL)

  async def asyncSendProgramNotificationMessage(id):
    self.socketIOClient.emit(PROGRAM_MESSAGE, str(id))

  async def asyncSendSongNotificationMessage(id):
    await self.socketIOClient.emit(SONG_MESSAGE, str(id))

  async def asyncSendSyncNotificationMessage(songId, programId):
    syncmessage = {}
    syncmessage.songId = songId
    syncmessage.programId = programId
    jsonStr = json.dumps(syncmessage,
      indent=4, sort_keys=True, cls=CustomEncoder,
      separators=(',', ': '), ensure_ascii=False
    )
    await self.socketIOClient.emit(SYNC_MESSAGE, jsonStr)
