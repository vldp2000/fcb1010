from time import sleep

import controllerSocket
import dataController
import dataHelper
import midiOutput

from config import (
    DELAY_EFFECT_OFF_CC,
    MOD_EFFECT_OFF_CC,
    REVERB_EFFECT_OFF_CC,
    VOLUME_CC,
)
from midiOutput import scheduleVolumeReassert, sendCCMessage, sendPCMessage


gDisplayData = None
gPrintDebug = None
gResetSystemCommandCounter = None

gSelectedGigId = -1
gGig = {}
gCurrentSong = {}

gInstrumentChannelDict = {}
gPresetDict = {}
gInstrumentBankDict = {}

gCurrentSongIdx = -1
gCurrentSongId = -1
gCurrentProgramIdx = -1

gCurrentPCList = [0, 0, 0, 0]
gCurrentVolumeList = [0, 0, 0, 0]
gCurrentDelayList = [0, 0, 0, 0]
gCurrentReverbList = [0, 0, 0, 0]
gCurrentModList = [0, 0, 0, 0]
gInitialisationComplete = False

midiOutput.setCurrentVolumeList(gCurrentVolumeList)


def init(displayData, printDebug, resetSystemCommandCounter):
    global gDisplayData
    global gPrintDebug
    global gResetSystemCommandCounter

    gDisplayData = displayData
    gPrintDebug = printDebug
    gResetSystemCommandCounter = resetSystemCommandCounter


def loadAllData():
    global gSelectedGigId
    global gGig
    global gCurrentSong
    global gInstrumentChannelDict
    global gInstrumentBankDict
    global gPresetDict
    global gInitialisationComplete

    _debug(' << Load All Data >>')
    if gGig:
        gGig.clear()
    if gCurrentSong:
        gCurrentSong.clear()
    if gInstrumentChannelDict:
        gInstrumentChannelDict.clear()
    if gInstrumentBankDict:
        gInstrumentBankDict.clear()
    if gPresetDict:
        gPresetDict.clear()

    _debug(' << All objects and collections are cleared>>')

    try:
        gGig = dataHelper.loadScheduledGig()

        if gGig:
            gSelectedGigId = gGig["id"]
            gDisplayData.drawMessage("Gig loaded", gGig["name"])
        else:
            gDisplayData.drawError("Gig not found")
            _debug("Gig not found")
        sleep(1)

        gInstrumentChannelDict = dataHelper.initInstruments()
        if not gInstrumentChannelDict:
            gDisplayData.drawError("Instruments not found")
            sleep(1)

        gPresetDict = dataHelper.initPresets()
        if not gInstrumentChannelDict:
            gDisplayData.drawError("Presets not found")
            sleep(1)

        gInstrumentBankDict = dataHelper.initInstrumentBanks()
        if not gInstrumentChannelDict:
            gDisplayData.drawError("Banks not found")
            sleep(1)

        gDisplayData.setDataAPIStatus(255)
        gInitialisationComplete = True

    except:
        gDisplayData.setDataAPIStatus(0)
        gDisplayData.drawScreen()
        _debug('<< Exception. loadAllData >>')
        gInitialisationComplete = False


def selectFirstSong():
    global gCurrentSongIdx
    global gCurrentSongId
    global gCurrentProgramIdx

    if gGig and gGig["shortSongList"]:
        gCurrentSongIdx = -1
        gCurrentSongId = -1
        selectNextSong(1)
        gCurrentProgramIdx = 0


def selectNextSong(step):
    global gCurrentSongIdx

    _resetSystemCommandCounter()
    if step > 0:
        if (gCurrentSongIdx + step < len(gGig["shortSongList"])):
            gCurrentSongIdx = gCurrentSongIdx + step
        else:
            gCurrentSongIdx = 0
    else:
        if gCurrentSongIdx + step > -1:
            gCurrentSongIdx = gCurrentSongIdx + step
        else:
            gCurrentSongIdx = len(gGig["shortSongList"]) - 1

    controllerSocket.sendGigNotificationMessage(gSelectedGigId)
    id = gGig["shortSongList"][gCurrentSongIdx]["id"]

    setCurrentSong(id)
    controllerSocket.sendSongNotificationMessage(id)


