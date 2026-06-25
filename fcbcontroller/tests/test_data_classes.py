import json
import sys
import unittest
from pathlib import Path


sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from dataClasses import BroadcastMessage, CustomEncoder, Instrument, Preset, Program, SongPreset


class DataClassesTest(unittest.TestCase):
    def test_broadcast_message_stores_message_and_type(self):
        message = BroadcastMessage(b"abc", "CC")

        self.assertEqual(message.message, b"abc")
        self.assertEqual(message.messageType, "CC")

    def test_program_stores_values_and_presets(self):
        program = Program(1, "A", 11)
        program.presetList.append("preset")

        self.assertEqual(program.getId(), 1)
        self.assertEqual(program.getPresets(), ["preset"])

    def test_song_preset_stores_constructor_values(self):
        songPreset = SongPreset(1, 0, 2, 0, 0, 64, 1, 80, 100, 6, 3, 12)

        self.assertEqual(songPreset.getId(), (1,))
        self.assertEqual(songPreset.volume, (100,))
        self.assertEqual(songPreset.midipc, 12)

    def test_preset_and_instrument_get_id(self):
        preset = Preset(id=7)
        instrument = Instrument(id=8)

        self.assertEqual(preset.getId(), 7)
        self.assertEqual(instrument.getId(), 8)

    def test_custom_encoder_wraps_object_dict_by_class_name(self):
        payload = json.loads(json.dumps(Preset(id=7, name="Preset"), cls=CustomEncoder))

        self.assertEqual(payload, {"Preset": {"id": 7, "name": "Preset"}})


if __name__ == "__main__":
    unittest.main()
