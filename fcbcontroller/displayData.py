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

def drawScreen():
  global g_Disp
  font1 = ImageFont.truetype('8-bit-pusab.ttf', 11)
  font2 = ImageFont.truetype('8-bit-pusab.ttf', 11)
  font3 = ImageFont.truetype('8-bit-pusab.ttf', 11)
  # Some other nice fonts to try: http://www.dafont.com/bitmap.php
  image = Image.new('1', (g_Disp.width, g_Disp.height))
  # Get drawing object to draw on image.
  draw = ImageDraw.Draw(image)

  draw.text((x, top),       "Test 1 ", font=font1, fill=255)
  draw.text((x, top+18),    "TEST 2" , font=font2, fill=255)
  draw.text((x, top+40),    "TeSt 4" , font=font3, fill=255)

  # Display image.
  g_Disp.image(image)
  g_Disp.display()
  time.sleep(.1)


initDisplay()
clearScreen()
drawScreen()
time.sleep(10)
clearScreen()
