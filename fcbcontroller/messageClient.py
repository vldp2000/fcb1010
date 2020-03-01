import socketio
from config import *
from dataClasses import *
# import pprint 

class MessageClient(object):
  sio = socketio.Client()

  # def __init__(self:
    # self.sio = sio
  # sio.None

  @sio.on('connect', on_connect)
  def on_connect(self):
    print("connected.")

  @sio.on('songMessage', on_songMessage)
  def on_songMessage(self, *args):
    print('on_aaa_response', args)

  # @sio.event
  # def connect_error():
  #     print("The connection failed!")

  # @sio.event
  # def disconnect():
  #     print("I'm disconnected!")

  # @sio.on(VIEW_PROGRAM_MESSAGE)
  # def on_message(data):
  #   print('I received a VIEW_PROGRAM_MESSAGE message!',data)

  # @sio.on(VIEW_SONG_MESSAGE)
  # def on_message(data):
  #   print('I received a VIEW_SONG_MESSAGE message!',data)

  def initMessenger(self):
    # sio.= socketio.Client()
    self.sio.connect(MESSAGE_URL)
    # print('---------------socket--------------------')
    # pprint.pprint(sio.

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
    sio = socketio.AsyncClient()
    await sio.connect(MESSAGE_URL)

  async def asyncSendProgramNotificationMessage(id):
    sio.emit(PROGRAM_MESSAGE, str(id))

  async def asyncSendSongNotificationMessage(id):
    await sio.emit(SONG_MESSAGE, str(id))

  async def asyncSendSyncNotificationMessage(songId, programId):
    syncmessage = {}
    syncmessage.songId = songId
    syncmessage.programId = programId
    jsonStr = json.dumps(syncmessage,
      indent=4, sort_keys=True, cls=CustomEncoder,
      separators=(',', ': '), ensure_ascii=False
    )
    await sio.emit(SYNC_MESSAGE, jsonStr)
