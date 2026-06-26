import time

import Adafruit_GPIO.SPI as SPI
import Adafruit_SSD1306

from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont

import subprocess

# Raspberry Pi pin configuration:
RST = None     # on the PiOLED this pin isnt used
# Note the following are only used with SPI:
DC = 23
SPI_PORT = 0
SPI_DEVICE = 0

g_Disp = None
g_DisplayInitialised = False
g_MessageAPIStatus = 0
g_DataAPIStatus = 0
g_iPadStatus = 0
g_MacBookStatus = 0
g_DelayEffectStatus = 0
g_ReverbEffectStatus = 0
g_ModEffectStatus = 0
g_BoostEffectStatus = 0

g_SongName = ''
g_ProgramName = ''

# 128x64 display with hardware I2C:
# disp = Adafruit_SSD1306.SSD1306_128_64(rst=RST)

# Note you can change the I2C address by passing an i2c_address parameter like:

def initDisplay():

  global g_Disp
  global g_DisplayInitialised
  try:
    print ("Display init 1")

    g_Disp = Adafruit_SSD1306.SSD1306_128_64(rst=RST, i2c_address=0x3C)
    print ("Display init 2")
    # Initialize library.
    g_Disp.begin()
    print ("Display init 3")

    g_Disp.clear()
    print ("Display init 4")
    g_Disp.display()
    print ("Display init 5")

    g_DisplayInitialised = True
    print ("Display init complete")
  except Exception as inst:
    print(type(inst))    # the exception instance
    print(inst.args)     # arguments stored in .args
    print(inst)              
  except:
    g_DisplayInitialised = False
    print ("Display init failed")


# First define some constants to allow easy resizing of shapes.
#  top = 0
#  bottom = height-top

def clearScreen():
  if not g_DisplayInitialised:
    return
  global g_Disp
  # Create blank image for drawing.
  # Make sure to create image with mode '1' for 1-bit color.
  width = g_Disp.width
  height = g_Disp.height
  image = Image.new('1', (width, height))
  # Get drawing object to draw on image.
  draw = ImageDraw.Draw(image)
  # Draw a black filled box to clear the image.
  draw.rectangle((0,0,width,height), outline=0, fill=0)

def setMessageAPIStatus(status):
  global g_MessageAPIStatus
  g_MessageAPIStatus = status

def setDataAPIStatus(status):
  global g_DataAPIStatus
  g_DataAPIStatus = status

def setSongName(name):
  global g_SongName
  g_SongName = name

def setProgramName(name):
  global g_ProgramName
  g_ProgramName = name

def setiPadStatus(status):
  global g_iPadStatus
  g_iPadStatus = status

def setMacBookStatus(status):
  global g_MacBookStatus
  g_MacBookStatus = status

def setEffectStatus(delayStatus, reverbStatus, modStatus, boostStatus=0):
  global g_DelayEffectStatus
  global g_ReverbEffectStatus
  global g_ModEffectStatus
  global g_BoostEffectStatus
  g_DelayEffectStatus = delayStatus
  g_ReverbEffectStatus = reverbStatus
  g_ModEffectStatus = modStatus
  g_BoostEffectStatus = boostStatus

def drawEffectStatus(draw, x, label, isOn, font, strikeOff=True):
  draw.rectangle((x,0,x+16,14), outline=255, fill=0)
  draw.text((x+4,1), label, font=font, fill=255)
  if strikeOff and not isOn:
    draw.line((x+3,12,x+13,2), fill=255)


