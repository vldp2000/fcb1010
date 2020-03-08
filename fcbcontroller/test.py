
import json

import io

import pygame
import pygame.midi
import time
import sys
# import socket
import struct
import subprocess
from array import *
from time import sleep

import pprint


#----------------------------------------------------------------

#Global Variables




#----------------------------------------------------------------
#Main Module 
pygame.midi.init()

print(pygame.midi.get_count())
for id in range(pygame.midi.get_count()):
  print( "Id=%d Device=%s" % (id,pygame.midi.get_device_info(id)) )


quit