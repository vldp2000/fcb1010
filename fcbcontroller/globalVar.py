

gExitFlag = False
gInitialisationComplete = False


#Global Variables
gSelectedGigId = -1
gGig = {}
gCurrentSong = {}

gInstrumentChannelDict = {}
gPresetDict = {}
gInstrumentBankDict = {}

gDebugMessageCounter = 0
gMode = 'Live'
gConfigChannel = 0

gCurrentSongIdx = -1
gCurrentSongId = -1
gCurrentProgramIdx = -1
gCurrentPresetId = -1
gCurrentPreset = {}


gPedal1MaxVolume = 0
gPedal2MaxVolume = 0

#default value for second  volume pedal is 176 = 1st channel
#gPedal2_Channel = 176
#gChannel1 = 176
#gChannel2 = 177

gCurrentPCList = [0, 0, 0, 0]
gCurrentVolumeList = [0, 0, 0, 0]
gCurrentDelayList = [0, 0, 0, 0]
gCurrentReverbList = [0, 0, 0, 0]
gCurrentModList = [0, 0, 0, 0]

gSystemCommandCounter = 0
gSystemCommandCode = -1

gMidiOutput = None

gDebugFlag = False

