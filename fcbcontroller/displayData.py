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
  g_Disp = Adafruit_SSD1306.SSD1306_128_64(rst=RST, i2c_address=0x3C)
  # Initialize library.
  g_Disp.begin()

  # Clear display.
  g_Disp.clear()
  g_Disp.display()


# First define some constants to allow easy resizing of shapes.
#  top = 0
#  bottom = height-top

def clearScreen():
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

  #font = ImageFont.truetype('PokemonClassic.ttf', 10)
  font = ImageFont.truetype('Code.ttf', 16)
  fontA = ImageFont.truetype('fontawesome-webfont.ttf', 14)

  # Get drawing object to draw on image.
  #draw.text((2, 0), "R", font=font, fill=255)
  #draw.ellipse((12,statusY1,20,statusY2), outline=255, fill=g_RaveloxmidiStatus )

  #draw.text((26, 0), "S", font=font, fill=255)
  #draw.ellipse((37,statusY1,45,statusY2), outline=255, fill=g_MessageAPIStatus)

  #  draw.text((51, 0), "D", font=font, fill=255)
  #  draw.ellipse((62,statusY1,70,statusY2), outline=255, fill=g_DataAPIStatus)
  
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
  if g_iPadStatus == 0:
    draw.text((82,1), chr(61706),  font=fontA, fill=255)
  else:
    draw.text((82,1), chr(61453),  font=fontA, fill=255)

  #Macbook connection status
  draw.rectangle((100,0,123,14), outline=255, fill=0)
  if g_MacBookStatus == 0:
    draw.text((104,1), chr(61704),  font=fontA, fill=255)
  else:
    draw.text((104,1), chr(61453),  font=fontA, fill=255)

  #61704  PC
  #61706 tablet
  #draw.text((101, 0), "M", font=font, fill=255)
  #draw.ellipse((112,statusY1,120,statusY2), outline=255, fill=g_MacBookStatus)

  ###font1 = ImageFont.truetype('RetroGaming.ttf', 10)
  font1 = ImageFont.truetype('Pixelade.ttf', 22)
  font2 = ImageFont.truetype('UAVOSDMono.ttf', 12)

  draw.text((0, 20), g_SongName, font=font1, fill=255)
  draw.text((0, 43), g_ProgramName, font=font2, fill=255)

  #draw.text((0, 20), '1.Down The River', font=font1, fill=255)
  #draw.text((0, 40), '2.Down THe River', font=font2, fill=255)

  # Display image.
  g_Disp.image(image)
  g_Disp.display()
  ##time.sleep(.1)


#initDisplay()
#clearScreen()

#drawScreen()

#time.sleep(10)
#clearScreen()