def drawScreen():
  if not g_DisplayInitialised:
    return
  global g_Disp
  global g_MessageAPIStatus
  global g_DataAPIStatus
  global g_SongName
  global g_ProgramName
  global g_iPadStatus
  global g_MacBookStatus
  global g_DelayEffectStatus
  global g_ReverbEffectStatus
  global g_ModEffectStatus
  global g_BoostEffectStatus


  ###draw.rectangle((0,0,11,11), outline=255, fill=0)

  # Some other nice fonts to try: http://www.dafont.com/bitmap.php
  image = Image.new('1', (128, 64))
  # Get drawing object to draw on image.
  draw = ImageDraw.Draw(image)
  
  #draw.rectangle((0,0,127,14), outline=255, fill=0)

  statusY1 = 3
  statusY2 = 11

  fontA = ImageFont.truetype('font/fontawesome-webfont.ttf', 14)

  #Data API status
  draw.rectangle((0,0,20,14), outline=255, fill=0)
  if g_DataAPIStatus > 0:
    draw.text((6,1), chr(61888),  font=fontA, fill=255)
  else:
    draw.text((5,0), chr(61527),  font=fontA, fill=255)

  #Socket messenger status
  draw.rectangle((25,0,45,14), outline=255, fill=0)
  if g_MessageAPIStatus > 0:
    draw.text((29,1), chr(61671),  font=fontA, fill=255)
  else:
    draw.text((31,0), chr(62163),  font=fontA, fill=255)

  font2 = ImageFont.truetype('font/RetroGaming.ttf', 14)
  font1 = ImageFont.truetype('font/Pixelade.ttf', 22)
  fontEffect = ImageFont.truetype('font/RetroGaming.ttf', 12)
  #font2 = ImageFont.truetype('font/UAVOSDMono.ttf', 12)

  drawEffectStatus(draw, 50, 'D', g_DelayEffectStatus > 0, fontEffect)
  drawEffectStatus(draw, 69, 'R', g_ReverbEffectStatus > 0, fontEffect)
  drawEffectStatus(draw, 88, 'M', g_ModEffectStatus > 0, fontEffect)
  drawEffectStatus(draw, 107, 'B' if g_BoostEffectStatus > 0 else 'X', g_BoostEffectStatus > 0, fontEffect, False)

  draw.text((0, 20), g_SongName, font=font1, fill=255)
  draw.text((0, 43), g_ProgramName, font=font2, fill=255)

  #draw.text((0, 20), '1.Down The River', font=font1, fill=255)
  #draw.text((0, 40), '2.Down THe River', font=font2, fill=255)

  # Display image.
  g_Disp.image(image)
  g_Disp.display()
 
  ##time.sleep(.1)

def drawShutdown():
  if not g_DisplayInitialised:
    return
  
  global g_Disp
  
  g_Disp.clear()
  g_Disp.display()
  # Load image based on OLED display height.  Note that image is converted to 1 bit color.
  image = Image.open('image/Goodbye.png').convert('1')
  # Display image.
  g_Disp.image(image)
  g_Disp.display()
  time.sleep(2)
  g_Disp.clear()
  image = Image.open('image/GoodbyeBlack.png').convert('1')
  # Display image.
  g_Disp.image(image)
  g_Disp.display()

def drawReboot():
  if not g_DisplayInitialised:
    return

  global g_Disp

  g_Disp.clear()
  g_Disp.display()
  # Load image based on OLED display height.  Note that image is converted to 1 bit color.
  image = Image.open('image/Restart.png').convert('1')
  # Display image.
  g_Disp.image(image)
  g_Disp.display()
  time.sleep(2)

def drawSysCommand(textValue):
  if not g_DisplayInitialised:
    return

  global g_Disp
  image = Image.new('1', (128, 64))
  # Get drawing object to draw on image.
  draw = ImageDraw.Draw(image)
  
  font1 = ImageFont.truetype('font/RetroGaming.ttf', 20)
  font2 = ImageFont.truetype('font/Montserrat-Regular.ttf', 16)

  draw.text((1, 1), 'SYSTEM', font=font1, fill=255)
  draw.text((1, 30), textValue,  font=font2, fill=255)

  g_Disp.image(image)
  g_Disp.display()

def drawError(textValue):
  global g_Disp

  if not g_DisplayInitialised:
    return
  image = Image.new('1', (128, 64))
  # Get drawing object to draw on image.
  draw = ImageDraw.Draw(image)
  
  font1 = ImageFont.truetype('font/RetroGaming.ttf', 20)
  font2 = ImageFont.truetype('font/Montserrat-Regular.ttf', 16)

  draw.text((1, 1), 'ERROR', font=font1, fill=255)
  draw.text((1, 30), textValue,  font=font2, fill=255)

  g_Disp.image(image)
  g_Disp.display()

def drawMessage(headerValue,textValue):
  global g_Disp

  if not g_DisplayInitialised:
    return
  image = Image.new('1', (128, 64))
  # Get drawing object to draw on image.
  draw = ImageDraw.Draw(image)
  
  font1 = ImageFont.truetype('font/RetroGaming.ttf', 16)
  font2 = ImageFont.truetype('font/Montserrat-Regular.ttf', 16)

  draw.text((1, 1), headerValue, font=font1, fill=255)
  draw.text((1, 30), textValue,  font=font2, fill=255)

  g_Disp.image(image)
  g_Disp.display()
  
