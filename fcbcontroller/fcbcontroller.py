#A MIDI channel voice message consists of a status Byte followed by one or two data Bytes. Click here for a list of
#currently assigned MIDI controller numbers. 
#              Status Byte	Data Byte 1	Data Byte 2	Message	Legend 1000nnnn	0kkkkkkk 0vvvvvvv	
#Note Off	n=channel* k=key # 0-127(60=middle C) v=velocity (0-127) 1001nnnn	0kkkkkkk 0vvvvvvv	
#Note On	n=channel k=key # 0-127(60=middle C) v=velocity (0-127) 1010nnnn	0kkkkkkk	0ppppppp
#Poly Key Pressure	n=channel k=key # 0-127(60=middle C) p=pressure (0-127) 1011nnnn	0ccccccc	0vvvvvv
#Controller Change	n=channel c=controller v=controller value(0-127) 1100nnnn 0ppppp  [none]	
#Program Change	n=channel p=preset number (0-127) 1101nnnn	0ppppppp	[none]	
#Channel Pressure	n=channel p=pressure (0-127) 1110nnnn	0fffffff	0ccccccc	
#Pitch Bend	n=channel c=coarse f=fine (c+f = 14-bit
#resolution) ----------------------------------------------------------------

## 176 -CC Channel 1
## 179 -CC Channel 4
## 181 -CC Channel 6
## 192 -PC on Channel 1
## 197 -PC on Channel 6


# -*- coding: utf-8 -*-
import json

# Make it work for Python 2+3 and with Unicode
import io

import pygame
import pygame.midi
import time
import sys
import socket
import struct
import subprocess
from array import *
from time import sleep

import pprint

#----------------------------------------------------------------
class CustomEncoder(json.JSONEncoder):
  def default(self, o):
    return {'{}'.format(o.__class__.__name__): o.__dict__}

#----------------------------------------------------------------
class Preset(dict):
  def __init__(self, name, guitar1, guitar1volume, guitar2, guitar2volume,synth1, synth1volume, synth2, synth2volume):
    dict.__init__(self, name=name, guitar1=guitar1, guitar1volume=guitar1volume, guitar2=guitar2, guitar2volume=guitar2volume, synth1=synth1, synth1volume=synth1volume, synth2=synth2, synth2volume=synth2volume)

#----------------------------------------------------------------
class Song():
  def __init__(self, name, programs):
    self.name = name
    self.items = items

#----------------------------------------------------------------
class MidiPrograms():
  def __init__(self, songs):
    self.songs = songs


#----------------------------------------------------------------

#Global Variables
gMode = 'Live'
gCurrentGigId = -1
gCurrentSongId = -1
gProgram = 0
gReset = 0

gSongList = SongList([])

gSocket = None

#default value for second  volume pedal is 176 = 1st channel
gSeconPedalCC = 176
gChannel1 = 176

gLastSynth1Program = 0
gLastSynth1Volume = 0

gLastSynth2Program = 0
gLastSynth2Volume = 0

gLastGuitar1Program = 0
gLastGuitar1Volume = 0

gLastGuitar2Program = 0
gLastGuitar2Volume = 0


#----------------------------------------------------------------

def readDataFromAP():
  printDebug("READ DATA")
  global gProgramList
  global gFileNumber
  global gBank
  global gProgram
  global gReset
  global gBankDelta
  global gSocket

  # Read JSON file

  
  with open(fileName) as data_file:
    json_data = data_file.read()
    data = json.loads(json_data)

  gProgramList = MidiPrograms([])
  sleep(0.05)

  i = 0
  for x in data['MidiPrograms']['banks']:
    bank = x['Bank']
    items = []
    for item in bank['items']:
      items.append( Item( item['name'],
                          int(item['guitar1']),
                          int(item['guitar1volume']),
                          int(item['guitar2']),
                          int(item['guitar2volume']),
                          int(item['synth1']),
                          int(item['synth1volume']),
                          int(item['synth2']),
                          int(item['synth2volume']) ))
      i = i + 1
    #if gSocket != None
    gProgramList.banks.append(Bank( bank['name'], items ))
  #end for

  gBankDelta = 0
  resetPrograms()
  sendChangeBankProgram()

  printDebug("Data File read")

