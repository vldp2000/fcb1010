
#----------------------------------------------------------------
class Song(object):
  id = -1,
  name = "",
  tempo = 0,
  sequencenumber = -1,
  programs = []
  def __init__(self, **entries):
    self.__dict__.update(entries)
  def getId(self):
      return self.id
  def getPrograms(self):
      return self.programs     

#----------------------------------------------------------------
class Program(object):
  id = -1,
  name = "",
  midipedal = 0,
  presets = []
  def __init__(self, **entries):
    self.__dict__.update(entries)
  def getId(self):
      return self.id
  def getPresets(self):
      return self.presets     

#----------------------------------------------------------------
class Preset(object):
  id = -1,
  delayflag = 0,
  delayvalue = 0,
  modeflag = 0,
  muteflag = 0,
  pan = 64,
  refsong = -1,
  refsongprogram = -1,
  reverbflag = 0,
  reverbvalue = 0,
  volume = 0,
  midichannel = 0,
  bunknumber = 0,
  midipc = 0,
  midipedal = 0,
  peddlnamename = ''

  def __init__(self, **entries):
    self.__dict__.update(entries)
  def getId(self):
      return self.id

#----------------------------------------------------------------

