
gDebugFlag = False

#---Print Debug utility-------------
def printDebug(message):
  global gDebugFlag
  if gDebugFlag:
    print(message)