#----------------------------------------------------


def initProgramList():
  printDebug("INIT PROGRAM LIST")
  global gProgramList
  global gFileNumber

  items1 = []
  items1.append(Item("star 1A",0,127,0,0,127,127, 0,0))
  items1.append(Item("star 1B",1,127,0,0,127,127, 0,0))
  items1.append(Item("star 1C",2,127,0,0,2,127, 0,0))
  items1.append(Item("star 1D",3,127,0,0,2,127, 0,0))
  gProgramList.banks.append(Bank( "1", items1))

  items2 = []
  items2.append(Item("bird 2A",4,127,0,0,1,127, 0,0))
  items2.append(Item("bird 2B",5,127,0,0,127,127, 0,0))
  items2.append(Item("bird 2C",6,127,0,0,127,127, 0,0))
  items2.append(Item("bird 2D",7,127,0,0,127,127, 0,0))
  gProgramList.banks.append(Bank( "2", items2))


  items3 = []
  items3.append(Item("stranger 3A",8,0,0,0,0,127, 0,0))
  items3.append(Item("stranger 3B",9,127,0,0,127,127, 0,0))
  items3.append(Item("stranger 3C",10,127,0,0,0,127, 0,0))
  items3.append(Item("stranger 3D",11,127,0,0,0,127, 0,0))
  gProgramList.banks.append(Bank( "3", items3))


  items4 = []
  items4.append(Item("osd 4A",12,127,0,0,127,127, 0,0))
  items4.append(Item("osd 4B",13,127,0,0,4,127, 0,0))
  items4.append(Item("osd 4C",14,127,0,0,127,127, 0,0))
  items4.append(Item("osd 4D",15,127,0,0,3,127, 0,0))
  gProgramList.banks.append(Bank( "4", items4))


  items5 = []
  items5.append(Item("Svoboda 5A",16,127,0,0,127,127, 0,0))
  items5.append(Item("Svoboda 5B",17,127,0,0,127,127, 0,0))
  items5.append(Item("Svoboda 5C",18,127,0,0,1,127, 0,0))
  items5.append(Item("Svoboda 5D",19,127,0,0,3,127, 0,0))
  gProgramList.banks.append(Bank( "5", items5))

  items6 = []
  items6.append(Item("sw 6A",20,127,0,0,127,127, 0,0))
  items6.append(Item("sw 6B",21,127,0,0,127,127, 0,0))
  items6.append(Item("sw 6C",22,127,0,0,127,127, 0,0))
  items6.append(Item("sw 6D",23,127,0,0,127,127, 0,0))
  gProgramList.banks.append(Bank( "6", items6))

  items7 = []
  items7.append(Item("Down TR 7A",24,127,0,0,127,127, 0,120))
  items7.append(Item("Down TR 7B",25,127,0,0,127,127, 1,120))
  items7.append(Item("Down TR 7C",26,127,0,0,127,127, 2,120))
  items7.append(Item("Down TR 7D",27,127,0,0,127,127, 3,120))
  gProgramList.banks.append(Bank( "7", items7))


  items8 = []
  items8.append(Item("i 8A",28,127,0,0,127,127, 0,0))
  items8.append(Item("i 8B",29,127,0,0,127,127, 0,0))
  items8.append(Item("i 8C",30,127,0,0,127,127, 0,0))
  items8.append(Item("i 8D",31,127,0,0,127,127, 0,0))
  gProgramList.banks.append(Bank( "8", items8))

  printDebug("Programs Initialised")

  # Write JSON file
  try:
    to_unicode = unicode
  except NameError:
    to_unicode = str

  fileName = "files/MidiProgramList"+str(gFileNumber)+".json"
  printDebug(fileName)

  with io.open(fileName, 'w', encoding='utf8') as outfile:
    str_ = json.dumps(gProgramList,
                      indent=4, sort_keys=True, cls=CustomEncoder,
                      separators=(',', ': '), ensure_ascii=False)
    outfile.write(to_unicode(str_))

  printDebug("File Saved")

