import json

#----------------------------------------------------------------
class Song(object):
  id = -1,
  name = "",
  tempo = 0,
  sequencenumber = -1,
  programs = []
  def __init__(self, **entries):
    self.programs=[]
    self.__dict__.update(entries)
  def getId(self):
      return self.id
  def getPrograms(self):
      return self.programs     

#----------------------------------------------------------------
class Program(object):
  id = -1,
  name="",
  midipedal = 0,
  presets = []

  def __init__(self, **entries):
    self.__dict__.update(entries)
  def getId(self):
      return self.id
  def getPresets(self):
      return self.presets     
  def __init__(self, id, name, midipedal):
    self.id = id
    self.name = name
    self.midipedal = midipedal
    self.presets = []

#----------------------------------------------------------------
class Preset(object):
  id = -1,
  delayflag = 0,
  delayvalue = 0,
  modeflag = 0,
  muteflag = 0,
  pan = 64,
  reverbflag = 0,
  reverbvalue = 0,
  volume = 0,
  midichannel = 0,
  bunknumber = 0,
  midipc = 0

  def __init__(self, **entries):
    self.__dict__.update(entries)

  def getId(self):
      return self.id

  def __init__(self,id,delayflag,delayvalue,modeflag,muteflag,pan,reverbflag,
    reverbvalue,volume,midichannel,bunknumber,midipc):
    self.id = id,
    self.delayflag = delayflag,
    self.delayvalue = delayvalue,
    self.modeflag = modeflag,
    self.muteflag = muteflag,
    self.pan = pan,
    self.reverbflag = reverbflag,
    self.reverbvalue = reverbvalue,
    self.volume = volume,
    self.midichannel = midichannel,
    self.bunknumber = bunknumber,
    self.midipc = midipc

#----------------------------------------------------------------

#----------------------------------------------------------------
class CustomEncoder(json.JSONEncoder):
  def default(self, o):
    return {'{}'.format(o.__class__.__name__): o.__dict__}