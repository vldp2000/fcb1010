from time import monotonic, sleep

from config import (
    MIDI_CC_DELAY,
    MIDI_EXPRESSION_CC_DELAY,
    MIDI_PC_DELAY,
    MIDI_PRESET_VOLUME_REASSERT_DELAY,
    MIDI_PRESET_VOLUME_REASSERT_ENABLED,
    VOLUME_CC,
)


gMidiOutput = None
gCurrentVolumeList = None
gPendingVolumeReassertDict = {}


def setMidiOutput(midiOutput):
    global gMidiOutput
    gMidiOutput = midiOutput


def setCurrentVolumeList(volumeList):
    global gCurrentVolumeList
    gCurrentVolumeList = volumeList


def sendCCMessage(channel, CC, value):
    gMidiOutput.write_short(0xb0 + int(channel) - 1, int(CC), int(value))
    sleep(MIDI_CC_DELAY)


def sendPCMessage(channel, PC):
    gMidiOutput.write_short(0xc0 + int(channel) - 1, int(PC))
    sleep(MIDI_PC_DELAY)


def sendGenericMidiCommand(msg0, msg1, msg2):
    gMidiOutput.write_short(0xb0 + int(msg0), msg1, msg2)


def muteChannel(channel, volume, step):
    if volume > 0:
        x = volume
        while x > 0:
            sendCCMessage(channel, VOLUME_CC, x)
            x = x - step
        sendCCMessage(channel, VOLUME_CC, 0)


def unmuteChannel(channel, volume, step):
    x = step
    while x < volume:
        sendCCMessage(channel, VOLUME_CC, x)
        x = x + step


def calibratePedalVolume(maxValue, value):
    result = int(127 / maxValue * value)
    if result < 6:
        result = 0
    if result > 127:
        result = 127
    return result


def scheduleVolumeReassert(channel, volume):
    if not MIDI_PRESET_VOLUME_REASSERT_ENABLED:
        return

    gPendingVolumeReassertDict[int(channel)] = {
        "volume": int(volume),
        "dueTime": monotonic() + MIDI_PRESET_VOLUME_REASSERT_DELAY,
    }


def cancelPendingVolumeReassert(channel):
    gPendingVolumeReassertDict.pop(int(channel), None)


def processPendingVolumeReasserts():
    now = monotonic()
    dueChannels = [
        channel
        for channel, pendingVolume in gPendingVolumeReassertDict.items()
        if pendingVolume["dueTime"] <= now
    ]

    for channel in dueChannels:
        pendingVolume = gPendingVolumeReassertDict.pop(channel, None)
        if pendingVolume:
            sendCCMessage(channel, VOLUME_CC, pendingVolume["volume"])


def sendPedalVolumeCC(channel, idx, volume):
    cancelPendingVolumeReassert(channel)
    maxVol = gCurrentVolumeList[idx]
    if volume <= maxVol:
        gMidiOutput.write_short(0xb0 + int(channel) - 1, VOLUME_CC, int(volume))
        sleep(MIDI_EXPRESSION_CC_DELAY)
