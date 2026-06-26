
# A MIDI channel voice message consists of a status Byte followed by one or two data Bytes. Click here for a list of
# currently assigned MIDI controller numbers.
#              Status Byte	Data Byte 1	Data Byte 2	Message	Legend 1000nnnn	0kkkkkkk 0vvvvvvv
# Note Off	n=channel* k=key # 0-127(60=middle C) v=velocity (0-127) 1001nnnn	0kkkkkkk 0vvvvvvv
# Note On	n=channel k=key # 0-127(60=middle C) v=velocity (0-127) 1010nnnn	0kkkkkkk	0ppppppp
# Poly Key Pressure	n=channel k=key # 0-127(60=middle C) p=pressure (0-127) 1011nnnn	0ccccccc	0vvvvvv
# Controller Change	n=channel c=controller v=controller value(0-127) 1100nnnn 0ppppp  [none]
# Program Change	n=channel p=preset number (0-127) 1101nnnn	0ppppppp	[none]
# Channel Pressure	n=channel p=pressure (0-127) 1110nnnn	0fffffff	0ccccccc
# Pitch Bend	n=channel c=coarse f=fine (c+f = 14-bit
# resolution) ----------------------------------------------------------------

# 176 -CC Channel 1  /*Ipad Sample Tank*/
# 177 -CC Channel 2  /*Macbook Alchemy*/
# 179 -CC Channel 4  /*Macbook BiasFX*/
# 181 -CC Channel 6  /*Ipad BiasFX*/
# 192 -PC on Channel 1
# 197 -PC on Channel 6
# -*- coding: utf-8 -*-

import pygame
import pygame.midi
import sys

import controllerSocket
import midiOutput
import myutils
import songSelection
import systemCommands

from time import sleep

from config import *
from midiOutput import (
    calibratePedalVolume,
    processPendingVolumeReasserts,
    sendCCMessage,
    sendPedalVolumeCC,
)

import displayData

#################################################################

# Global Var

gExitFlag = False


gDebugMessageCounter = 0
gMode = 'Live'
gConfigChannel = 0

gPedal1MaxVolume = 0
gPedal2MaxVolume = 0

# default value for second  volume pedal is 176 = 1st channel
# gPedal2_Channel = 176
# gChannel1 = 176
# gChannel2 = 177

gMidiOutput = None

def setControllerMode(payload):
    global gMode
    global gConfigChannel
    # Payload is 0 for Live mode, otherwise it is the selected app MIDI channel
    # used by Config mode while tuning preset volume from the expression pedals.
    if str(payload) == '0':
        gMode = 'Live'
        displayData.drawScreen()
    else:
        gMode = 'Config'
        displayData.drawMessage("Mode", "Config")

    gConfigChannel = int(payload)

    myutils.printDebug(f"->->  Mode =>{gMode}  Channel={gConfigChannel}")


# ----------------------------------------------------------------


def clearScreenDebug():
    global gDebugMessageCounter
    if myutils.getDebugFlag():
        print("\n" * 2)
        print(f'               >> ----- {gDebugMessageCounter} -------<<')
        gDebugMessageCounter = gDebugMessageCounter + 1


