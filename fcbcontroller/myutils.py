gDebugFlag = False
gDebugCount = 0


def setDebugFlag(value):
    global gDebugFlag
    gDebugFlag = bool(value)


def getDebugFlag():
    return gDebugFlag


def printDebug(message):
    global gDebugCount
    if gDebugFlag:
        print(f"<{gDebugCount}>  --  {message}")
        gDebugCount += 1
