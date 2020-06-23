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

def drawStatus():
  font = ImageFont.truetype('8-bit-pusab.ttf', 10)  
  image = Image.new('1', (128, 16))
  # Get drawing object to draw on image.
  draw = ImageDraw.Draw(image)
  draw.text((2, 0), "R", font=font, fill=255)
  draw.ellipse((12,0,27,15), outline=0, fill=0)
  #draw.rectangle((0,0,11,11), outline=0, fill=0)

  draw.text((30, 0), "M", font=font, fill=255)
  draw.ellipse((40,0,55,15), outline=0, fill=0)

  draw.text((2, 0), "F", font=font, fill=255)
  draw.ellipse((60,0,76,15), outline=0, fill=0)

 
def drawScreen():
  global g_Disp
  font1 = ImageFont.truetype('8-bit-pusab.ttf', 10)
  font2 = ImageFont.truetype('8-Bit Madness.ttf', 11)
  font3 = ImageFont.truetype('UAV-OSD-Sans-Mono.ttf', 10)
  # Some other nice fonts to try: http://www.dafont.com/bitmap.php
  image = Image.new('1', (128, 48))
  # Get drawing object to draw on image.
  draw = ImageDraw.Draw(image)
  x = 0
  top = 0
  draw.text((0, 25),       "Song name", font=font1, fill=255)

  # Display image.
  g_Disp.image(image)
  g_Disp.display()
  time.sleep(.1)


initDisplay()
clearScreen()

drawStatus()
drawScreen()

time.sleep(10)
clearScreen()