def getActionForReceivedMessage(midiMsg):
    global gMode
    global gConfigChannel
    global gReloadCounter
    global gSynthTest
    global gPianoTest

    # global gPedal1MaxVolume
    # global gPedal2MaxVolume
    # global gCurrentVolumeList

    msg = midiMsg[0]
    msg0 = msg[0]
    msg1 = msg[1]
    msg2 = msg[2]
    msgParameter = midiMsg[1]
    channel = -1

    # System events
    # FCB1010 has 10 banks 0..9
    # Banks 0..3 are set to control the external Midi Devices.
    #    CC1 messages : Channel 5 (msg0 = 180 )
    #    Pedals send (msg1 = 20, msg2 = 11..20) :
    #        Switch1 = 11
    #        Switch2 = 12 ..
    #        Switch6 = 16
    #        Switch17 = 17
    #    Epression Pedal 1 sends messages on channel 6 msg0 = 181, msg1 = 7
    #    Epression Pedal 2 sends messages on channel 1 msg0 = 176, msg1 = 7
    #    Selected bank can be identified by CC2 message
    #       where msg1 = 1 and msg2 = 1..4

    # Bank  8 is programmed to initiate the Raspberry Pi system commands.
    #    Pedals send (msg0 = 180, msg1 == 3, msq2 = 1..10)

    # This vesion of the software will use Bank 1 to control the songs of the "Current Gig"
    # Bank 2 will be used to select any song in a dictionary of available songs

    if msg0 == FCB_CONTROL_STATUS:
        if msg1 == FCB_SYSTEM_COMMAND_CC:  # FCB1010 bank 8 is programmed to send system actions
            if msg2 < 5:
                gMode = 'Live'
                if systemCommands.executeSystemCommand(msg2):
                    gExitFlag = True
            return
        elif msg1 == FCB_BANK_SELECT_CC:
            return
        elif msg1 == FCB_PROGRAM_SELECT_CC:  # FCB1010 bank 8 is programmed to send this for Banks 0 - 3
            myutils.printDebug(msg2)
            gMode = 'Live'
            gConfigChannel = 0
            if msg2 == 11:  # Pedal1
                clearScreenDebug()
                songSelection.setSongProgram(0)
            elif msg2 == 12:  # Pedal2
                clearScreenDebug()
                songSelection.setSongProgram(1)
            elif msg2 == 13:  # Pedal3
                clearScreenDebug()
                songSelection.setSongProgram(2)
            elif msg2 == 14:  # Pedal4
                clearScreenDebug()
                songSelection.setSongProgram(3)
            elif msg2 == FCB_PEDAL_6_VALUE:
                clearScreenDebug()
                songSelection.toggleLiveDelayEffect()
            elif msg2 == FCB_PEDAL_7_VALUE:
                clearScreenDebug()
                songSelection.toggleLiveReverbEffect()
            elif msg2 == FCB_PEDAL_8_VALUE:
                clearScreenDebug()
                songSelection.toggleLiveModEffect()
            elif msg2 == FCB_PEDAL_9_VALUE:
                clearScreenDebug()
                songSelection.toggleLiveBoostEffect()

            elif msg2 == 15:  # Pedal5
                clearScreenDebug()
                songSelection.selectNextSong(-1)
                # setSongProgram(0)
            elif msg2 == 20:  # Pedal10
                clearScreenDebug()
                songSelection.selectNextSong(1)
                # setSongProgram(0)

            # gSynthTest = 0
            # gPianoTest = 0

    elif msg0 == FCB_EXPRESSION_PEDAL_2_STATUS and msg1 == VOLUME_CC:
        # Send synth volume to the configured pedal 2 target channels.
        volume = calibratePedalVolume(PEDAL2_MAX_VALUE, msg2)

        if (gMode == 'Live'):
            # if (volume > gPedal2MaxVolume):
            #  volume = gPedal2MaxVolume
            for channel, volumeIdx in EXPRESSION_PEDAL_2_TARGETS:
                sendPedalVolumeCC(channel, volumeIdx, volume)
        elif gMode == 'Config':
            if gConfigChannel > 0:
                sendCCMessage(gConfigChannel, VOLUME_CC, volume)
                myutils.printDebug(
                    f"Config volume. Channel{gConfigChannel} value {volume}")
            controllerSocket.sendPresetVolume(volume)
        else:
            myutils.printDebug(f"Unknown application mode")
            displayData.drawError('Unknown mode')
            gMode = 'Live'
            gConfigChannel = 0

    elif msg0 == FCB_EXPRESSION_PEDAL_1_STATUS and msg1 == VOLUME_CC:
        # Send guitar processor volume to the configured pedal 1 target channels.
        volume = calibratePedalVolume(PEDAL1_MAX_VALUE, msg2)

        if (gMode == 'Live'):
            # if (volume > gPedal1MaxVolume):
            # volume = gPedal1MaxVolume
            for channel, volumeIdx in EXPRESSION_PEDAL_1_TARGETS:
                sendPedalVolumeCC(channel, volumeIdx, volume)

        elif gMode == 'Config':
            if gConfigChannel > 0:
                sendCCMessage(gConfigChannel, VOLUME_CC, volume)
                controllerSocket.sendPresetVolume(volume)
                myutils.printDebug(
                    f"Config volume. Channel{gConfigChannel} value {volume}")
        else:
            myutils.printDebug(f"Unknown application mode")
            displayData.drawError('Unknown mode')
            gMode = 'Live'
            gConfigChannel = 0

    else:
        gMode = 'Live'
        gConfigChannel = 0