#----------------------------------------------------------------

def printDebug(message):
  global gMode
  if gMode == 'Debug':
    print message


#----------------------------------------------------------------

def executeSystemCommand(code):
  global gSynthTest
  global gPianoTest

  printDebug("EXECUTE SYSTEM COMMAND");
  command = "";
  if code == 6:
    #shutdown RPi
    command = "/usr/bin/sudo /home/pi/midicontrol/syscommand/shutdown.sh"
  elif code == 7:
    #reboot RPi
    command = "/usr/bin/sudo /home/pi/midicontrol/syscommand/reboot.sh";
  elif code == 8:
    #Set as Access Point
    command = "/usr/bin/sudo /home/pi/midicontrol/syscommand/networkaccesspoint.sh";
  elif code == 9:
    #connect to home network
    command = "/usr/bin/sudo /home/pi/midicontrol/syscommand/networkhome.sh";
  elif code == 10:
    #connect to multiple networks phone/home/gz firebird
    command = "/usr/bin/sudo /home/pi/midicontrol/syscommand/networkmulti.sh";

  elif code == 1:
    #SampleTank program
    gPianoTest = gPianoTest + 1
    sendRaveloxPCMessage(struct.pack( "BBB", 0xaa, 192, gPianoTest ))
  elif code == 2:
    #Synth Alschemy
    gSynthTest = gSynthTest + 1
    sendRaveloxPCMessage(struct.pack( "BBB", 0xaa, 193, gSynthTest ))
  elif code == 3:
    gSynthTest = 0
    gPianoTest = 0

  else:
    printDebug("ExecuteSystemCommand. Unknown command")
    return

  if command != "":
    printDebug("Code =%d, Command=%s" % (code, command))

    if gMode == 'Live' or gMode == 'Debug':
      import subprocess
      process = subprocess.Popen(command.split(), stdout=subprocess.PIPE)
      output = process.communicate()[0]
      printDebug(output)

#----------------------------------------------------------------

def sendRaveloxCCMessage(bytes):
  global gSocket
  gSocket.send( bytes )
  sleep(0.005)

#----------------------------------------------------------------

def sendRaveloxPCMessage(bytes):
  global gSocket
  gSocket.send( bytes )
  sleep(0.005)
  if gMode == 'Debug':
     msg = struct.unpack( "BBB",bytes)
     printDebug("SEND RAVELOX PC  MESSAGE  %d %d %d" % (msg[0],msg[1],msg[2]))

#----------------------------------------------------------------
def muteChannel(channel, volume, delay, step):
  if volume > 0:
    x = volume
    while x > 0:
      sendRaveloxCCMessage(struct.pack( "BBBB", 0xaa, channel, 7, x ))
      x = x - step
      sleep(delay)
    sendRaveloxCCMessage(struct.pack( "BBBB", 0xaa, channel, 7, 0 ))
#def muteChannel
#----------------------------------------------------------------
def unmuteChannel(channel, volume, delay, step):
  x = step
  while x < volume:
    sendRaveloxCCMessage(struct.pack( "BBBB", 0xaa, channel, 7, x ))
    x = x + step
    sleep(delay)
  sendRaveloxCCMessage(struct.pack( "BBBB", 0xaa, channel, 7, volume ))
#def unmuteChannel
#----------------------------------------------------------------

## 176 -CC Channel 1
## 177 -CC Channel 2
## 180 -CC Channel 5
## 181 -CC Channel 6
## 192 -PC on Channel 1
## 192 -PC on Channel 2
## 197 -PC on Channel 6


