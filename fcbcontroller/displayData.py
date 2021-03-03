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
g_RaveloxmidiStatus = 0
g_MessageAPIStatus = 0
g_DataAPIStatus = 0
g_iPadStatus = 0
g_MacBookStatus = 0

g_SongName = ''
g_ProgramName = ''


# 128x64 display with hardware I2C:
# disp = Adafruit_SSD1306.SSD1306_128_64(rst=RST)

# Note you can change the I2C address by passing an i2c_address parameter like:

def initDisplay():

  global g_Disp
  global g_DisplayInitialised
  try:
    g_Disp = Adafruit_SSD1306.SSD1306_128_64(rst=RST, i2c_address=0x3C)
    # Initialize library.
    g_Disp.begin()
    g_Disp.clear()
    g_Disp.display()
    g_DisplayInitialised = True
  except:
    g_DisplayInitialised = False


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

def setRaveloxmidiStatus(status):
  global g_RaveloxmidiStatus
  g_RaveloxmidiStatus = status

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
 
def drawScreen():
  if not g_DisplayInitialised:
    return
  global g_Disp
  global g_RaveloxmidiStatus
  global g_MessageAPIStatus
  global g_DataAPIStatus
  global g_SongName
  global g_ProgramName
  global g_iPadStatus
  global g_MacBookStatus

  ###draw.rectangle((0,0,11,11), outline=255, fill=0)

  # Some other nice fonts to try: http://www.dafont.com/bitmap.php
  image = Image.new('1', (128, 64))
  # Get drawing object to draw on image.
  draw = ImageDraw.Draw(image)
  
  #draw.rectangle((0,0,127,14), outline=255, fill=0)

  statusY1 = 3
  statusY2 = 11

  fontA = ImageFont.truetype('fontawesome-webfont.ttf', 14)

  #RaveloxMidi status
  draw.rectangle((0,0,20,14), outline=255, fill=0)
  if g_RaveloxmidiStatus > 0:
    draw.text((4, 1), chr(61931),  font=fontA, fill=255)
  else:
    draw.text((4, 1), chr(61453),  font=fontA, fill=255)

  #Data API status
  draw.rectangle((25,0,45,14), outline=255, fill=0)
  if g_DataAPIStatus > 0:
    draw.text((29,1), chr(61888),  font=fontA, fill=255)
  else:
    draw.text((29,1), chr(61527),  font=fontA, fill=255)
  
  #Socket messeger status
  draw.rectangle((50,0,70,14), outline=255, fill=0)
  if g_MessageAPIStatus > 0:
    draw.text((57,1), chr(61671),  font=fontA, fill=255)
  else:
    draw.text((57,1), chr(62163),  font=fontA, fill=255)

  #iPad connection status
  draw.rectangle((75,0,95,14), outline=255, fill=0) 
  if g_iPadStatus > 0:
    draw.text((81,1), chr(61706),  font=fontA, fill=255)
  else:
    draw.text((80,0), chr(61453),  font=fontA, fill=255)

  #Macbook connection status
  draw.rectangle((100,0,123,14), outline=255, fill=0)
  if g_MacBookStatus > 0:
    draw.text((104,1), chr(61704),  font=fontA, fill=255)
  else:
    draw.text((106,0), chr(61453),  font=fontA, fill=255)

  font2 = ImageFont.truetype('RetroGaming.ttf', 14)
  font1 = ImageFont.truetype('Pixelade.ttf', 22)
  #font2 = ImageFont.truetype('UAVOSDMono.ttf', 12)

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
  image = Image.open('Goodbye.png').convert('1')
  # Display image.
  g_Disp.image(image)
  g_Disp.display()
  time.sleep(2)
  g_Disp.clear()
  image = Image.open('GoodbyeBlack.png').convert('1')
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
  image = Image.open('Restart.png').convert('1')
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
  
  font1 = ImageFont.truetype('RetroGaming.ttf', 20)
  font2 = ImageFont.truetype('Montserrat-Regular.ttf', 16)

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
  
  font1 = ImageFont.truetype('RetroGaming.ttf', 20)
  font2 = ImageFont.truetype('Montserrat-Regular.ttf', 16)

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
  
  font1 = ImageFont.truetype('RetroGaming.ttf', 16)
  font2 = ImageFont.truetype('Montserrat-Regular.ttf', 16)

  draw.text((1, 1), headerValue, font=font1, fill=255)
  draw.text((1, 30), textValue,  font=font2, fill=255)

  g_Disp.image(image)
  g_Disp.display()
