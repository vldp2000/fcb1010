import socketio
from config import *
from dataClasses import *
# import pprint 

class MessageClient(object):
  sio: None

  def on_connect(self):
    print("connected.")

  sio.on('songMessage', on_songMessage)
  def on_songMessage(*args):
    print('on_aaa_response', args)


  # @self.sio.event
  # def connect_error():
  #     print("The connection failed!")

  # @self.sio.event
  # def disconnect():
  #     print("I'm disconnected!")

  # @self.sio.on(VIEW_PROGRAM_MESSAGE)
  # def on_message(data):
  #   print('I received a VIEW_PROGRAM_MESSAGE message!',data)

  # @self.sio.on(VIEW_SONG_MESSAGE)
  # def on_message(data):
  #   print('I received a VIEW_SONG_MESSAGE message!',data)

  def initMessenger(self):
    self.sio = socketio.Client()
    self.sio.connect(MESSAGE_URL)
    # print('---------------socket--------------------')
    # pprint.pprint(self.sio)

  def sendProgramNotificationMessage(self,id):
    self.sio.emit(PROGRAM_MESSAGE, str(id))
    # print(PROGRAM_MESSAGE + "=" + str(id))

  def sendSongNotificationMessage(self,id):
    self.sio.emit(SONG_MESSAGE, str(id))
    # print(SONG_MESSAGE + "=" + str(id))

  def sendSyncNotificationMessage(self,songId, programId):
    syncmessage = {}
    syncmessage.songId = songId
    syncmessage.programId = programId

    jsonStr = json.dumps(syncmessage,
      indent=4, sort_keys=True, cls=CustomEncoder,
      separators=(',', ': '), ensure_ascii=False
    )
    self.sio.emit(SYNC_MESSAGE, jsonStr)
    # print(SYNC_MESSAGE + "=" +  jsonStr)

  # ---------ASYNC-------------
  async def asyncInitMessenger():
    self.sio = socketio.AsyncClient()
    await self.sio.connect(MESSAGE_URL)

  async def asyncSendProgramNotificationMessage(id):
    self.sio.emit(PROGRAM_MESSAGE, str(id))

  async def asyncSendSongNotificationMessage(id):
    await self.sio.emit(SONG_MESSAGE, str(id))

  async def asyncSendSyncNotificationMessage(songId, programId):
    syncmessage = {}
    syncmessage.songId = songId
    syncmessage.programId = programId
    jsonStr = json.dumps(syncmessage,
      indent=4, sort_keys=True, cls=CustomEncoder,
      separators=(',', ': '), ensure_ascii=False
    )
    await self.sio.emit(SYNC_MESSAGE, jsonStr)