def sendChangeBankProgram():
  global gSeconPedalCC
  global gLastSynth1Program
  global gLastSynth1Volume
  global gLastGuitar1Program
  global gLastGuitar1Volume
  global gLastSynth2Program
  global gLastSynth2Volume
  global gLastGuitar2Program
  global gLastGuitar2Volume

  if gBankDelta <> 0:
    if gBankDelta == 1:
      increaseBiasFxBank()
    elif gBankDelta == -1:
      decreaseBiasFxBank()
  printDebug("send ChangeBank Program. Bank %d, Programm %d, Reset%d" % (gBank,gProgram,gReset))


  item = gProgramList.banks[gBank].items[gProgram]

  if item["synth1"] <> 0 and item["synth2"] == 0:
    gSeconPedalCC = gChannel1
  elif item["synth1"] == 0 and item["synth2"] <> 0:
    gSeconPedalCC = gChannel2
  elif item["synth1"] <> 0:
    gSeconPedalCC = gChannel2
  else:
    gSeconPedalCC = gChannel1


  #Guitar1 BIAS FX CHALLEL6 #181  mute Bias FX
  muteChannel(181,gLastGuitar1Volume, 0.02, 10)
  sleep(0.06)
  #Bias FX program
  sendRaveloxPCMessage(struct.pack( "BBB", 0xaa, 197, item["guitar1"] ))
  sleep(0.02)
  unmuteChannel(181,item["guitar1volume"],0.03, 10)

  gLastGuitar1Program = item["guitar1"]
  gLastGuitar1Volume = item["guitar1volume"]
  sleep(0.02)

  #Guitar2 BIAS FX CHALLEL4 #179  mute Bias FX
  muteChannel(179,gLastGuitar2Volume, 0.02, 10)
  sleep(0.0)
  #Bias FX program
  sendRaveloxPCMessage(struct.pack( "BBB", 0xaa, 195, item["guitar2"] ))
  sleep(0.03)
  unmuteChannel(179,item["guitar2volume"],0.03, 10)
  gLastGuitar2Program = item["guitar2"]
  gLastGuitar2Volume = item["guitar2volume"]
  sleep(0.04)

  #SampleTank program CHANNEL1 #176
  sendRaveloxPCMessage(struct.pack( "BBB", 0xaa, 192, item["synth1"] ))
  sleep(0.04)

  #SampleTank volume
  if gLastSynth1Volume != item["synth1volume"]:
    sendRaveloxCCMessage(struct.pack( "BBBB", 0xaa, 176, 7, item["synth1volume"] ))
    sleep(0.03)

  gLastSynth1Program = item["synth1"]
  gLastSynth1Volume = item["synth1volume"]


  #Alchemy Synth CHANNEL2
  if gLastSynth2Program > 0 and gLastSynth2Program != item["synth2"] :
    muteChannel(177, gLastSynth2Volume, 0.07, 20)

  if gLastSynth2Program != item["synth2"] :
    #Program Change 
    sendRaveloxPCMessage(struct.pack( "BBB", 0xaa, 193, item["synth2"] ))
    sleep(0.04)
    unmuteChannel(177, item["synth2volume"], 0.07, 20)
  else:
    sendRaveloxCCMessage(struct.pack( "BBBB", 0xaa, 177, 7, item["synth2volume"] ))

  sleep(0.03)
  gLastSynth2Program = item["synth2"]
  gLastSynth2Volume = item["synth2volume"]


  #next section is to send the values for MidiDesigner to dispay 
  #Midi Designer Guitar Display
  sendRaveloxCCMessage(struct.pack( "BBBB", 0xaa, 180, 16, gFileNumber ))
  sendRaveloxCCMessage(struct.pack( "BBBB", 0xaa, 180, 17, gBank ))
  sendRaveloxCCMessage(struct.pack( "BBBB", 0xaa, 180, 18, item["guitar1"] ))
  sendRaveloxCCMessage(struct.pack( "BBBB", 0xaa, 180, 22, item["guitar2"] ))
  #Midi Designer SampleTank Display
  sendRaveloxCCMessage(struct.pack( "BBBB", 0xaa, 180, 20, item["synth1"] ))
  #Midi Designer Alchemy Display
  sendRaveloxCCMessage(struct.pack( "BBBB", 0xaa, 180, 21, item["synth2"] ))

  printDebug("Send Combined Command. Name %s,Guitar %d, GuitarVol %d, Piano %d, PianoVol %d"% 
      (item["name"] , item["guitar1"] , item["guitar1volume"],  item["synth1"], item["synth1volume"]))

  printDebug("#----------------------------------------------------------------")
  printDebug("#----------------------------------------------------------------")

