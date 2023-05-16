from tools import *
from config import *
import displayData
from socketMessage import *
from midiMessage import *
import dataController
from globalVar import *


def selectNextSong(step):
  #global gGig
  global gCurrentSongIdx
  global gSystemCommandCounter
  #global gSelectedGigId

  gSystemCommandCounter = 0
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

  sendGigNotificationMessage(gSelectedGigId)
  #sleep(MIN_DELAY)
  id = gGig["shortSongList"][gCurrentSongIdx]["id"]
  #printDebug(f"Select song. id={id}")

  setCurrentSong(id)
  sendSongNotificationMessage(id)
  
  #displayData.drawScreen()
#----------------------------------------------------------------

def setCurrentSong(id):
  #global gCurrentSongIdx
  global gCurrentSong
  global gCurrentSongId

  try:
    if gCurrentSong:
      gCurrentSong.clear()
      gCurrentSong = None

    #gCurrentSong = dataController.getSong(id)
    gCurrentSong = dataController.readSongFromJson(id)

    if gCurrentSong:
      gCurrentSongId = gCurrentSong["id"]
      name = gCurrentSong["name"]
      #printDebug( f"Selected song = {name}" )
      displayData.setSongName(f"{gCurrentSongIdx}.{name}")
      setSongProgram(0)
    else: 
      printDebug("Song corrupted")
      displayData.drawError("Song corrupted")
      #sleep(1)

  except:
      printDebug("Song not found")
      displayData.drawError("Song not found")
      #sleep(1)

    #displayData.setSongName()
    #displayData.drawScreen()


#----------------------------------------------------------------

def setSongProgram(idx):
  global gCurrentProgramIdx
  #global gCurrentSongIdx
  #global gCurrentSong
  global gPedal1MaxVolume
  global gPedal2MaxVolume
  global gSystemCommandCounter

  gSystemCommandCounter = 0
  gCurrentProgramIdx = idx
 
  program = gCurrentSong["programList"][idx]

  if program:
    printDebug( f"Selected program. idx={idx}" )
    i = 0
    for songPreset in program['presetList']:
      setPreset(program, songPreset, i)
      i = i + 1

    #sleep(MIN_DELAY)
    setPreset(program, program['presetList'][1], 0)

    sendProgramNotificationMessage(idx)
    if  program['presetList'][0]['volume'] > 0:
      gPedal1MaxVolume = program['presetList'][0]['volume']
    else:
      gPedal1MaxVolume = program['presetList'][1]['volume']
    
    if program['presetList'][2]['volume'] > 0:
      gPedal2MaxVolume = program['presetList'][2]['volume']
    else:
      gPedal2MaxVolume = program['presetList'][3]['volume']
  else:
    printDebug(f"Program {idx} not found")    
    displayData.drawError(f"Program {idx} not found")
    #sleep(1)


#----------------------------------------------------------------
def setPreset(program, songPreset, idx):
  global gCurrentPCList
  #global gCurrentVolumeList
  global gCurrentDelayList
  global gCurrentReverbList
  global gCurrentModList
  #global gInstrumentChannelDict
  #global gPresetDict


  id = songPreset['refpreset']
  preset = gPresetDict[str(id)] 
  printDebug(f"Preset Selected  id={id} name ={preset['name']}")

  if preset:
    printDebug(f" >>  idx = {idx} ")
    channel = int( gInstrumentChannelDict[str(songPreset['refinstrument'])] )
    newPC = int(preset['midipc'])
    newVolume = songPreset['volume']
    mute = songPreset['muteflag']
    #currentDelay
    oldPC = gCurrentPCList[idx]
    oldVolume = gCurrentVolumeList[idx]

    printDebug(f" >> oldPC={oldPC} oldV={oldVolume} , newPC={newPC}  newV={newVolume}")  

    if newPC == oldPC and newPC > 0:
      if mute:
        muteChannel(channel, oldVolume, MIN_DELAY, 10)
        processProgramEffects(channel, songPreset)
        unmuteChannel(channel, newVolume, MIN_DELAY, 20)

    elif newPC != oldPC:
      if newPC == 0:
        sendCCMessage( channel, VOLUME_CC, 0)
        sendPCMessage(channel, newPC)
        sendCCMessage( channel, VOLUME_CC, 0)
      else:
        if mute:
          muteChannel(channel, oldVolume, MIN_DELAY, 10)

        sendPCMessage(channel, newPC)
        processProgramEffects(channel, songPreset)

        if mute:
          unmuteChannel(channel, newVolume, MIN_DELAY, 20)

        #sleep(MIN_DELAY)
        sendCCMessage( channel, VOLUME_CC, newVolume )

      if preset['refinstrument'] == 1:
        printDebug(f" Selected Program ={program['name']}  -  Preset = {preset['name']} ")    
        displayData.setProgramName(f"{program['name']}.{preset['name']}")

    gCurrentPCList[idx] = newPC
    #gCurrentVolumeList[idx] = newVolume
    #gCurrentDelayList[idx] =     
    displayData.drawScreen()
  else:
    printDebug(f"Preset {id} not found")    
    displayData.drawError(f"Preset {id} not found")
    sleep(0.2)