# ----------------------------------------------------------------


def ignoreInputMessage(msg):
    if msg[0] == FCB_EXPRESSION_PEDAL_2_STATUS and msg[1] == VOLUME_CC:
        return False
    elif msg[0] == FCB_EXPRESSION_PEDAL_1_STATUS and msg[1] == VOLUME_CC:
        return False
    elif msg[0] == FCB_CONTROL_STATUS and msg[1] == FCB_PROGRAM_SELECT_CC:
        return False
    elif msg[0] == FCB_CONTROL_STATUS and msg[1] == FCB_SYSTEM_COMMAND_CC:
        return False
    elif msg[0] == FCB_CONTROL_STATUS and msg[1] == FCB_BANK_SELECT_CC and msg[2] > 0 and msg[2] < 5:
        return True
    else:
        return True

# ----------------------------------------------------------------


def getMidiMsg(midiInput):
    gotMsg = False
    # print("-----")
    if not gMidiOutput:
        print("gMidiOutput is not set")

    while not (gotMsg):
        if midiInput.poll():
            gotMsg = True
            inputData = midiInput.read(100)
            for msg in inputData:
                listInp = list(msg)
                # Message comes as an array [[180,1,1],0]
                if ignoreInputMessage(msg[0]):
                    continue
                else:
                    getActionForReceivedMessage(msg)
            processPendingVolumeReasserts()
        else:
            processPendingVolumeReasserts()
            sleep(MIDI_RECEIVE_DELAY)

# ----------------------------------------------------------------


# Main Module
pygame.midi.init()

displayData.initDisplay()
displayData.clearScreen()


if len(sys.argv) > 1:
    if str(sys.argv[1]).upper() == 'DEBUG':
        myutils.setDebugFlag(True)

# Show the list of available midi devices
myutils.printDebug(pygame.midi.get_count())
if myutils.getDebugFlag():
    for id in range(pygame.midi.get_count()):
        myutils.printDebug("Id=%d Device=%s" % (id, pygame.midi.get_device_info(id)))

systemCommands.init(displayData, myutils.printDebug)
songSelection.init(
    displayData,
    myutils.printDebug,
    systemCommands.resetSystemCommandCounter,
)
controllerSocket.init(
    displayData,
    myutils.printDebug,
    songSelection.setCurrentSong,
    songSelection.setSongProgram,
    setControllerMode,
)
controllerSocket.connectToMessageServer()

# displayData.setMessageAPIStatus(255)
# displayData.drawScreen()

midiInput = None

while True:
    try:
        midiInput = pygame.midi.Input(MIDI_INPUT_DEVICE)  # Input MIDI device
        gMidiOutput = pygame.midi.Output(
            MIDI_OUTPUT_DEVICE, 0)  # Output MIDI device
        midiOutput.setMidiOutput(gMidiOutput)

        if midiInput:
            myutils.printDebug("Input MIDI devices is connected")
            sleep(0.04)

            if gMidiOutput:
                gMidiOutput.set_instrument(0)
                myutils.printDebug("Output MIDI devices is connected")
                sleep(0.04)
                break
    except:
        myutils.printDebug("MIDI device not ready....")
        pygame.midi.quit()
        sleep(1)
        pygame.midi.init()
    sleep(0.5)

myutils.printDebug("Everything ready now...")
songSelection.loadAllData()
sleep(MIN_DELAY)
songSelection.selectFirstSong()

while not gExitFlag:
    getMidiMsg(midiInput)

del midiInput
pygame.midi.quit()