#----------------------------------------------------------------
def sendGenericMidiCommand(msg0, msg1, msg2):

  if  msg0 == gChannel1  or msg0 == gChannel2:
    msg0 = gSeconPedalCC
  printDebug("SEND GENERIC MIDI COMMAND")
  bytes = struct.pack( "BBBB", 0xaa, msg0, msg1, msg2 )
  #bytes = struct.pack( "BBBB", 0xff, msg0, msg1, msg2 )
  sendRaveloxCCMessage( bytes )

  printDebug("Send Generic Midi Command to Ravelox %d, %d, %d"% (msg0,msg1,msg2))

#----------------------------------------------------------------
def sendBiasFxCommand(msg0, msg1, msg2):
  printDebug("SEND BIASFX COMMAND")
  bytes = struct.pack( "BBBB", 0xaa, 181, msg1, msg2 )
  sendRaveloxCCMessage( bytes )
  printDebug("Send BiasFx Command to Ravelox %d, %d, %d"% (msg0,msg1,msg2))

#----------------------------------------------------------------
def prepareSampleTankCommand(msg0, msg1, msg2):
  printDebug("PREPARE SAMPLE TANK COMMAND")
  bytes = struct.pack( "BBBB", 0xaa, msg0, msg1, msg2 )
  sendRaveloxCCMessage( bytes )
  printDebug("Send SampleTank Command to Ravelox %d, %d, %d"% (msg0,msg1,msg2))

#----------------------------------------------------------------

def increaseBiasFxBank():
  printDebug("INCREASE BIASFX BANK")
  bytes = struct.pack( "BBBB", 0xaa, 181, 27, 100 )
  sendRaveloxCCMessage( bytes )
  printDebug("increase bank")

#----------------------------------------------------------------

def decreaseBiasFxBank():
  printDebug("DECREASE BIASFX BANK")
  bytes = struct.pack( "BBBB", 0xaa, 181, 28, 100 )
  sendRaveloxCCMessage( bytes )
  printDebug("decrease bank")

#----------------------------------------------------------------
def resetPrograms():
  global gReset
  global gBank
  global gProgram
  i = 0
  while i < 127:
    sendRaveloxCCMessage(struct.pack( "BBBB", 0xaa, 180, 19, i ))
    sleep(0.01)
    i = i + 10

  gReset = 0
  gBank = 0
  gProgram = 0
  printDebug("Reset")



#----------------------------------------------------------------
def setBankProgram(msg0, msg1, msg2):
  printDebug("SET BANK PROGRAMM")
  global gBank
  global gProgram
  global gReset
  global gBankDelta
  global gMode
  global gSeconPedalCC

  if msg2 == 11:  #pedal 1
    gReset = gReset + 1
    if gReset > 2:
      resetPrograms()
    printDebug("Reset. Bank %d, Programm %d, Reset%d" % (gBank,gProgram,gReset))
    return
  elif msg2 == 13: #pedal 3 #Second Volume pedal sends messages to ch 1
    gSeconPedalCC = gChannel1
    return
  elif  msg2 == 14: #pedal 4 #Second Volume pedal sends messages to ch 2
    gSeconPedalCC = gChannel2
    return
   
    #printDebug("BiasFX Control Change. %d" % msg2)
#    return

  #Select bank
  elif msg2 == 20:  #pedal 10
    #increase bank#
    gBank += 1
    gBankDelta = 1

    if gBank > 7:
      gBank = 0
    gProgram = 0

    printDebug("Bank %d, Programm %d, Reset%d" % (gBank,gProgram,gReset))

  elif msg2 == 15: #pedal 5
    #decrease bank#
    gBank -= 1
    gBankDelta = -1

    if gBank < 1:
      gBank = 7
    gProgram = 0

    printDebug("Bank %d, Programm %d, Reset%d" % (gBank,gProgram,gReset))


  gBankDelta = 0
  #Select programm
  if msg2 == 16: #pedal 6
    gProgram = 0
  elif msg2 == 17: #pedal 7
    gProgram = 1
  elif msg2 == 18: #pedal 8
    gProgram = 2
  elif msg2 == 19: #pedal 9
    gProgram = 3

  gReset = 0


