import subprocess


gDisplayData = None
gPrintDebug = None
gSystemCommandCounter = 0
gSystemCommandCode = -1


def init(displayData, printDebug):
    global gDisplayData
    global gPrintDebug

    gDisplayData = displayData
    gPrintDebug = printDebug


def resetSystemCommandCounter():
    global gSystemCommandCounter
    gSystemCommandCounter = 0


def executeSystemCommand(code):
    global gSystemCommandCounter
    global gSystemCommandCode

    _debug("EXECUTE SYSTEM COMMAND")
    command = ""
    displayText = ""

    # Safety confirmation: first matching MIDI message arms the command,
    # second consecutive matching message executes it.
    if gSystemCommandCode != code and gSystemCommandCounter > 0:
        gSystemCommandCounter = 0

    if code == 1:
        displayText = 'SHUTDOWN'
        if gSystemCommandCounter > 0:
            gDisplayData.drawShutdown()
        command = "/usr/bin/sudo /home/pi/sys/shutdown.sh"
    elif code == 2:
        displayText = 'REBOOT'
        if gSystemCommandCounter > 0:
            gDisplayData.drawReboot()
        command = "/usr/bin/sudo /home/pi/sys/reboot.sh"
    elif code == 3:
        displayText = 'RESTART FCB1010'
        if gSystemCommandCounter > 0:
            gDisplayData.drawReboot()
        command = "/usr/bin/sudo systemctl restart fcb1010.service"
    else:
        _debug("ExecuteSystemCommand. Unknown command")
        return False

    if gSystemCommandCounter > 0:
        if command != "":
            _debug("Code =%d, Command=%s" % (code, command))
            process = subprocess.Popen(command.split(), stdout=subprocess.PIPE)
            output = process.communicate()[0]
            _debug(output)
        return True

    gDisplayData.drawSysCommand(displayText)
    _debug(displayText)
    gSystemCommandCounter = gSystemCommandCounter + 1
    gSystemCommandCode = code
    return False


def _debug(message):
    if gPrintDebug:
        gPrintDebug(message)
