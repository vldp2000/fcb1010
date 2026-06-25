import sys
import types
import unittest
from pathlib import Path
from unittest.mock import Mock, patch


sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

sys.modules.setdefault("requests", types.SimpleNamespace(get=Mock()))

if "socketio" not in sys.modules:
    class FakeSocketClient:
        def event(self, func):
            return func

        def on(self, _event):
            def decorator(func):
                return func

            return decorator

        def connect(self, _url):
            pass

        def emit(self, _event, _payload):
            pass

    sys.modules["socketio"] = types.SimpleNamespace(Client=FakeSocketClient)

import config
import songSelection


class FakeDisplay:
    def __init__(self):
        self.calls = []

    def drawMessage(self, title, message):
        self.calls.append(("drawMessage", title, message))

    def drawError(self, message):
        self.calls.append(("drawError", message))

    def setDataAPIStatus(self, status):
        self.calls.append(("setDataAPIStatus", status))

    def drawScreen(self):
        self.calls.append(("drawScreen",))

    def setSongName(self, name):
        self.calls.append(("setSongName", name))

    def setProgramName(self, name):
        self.calls.append(("setProgramName", name))


class SongSelectionTest(unittest.TestCase):
    def setUp(self):
        self.display = FakeDisplay()
        self.debugMessages = []
        self.resetCalls = []
        songSelection.init(self.display, self.debugMessages.append, lambda: self.resetCalls.append("reset"))
        self._reset_globals()

    def _reset_globals(self):
        songSelection.gSelectedGigId = -1
        songSelection.gGig = {}
        songSelection.gCurrentSong = {}
        songSelection.gInstrumentChannelDict = {}
        songSelection.gPresetDict = {}
        songSelection.gInstrumentBankDict = {}
        songSelection.gCurrentSongIdx = -1
        songSelection.gCurrentSongId = -1
        songSelection.gCurrentProgramIdx = -1
        songSelection.gCurrentPCList[:] = [0, 0, 0, 0]
        songSelection.gCurrentVolumeList[:] = [0, 0, 0, 0]
        songSelection.gCurrentDelayList[:] = [0, 0, 0, 0]
        songSelection.gCurrentReverbList[:] = [0, 0, 0, 0]
        songSelection.gCurrentModList[:] = [0, 0, 0, 0]
        songSelection.gInitialisationComplete = False

    @patch.object(songSelection, "sleep", return_value=None)
    @patch.object(songSelection.dataHelper, "loadScheduledGig", return_value={"id": 7, "name": "Gig"})
    @patch.object(songSelection.dataHelper, "initInstruments", return_value={"1": 6})
    @patch.object(songSelection.dataHelper, "initPresets", return_value={"1": {"id": 1}})
    @patch.object(songSelection.dataHelper, "initInstrumentBanks", return_value={"1": 10})
    def test_load_all_data_populates_controller_state(self, *_mocks):
        songSelection.loadAllData()

        self.assertEqual(songSelection.gSelectedGigId, 7)
        self.assertTrue(songSelection.gInitialisationComplete)
        self.assertIn(("drawMessage", "Gig loaded", "Gig"), self.display.calls)
        self.assertIn(("setDataAPIStatus", 255), self.display.calls)

    @patch.object(songSelection, "sleep", return_value=None)
    @patch.object(songSelection.dataHelper, "loadScheduledGig", side_effect=RuntimeError("boom"))
    def test_load_all_data_marks_api_offline_on_error(self, *_mocks):
        songSelection.loadAllData()

        self.assertFalse(songSelection.gInitialisationComplete)
        self.assertEqual(self.display.calls, [("setDataAPIStatus", 0), ("drawScreen",)])

    @patch.object(songSelection, "selectNextSong")
    def test_select_first_song_selects_first_scheduled_song(self, selectNextSongMock):
        songSelection.gGig = {"shortSongList": [{"id": 10}]}

        songSelection.selectFirstSong()

        selectNextSongMock.assert_called_once_with(1)
        self.assertEqual(songSelection.gCurrentProgramIdx, 0)

    @patch.object(songSelection.controllerSocket, "sendSongNotificationMessage")
    @patch.object(songSelection.controllerSocket, "sendGigNotificationMessage")
    @patch.object(songSelection, "setCurrentSong")
    def test_select_next_song_wraps_forward(self, setCurrentSongMock, sendGigMock, sendSongMock):
        songSelection.gSelectedGigId = 7
        songSelection.gGig = {"shortSongList": [{"id": 10}, {"id": 20}]}
        songSelection.gCurrentSongIdx = 1

        songSelection.selectNextSong(1)

        self.assertEqual(songSelection.gCurrentSongIdx, 0)
        sendGigMock.assert_called_once_with(7)
        setCurrentSongMock.assert_called_once_with(10)
        sendSongMock.assert_called_once_with(10)
        self.assertEqual(self.resetCalls, ["reset"])

    @patch.object(songSelection.controllerSocket, "sendSongNotificationMessage")
    @patch.object(songSelection.controllerSocket, "sendGigNotificationMessage")
    @patch.object(songSelection, "setCurrentSong")
    def test_select_next_song_wraps_backward(self, setCurrentSongMock, _sendGigMock, sendSongMock):
        songSelection.gGig = {"shortSongList": [{"id": 10}, {"id": 20}]}
        songSelection.gCurrentSongIdx = 0

        songSelection.selectNextSong(-1)

        self.assertEqual(songSelection.gCurrentSongIdx, 1)
        setCurrentSongMock.assert_called_once_with(20)
        sendSongMock.assert_called_once_with(20)

    @patch.object(songSelection, "setSongProgram")
    @patch.object(songSelection.dataController, "readSongFromJson", return_value={"id": 3, "name": "Song"})
    def test_set_current_song_loads_song_and_selects_first_program(self, _readSong, setSongProgramMock):
        songSelection.gCurrentSongIdx = 2

        songSelection.setCurrentSong(3)

        self.assertEqual(songSelection.gCurrentSongId, 3)
        self.assertIn(("setSongName", "2.Song"), self.display.calls)
        setSongProgramMock.assert_called_once_with(0)

    @patch.object(songSelection.dataController, "readSongFromJson", return_value={})
    def test_set_current_song_reports_corrupt_song(self, _readSong):
        songSelection.setCurrentSong(3)

        self.assertIn(("drawError", "Song corrupted"), self.display.calls)

    @patch.object(songSelection.dataController, "readSongFromJson", side_effect=RuntimeError("missing"))
    def test_set_current_song_reports_missing_song(self, _readSong):
        songSelection.setCurrentSong(3)

        self.assertIn(("drawError", "Song not found"), self.display.calls)

    @patch.object(songSelection.controllerSocket, "sendProgramNotificationMessage")
    @patch.object(songSelection, "setPreset")
    def test_set_song_program_sets_each_preset_and_notifies(self, setPresetMock, sendProgramMock):
        songSelection.gCurrentSong = {
            "programList": [
                {"name": "A", "presetList": [{"refpreset": 1}, {"refpreset": 2}]},
            ]
        }

        songSelection.setSongProgram(0)

        self.assertEqual(songSelection.gCurrentProgramIdx, 0)
        self.assertEqual(setPresetMock.call_count, 2)
        sendProgramMock.assert_called_once_with(0)
        self.assertEqual(self.resetCalls, ["reset"])

    @patch.object(songSelection.controllerSocket, "sendProgramNotificationMessage")
    @patch.object(songSelection, "setPreset")
    def test_set_song_program_reports_missing_program(self, setPresetMock, sendProgramMock):
        songSelection.gCurrentSong = {"programList": [None]}

        songSelection.setSongProgram(0)

        self.assertIn(("drawError", "Program 0 not found"), self.display.calls)
        setPresetMock.assert_not_called()
        sendProgramMock.assert_not_called()

    @patch.object(songSelection, "scheduleVolumeReassert")
    @patch.object(songSelection, "sendPCMessage")
    @patch.object(songSelection, "sendCCMessage")
    def test_set_preset_zero_pc_mutes_channel_and_schedules_zero_reassert(
        self,
        sendCCMock,
        sendPCMock,
        scheduleMock,
    ):
        songSelection.gInstrumentChannelDict = {"1": config.DEV1_GUITAR_CHANNEL}
        songSelection.gPresetDict = {"9": {"name": "Mute", "midipc": 0, "refinstrument": 1}}

        songSelection.setPreset({"name": "A"}, {"refpreset": 9, "refinstrument": 1, "volume": 99}, 0)

        self.assertEqual(
            sendCCMock.call_args_list,
            [
                unittest.mock.call(config.DEV1_GUITAR_CHANNEL, config.VOLUME_CC, 0),
                unittest.mock.call(config.DEV1_GUITAR_CHANNEL, config.VOLUME_CC, 0),
            ],
        )
        sendPCMock.assert_called_once_with(config.DEV1_GUITAR_CHANNEL, 0)
        scheduleMock.assert_called_once_with(config.DEV1_GUITAR_CHANNEL, 0)

    @patch.object(songSelection, "scheduleVolumeReassert")
    @patch.object(songSelection, "sendPCMessage")
    @patch.object(songSelection, "sendCCMessage")
    def test_set_preset_clamps_volume_updates_state_and_display(
        self,
        sendCCMock,
        sendPCMock,
        scheduleMock,
    ):
        songSelection.gInstrumentChannelDict = {"1": config.DEV1_GUITAR_CHANNEL}
        songSelection.gPresetDict = {"9": {"name": "Lead", "midipc": 12, "refinstrument": 1}}

        songSelection.setPreset({"name": "A"}, {"refpreset": 9, "refinstrument": 1, "volume": 200}, 0)

        self.assertEqual(
            sendCCMock.call_args_list,
            [
                unittest.mock.call(config.DEV1_GUITAR_CHANNEL, config.VOLUME_CC, 0),
                unittest.mock.call(config.DEV1_GUITAR_CHANNEL, config.VOLUME_CC, 127),
            ],
        )
        sendPCMock.assert_called_once_with(config.DEV1_GUITAR_CHANNEL, 12)
        scheduleMock.assert_called_once_with(config.DEV1_GUITAR_CHANNEL, 127)
        self.assertEqual(songSelection.gCurrentPCList[0], 12)
        self.assertEqual(songSelection.gCurrentVolumeList[0], 127)
        self.assertIn(("setProgramName", "A.Lead"), self.display.calls)
        self.assertIn(("drawScreen",), self.display.calls)

    @patch.object(songSelection, "sendCCMessage")
    def test_process_program_effects_sends_changed_flags_and_updates_state(self, sendCCMock):
        songSelection.processProgramEffects(
            False,
            0,
            config.DEV1_GUITAR_CHANNEL,
            {"delayflag": 1, "reverbflag": 0, "modeflag": 1},
        )

        self.assertEqual(
            sendCCMock.call_args_list,
            [
                unittest.mock.call(config.DEV1_GUITAR_CHANNEL, config.DELAY_EFFECT_OFF_CC, 127),
                unittest.mock.call(config.DEV1_GUITAR_CHANNEL, config.MOD_EFFECT_OFF_CC, 127),
            ],
        )
        self.assertEqual(songSelection.gCurrentDelayList[0], 1)
        self.assertEqual(songSelection.gCurrentReverbList[0], 0)
        self.assertEqual(songSelection.gCurrentModList[0], 1)

    @patch.object(songSelection, "sendCCMessage")
    def test_process_program_effects_same_pc_compares_against_existing_state(self, sendCCMock):
        songSelection.gCurrentDelayList[1] = 1
        songSelection.gCurrentReverbList[1] = 1
        songSelection.gCurrentModList[1] = 0

        songSelection.processProgramEffects(
            True,
            1,
            config.DEV1_GUITAR_CHANNEL,
            {"delayflag": 1, "reverbflag": 0, "modeflag": 0},
        )

        sendCCMock.assert_called_once_with(config.DEV1_GUITAR_CHANNEL, config.REVERB_EFFECT_OFF_CC, 127)


if __name__ == "__main__":
    unittest.main()