#----------------------------------------------------------------
def sendMidiMsg(midiMsg):
  printDebug("SEND MIDI MSG")
  global gReset
  global gSynthTest
  global gPianoTest

  msg = midiMsg[0]
  msg0 = msg[0]
  msg1 = msg[1]
  msg2 = msg[2]
  msgParameter = midiMsg[1]

  printDebug(midiMsg)
  printDebug("-----")


#System events
  if msg0 == 180:
     if msg1 == 3: #FCB1010 bank 8 is programmed to send msg1 == 3  for system actions 
        executeSystemCommand(msg2)
        printDebug("[[1--" + str(gReset))
        return
     elif msg1 == 1:
        checkCurrentFile(msg2)
        printDebug("[[2--" + str(gReset))
        return
     elif msg1 == 20: #FCB1010 bank 8 is programmed to send msg1 == 20  for Banks 0 - 3 
        if msg2 == 12:
           sendBiasFxCommand(181, msg2, 110)
           printDebug("[[3--" + str(gReset))
           gReset = 0
        else:
           setBankProgram(msg0, msg1, msg2)
           printDebug("[[4--" + str(gReset))
           if msg2 ==11  or msg2 > 14:
              sendChangeBankProgram()
              printDebug('[[5--' +str(gReset))
        gSynthTest = 0
        gPianoTest = 0

     else:
        sendBiasFxCommand(msg0, msg1, msg2)
        printDebug('[[6--' +str(gReset))
        gReset = 0
  else:
     sendGenericMidiCommand(msg0, msg1, msg2)
     printDebug('[[7--' +str(gReset))
#     if msg0 == 176:
#        sendGenericMidiCommand(177, msg1, msg2)

#----------------------------------------------------------------
def getMidiMsg(midiInput):
#  printDebug(""))
  printDebug("GET MIDI MSG")
  gotMsg = 0
  while not(gotMsg):
    sleep(.001)
    if midiInput.poll():    
      gotMsg = 1
      inp = midiInput.read(100)
      for msg in inp:
        printDebug(">>>>New Message Received<<<<<")
        printDebug(msg)
        sendMidiMsg(msg)  

#----------------------------------------------------------------
def connectRavelox():
  global gSocket
  try:
    gSocket = socket.socket( socket.AF_INET, socket.SOCK_DGRAM )
    gSocket.connect( ("localhost", 5006 ) )
    gSocket.send("")
    gSocket.send("") # have to send twice to throw an error if ravelox not running
    return True
  except:
    return False

#----------------------------------------------------------------
#Main Module 
#pygame.init()
pygame.midi.init()

print str(sys.argv)
if len(sys.argv) > 1: 
  if str(sys.argv[1]) == 'Debug':
    gMode = 'Debug'

#Show the list of available midi devices
if gMode == 'Debug':
  for id in range(pygame.midi.get_count()):
    printDebug( "Id=%d Device=%s" % (id,pygame.midi.get_device_info(id)) )

runInit=False
if len(sys.argv) > 1: 
  if str(sys.argv[1]) == 'Init':
    runInit = True


if runInit == True: 
  initProgramList()
  printDebug( "Init. Progs")


port = 3
portOk = False

while not portOk:
  try:
    result = connectRavelox()
    if result:
      midiInput = pygame.midi.Input(port)
      portOk = True  
    else:
      printDebug("waiting for raveloxmidi...")
      sleep(1)

  except:
    printDebug("MIDI device not ready....")
    pygame.midi.quit()
    pygame.midi.init()
    sleep(2)

readData()

printDebug("Everything ready now...")

while 1:
  getMidiMsg(midiInput)

#---Close application
#gSocket.close()
gSocket.shutdown(2)
del midiInput
pygame.midi.quit()