def setCurrentSong(id):
    global gCurrentSong
    global gCurrentSongId

    try:
        if gCurrentSong:
            gCurrentSong.clear()
            gCurrentSong = None

        gCurrentSong = dataController.readSongFromJson(id)

        if gCurrentSong:
            gCurrentSongId = gCurrentSong["id"]
            name = gCurrentSong["name"]
            _debug(f"Selected song = {name}")
            gDisplayData.setSongName(f"{gCurrentSongIdx}.{name}")
            setSongProgram(0)
        else:
            _debug("Song corrupted")
            gDisplayData.drawError("Song corrupted")

    except:
        _debug("Song not found")
        gDisplayData.drawError("Song not found")


def setSongProgram(idx):
    global gCurrentProgramIdx

    _resetSystemCommandCounter()
    gCurrentProgramIdx = idx

    program = gCurrentSong["programList"][idx]

    if program:
        _debug(f"Selected program. idx={idx}")
        i = 0
        for songPreset in program['presetList']:
            setPreset(program, songPreset, i)
            i = i + 1

        controllerSocket.sendProgramNotificationMessage(idx)

    else:
        _debug(f"Program {idx} not found")
        gDisplayData.drawError(f"Program {idx} not found")


def setPreset(program, songPreset, idx):
    id = songPreset['refpreset']
    preset = gPresetDict[str(id)]
    _debug(f"Preset Selected  id={id} name ={preset['name']}")

    if preset:
        channel = int(gInstrumentChannelDict[str(songPreset['refinstrument'])])
        newPC = int(preset['midipc'])

        newVolume = 0
        if newPC == 0:
            sendCCMessage(channel, VOLUME_CC, newVolume)
            sendPCMessage(channel, newPC)
            sendCCMessage(channel, VOLUME_CC, newVolume)
        else:
            newVolume = songPreset['volume']
            _debug(f"Preset Volume {newVolume}")

            if newVolume > 127:
                newVolume = 127
            if newVolume < 0:
                newVolume = 0

            oldPC = gCurrentPCList[idx]
            samePC = newPC == oldPC

            sendCCMessage(channel, VOLUME_CC, 0)
            sendPCMessage(channel, newPC)

            # Reserved for future app-specific preset/effect mapping.
            # processProgramEffects(samePC, idx, channel, songPreset)

            sendCCMessage(channel, VOLUME_CC, newVolume)

            if preset['refinstrument'] == 1:
                gDisplayData.setProgramName(
                    f"{program['name']}.{preset['name']}")

            gCurrentPCList[idx] = newPC
            gCurrentVolumeList[idx] = newVolume
            gDisplayData.drawScreen()

        scheduleVolumeReassert(channel, newVolume)

    else:
        _debug(f"Preset {id} not found")
        gDisplayData.drawError(f"Preset {id} not found")
        sleep(0.2)


def processProgramEffects(samePCFlag, idx, channel, songPreset):
    oldDelay = 0
    oldReverb = 0
    oldMod = 0

    if samePCFlag:
        oldDelay = int(gCurrentDelayList[idx])
        oldReverb = int(gCurrentReverbList[idx])
        oldMod = int(gCurrentModList[idx])

    delayFlag = int(songPreset['delayflag'])
    if delayFlag != oldDelay:
        sendCCMessage(channel, DELAY_EFFECT_OFF_CC, 127)

    reverbFlag = int(songPreset['reverbflag'])
    if reverbFlag != oldReverb:
        sendCCMessage(channel, REVERB_EFFECT_OFF_CC, 127)

    modeFlag = int(songPreset['modeflag'])
    if modeFlag != oldMod:
        sendCCMessage(channel, MOD_EFFECT_OFF_CC, 127)

    if idx == 0:
        _debug(
            f">>>  idx = {idx},  samepc = {samePCFlag}, delay {oldDelay} >> {delayFlag} , reverb {oldReverb} >> {reverbFlag} ,  mod {oldMod} >> {modeFlag} ,  channel = {channel}")

    gCurrentDelayList[idx] = delayFlag
    gCurrentReverbList[idx] = reverbFlag
    gCurrentModList[idx] = modeFlag


def _resetSystemCommandCounter():
    if gResetSystemCommandCounter:
        gResetSystemCommandCounter()


def _debug(message):
    if gPrintDebug:
        gPrintDebug(message)
