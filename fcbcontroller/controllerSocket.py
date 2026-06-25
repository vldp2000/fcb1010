import json

import socketio

from config import (
    GIG_MESSAGE,
    MESSAGE_URL,
    PRESETVOLUME_MESSAGE,
    PROGRAM_MESSAGE,
    SONG_MESSAGE,
    SYNC_MESSAGE,
    VIEW_EDIT_MODE_MESSAGE,
    VIEW_PROGRAM_MESSAGE,
    VIEW_SONG_MESSAGE,
)
from dataClasses import CustomEncoder


sio = socketio.Client()
gDisplayData = None
gPrintDebug = None
gSetCurrentSong = None
gSetSongProgram = None
gSetControllerMode = None


def init(displayData, printDebug, setCurrentSong, setSongProgram, setControllerMode):
    global gDisplayData
    global gPrintDebug
    global gSetCurrentSong
    global gSetSongProgram
    global gSetControllerMode

    gDisplayData = displayData
    gPrintDebug = printDebug
    gSetCurrentSong = setCurrentSong
    gSetSongProgram = setSongProgram
    gSetControllerMode = setControllerMode


def connectToMessageServer():
    sio.connect(MESSAGE_URL)


@sio.event
def connect():
    try:
        _debug('SOCKET connection established')
        gDisplayData.setMessageAPIStatus(255)
    except:
        _debug('SOCKET connection can not be established')
        gDisplayData.setMessageAPIStatus(0)
        gDisplayData.drawScreen()


@sio.event
def message(data):
    _debug(f"Message received with  {data}")


@sio.event
def disconnect():
    _debug('disconnected from SOCKET server')
    gDisplayData.setMessageAPIStatus(0)
    gDisplayData.drawScreen()


@sio.on(VIEW_SONG_MESSAGE)
def processSongMessage(id):
    _debug(f"{VIEW_SONG_MESSAGE} ID:  {id}")
    gSetCurrentSong(id)


@sio.on(VIEW_PROGRAM_MESSAGE)
def processProgramMessage(idx):
    _debug(f"{VIEW_PROGRAM_MESSAGE} IDX: {idx}")
    gSetSongProgram(idx)


@sio.on(VIEW_EDIT_MODE_MESSAGE)
def processControllerModeMessage(payload):
    _debug(f"->->  Received message {VIEW_EDIT_MODE_MESSAGE} = {payload}")
    gSetControllerMode(payload)


def sendProgramNotificationMessage(idx):
    sio.emit(PROGRAM_MESSAGE, str(idx))


def sendSongNotificationMessage(id):
    sio.emit(SONG_MESSAGE, str(id))


def sendGigNotificationMessage(id):
    sio.emit(GIG_MESSAGE, str(id))


def sendSyncNotificationMessage(bankId, songId, programIdx):
    syncmessage = {
        'songId': songId,
        'programIdx': programIdx,
        'bankId': bankId,
    }

    jsonStr = json.dumps(
        syncmessage,
        indent=4,
        sort_keys=True,
        cls=CustomEncoder,
        separators=(',', ': '),
        ensure_ascii=False,
    )
    sio.emit(SYNC_MESSAGE, jsonStr)


def sendPresetVolume(value):
    sio.emit(PRESETVOLUME_MESSAGE, str(value))
    _debug(f"Send message  {PRESETVOLUME_MESSAGE} {value}")


def _debug(message):
    if gPrintDebug:
        gPrintDebug(message)
