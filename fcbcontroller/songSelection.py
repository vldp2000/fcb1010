from time import sleep

import controllerSocket
import dataController
import dataHelper
import midiOutput

from config import (
    BIASFX_EFFECT_TARGETS,
    BIASFX_BOOST_TOGGLE_CC,
    BIASFX_DELAY_TOGGLE_CC,
    BIASFX_MOD_TOGGLE_CC,
    BIASFX_REVERB_TOGGLE_CC,
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
gCurrentBoostList = [0, 0, 0, 0]
gInitialisationComplete = False

midiOutput.setCurrentVolumeList(gCurrentVolumeList)

EFFECT_DELAY = "delay"
EFFECT_REVERB = "reverb"
EFFECT_MOD = "mod"
EFFECT_BOOST = "boost"


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

            if not samePC:
                sendPCMessage(channel, newPC)

            processProgramEffects(samePC, idx, channel, songPreset)
            processProgramBoost(samePC, idx, channel, songPreset)

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

    delayFlag = int(songPreset.get('delayflag', 0))
    if delayFlag != oldDelay:
        sendCCMessage(channel, BIASFX_DELAY_TOGGLE_CC, 127)

    reverbFlag = int(songPreset.get('reverbflag', 0))
    if reverbFlag != oldReverb:
        sendCCMessage(channel, BIASFX_REVERB_TOGGLE_CC, 127)

    modeFlag = int(songPreset.get('modeflag', 0))
    if modeFlag != oldMod:
        sendCCMessage(channel, BIASFX_MOD_TOGGLE_CC, 127)

    if idx == 0:
        _debug(
            f">>>  idx = {idx},  samepc = {samePCFlag}, delay {oldDelay} >> {delayFlag} , reverb {oldReverb} >> {reverbFlag} ,  mod {oldMod} >> {modeFlag} ,  channel = {channel}")

    gCurrentDelayList[idx] = delayFlag
    gCurrentReverbList[idx] = reverbFlag
    gCurrentModList[idx] = modeFlag
    updateEffectDisplayStatus()


def processProgramBoost(samePCFlag, idx, channel, songPreset):
    if not _isBiasFXEffectTarget(channel, idx):
        return

    oldBoost = int(gCurrentBoostList[idx]) if samePCFlag else 0
    boostFlag = int(songPreset.get('boostflag', 0))
    if boostFlag != oldBoost:
        sendCCMessage(channel, BIASFX_BOOST_TOGGLE_CC, 127)

    gCurrentBoostList[idx] = boostFlag
    updateEffectDisplayStatus()


def toggleLiveDelayEffect():
    toggleLiveEffect(EFFECT_DELAY)


def toggleLiveReverbEffect():
    toggleLiveEffect(EFFECT_REVERB)


def toggleLiveModEffect():
    toggleLiveEffect(EFFECT_MOD)


def toggleLiveBoostEffect():
    toggleLiveEffect(EFFECT_BOOST)


def toggleLiveEffect(effectName):
    effectList, effectCC = getEffectStateAndCC(effectName)
    _masterChannel, masterIdx = BIASFX_EFFECT_TARGETS[0]
    targetState = 0 if int(effectList[masterIdx]) > 0 else 1

    for channel, idx in BIASFX_EFFECT_TARGETS:
        if int(effectList[idx]) != targetState:
            sendCCMessage(channel, effectCC, 127)
            effectList[idx] = targetState

    updateEffectDisplayStatus()
    if gDisplayData:
        gDisplayData.drawScreen()


def getEffectStateAndCC(effectName):
    if effectName == EFFECT_DELAY:
        return gCurrentDelayList, BIASFX_DELAY_TOGGLE_CC
    if effectName == EFFECT_REVERB:
        return gCurrentReverbList, BIASFX_REVERB_TOGGLE_CC
    if effectName == EFFECT_MOD:
        return gCurrentModList, BIASFX_MOD_TOGGLE_CC
    if effectName == EFFECT_BOOST:
        return gCurrentBoostList, BIASFX_BOOST_TOGGLE_CC
    raise ValueError(f"Unknown live effect {effectName}")


def updateEffectDisplayStatus():
    if not gDisplayData or not hasattr(gDisplayData, "setEffectStatus"):
        return

    _masterChannel, masterIdx = BIASFX_EFFECT_TARGETS[0]
    delayStatus = int(gCurrentDelayList[masterIdx] > 0)
    reverbStatus = int(gCurrentReverbList[masterIdx] > 0)
    modStatus = int(gCurrentModList[masterIdx] > 0)
    boostStatus = int(gCurrentBoostList[masterIdx] > 0)
    gDisplayData.setEffectStatus(delayStatus, reverbStatus, modStatus, boostStatus)


def _isBiasFXEffectTarget(channel, idx):
    return (channel, idx) in BIASFX_EFFECT_TARGETS


def _resetSystemCommandCounter():
    if gResetSystemCommandCounter:
        gResetSystemCommandCounter()


def _debug(message):
    if gPrintDebug:
        gPrintDebug(message)
