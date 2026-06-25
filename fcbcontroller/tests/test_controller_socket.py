import importlib
import json
import sys
import types
import unittest
from pathlib import Path


sys.path.insert(0, str(Path(__file__).resolve().parents[1]))


class FakeSocketClient:
    def __init__(self):
        self.connectedUrl = None
        self.emitted = []
        self.events = {}
        self.handlers = {}

    def connect(self, url):
        self.connectedUrl = url

    def emit(self, event, payload):
        self.emitted.append((event, payload))

    def event(self, func):
        self.events[func.__name__] = func
        return func

    def on(self, event):
        def decorator(func):
            self.handlers[event] = func
            return func

        return decorator


fakeClient = FakeSocketClient()
fakeSocketio = types.SimpleNamespace(Client=lambda: fakeClient)
sys.modules["socketio"] = fakeSocketio

import config
import controllerSocket

controllerSocket = importlib.reload(controllerSocket)


class FakeDisplay:
    def __init__(self):
        self.calls = []

    def setMessageAPIStatus(self, status):
        self.calls.append(("setMessageAPIStatus", status))

    def drawScreen(self):
        self.calls.append(("drawScreen",))


class FailOnceDisplay(FakeDisplay):
    def __init__(self):
        super().__init__()
        self.shouldFail = True

    def setMessageAPIStatus(self, status):
        if self.shouldFail:
            self.shouldFail = False
            raise RuntimeError("display unavailable")
        super().setMessageAPIStatus(status)


class ControllerSocketTest(unittest.TestCase):
    def setUp(self):
        fakeClient.connectedUrl = None
        fakeClient.emitted.clear()
        self.display = FakeDisplay()
        self.debugMessages = []
        self.songIds = []
        self.programIndexes = []
        self.modePayloads = []
        controllerSocket.init(
            self.display,
            self.debugMessages.append,
            self.songIds.append,
            self.programIndexes.append,
            self.modePayloads.append,
        )

    def test_connect_to_message_server_uses_configured_url(self):
        controllerSocket.connectToMessageServer()

        self.assertEqual(fakeClient.connectedUrl, config.MESSAGE_URL)

    def test_socket_connect_sets_message_api_online(self):
        controllerSocket.connect()

        self.assertEqual(self.display.calls, [("setMessageAPIStatus", 255)])

    def test_socket_connect_failure_sets_message_api_offline(self):
        display = FailOnceDisplay()
        controllerSocket.gDisplayData = display

        controllerSocket.connect()

        self.assertIn("SOCKET connection can not be established", self.debugMessages)
        self.assertEqual(display.calls, [("setMessageAPIStatus", 0), ("drawScreen",)])

    def test_socket_message_and_disconnect_debug_and_update_display(self):
        controllerSocket.message("payload")
        controllerSocket.disconnect()

        self.assertIn("Message received with  payload", self.debugMessages)
        self.assertEqual(
            self.display.calls,
            [("setMessageAPIStatus", 0), ("drawScreen",)],
        )

    def test_incoming_view_messages_call_registered_callbacks(self):
        controllerSocket.processSongMessage(42)
        controllerSocket.processProgramMessage(2)
        controllerSocket.processControllerModeMessage("6")

        self.assertEqual(self.songIds, [42])
        self.assertEqual(self.programIndexes, [2])
        self.assertEqual(self.modePayloads, ["6"])

    def test_mocked_maintenance_song_event_selects_song(self):
        fakeClient.handlers[config.VIEW_SONG_MESSAGE](42)

        self.assertEqual(self.songIds, [42])

    def test_mocked_maintenance_program_event_selects_program(self):
        fakeClient.handlers[config.VIEW_PROGRAM_MESSAGE](2)

        self.assertEqual(self.programIndexes, [2])

    def test_mocked_maintenance_edit_mode_event_switches_controller_mode(self):
        fakeClient.handlers[config.VIEW_EDIT_MODE_MESSAGE]("6")
        fakeClient.handlers[config.VIEW_EDIT_MODE_MESSAGE]("0")

        self.assertEqual(self.modePayloads, ["6", "0"])

    def test_notification_messages_emit_expected_socket_events(self):
        controllerSocket.sendProgramNotificationMessage(3)
        controllerSocket.sendSongNotificationMessage(44)
        controllerSocket.sendGigNotificationMessage(5)
        controllerSocket.sendPresetVolume(99)

        self.assertEqual(
            fakeClient.emitted,
            [
                (config.PROGRAM_MESSAGE, "3"),
                (config.SONG_MESSAGE, "44"),
                (config.GIG_MESSAGE, "5"),
                (config.PRESETVOLUME_MESSAGE, "99"),
            ],
        )

    def test_send_sync_notification_message_emits_json_payload(self):
        controllerSocket.sendSyncNotificationMessage(1, 2, 3)

        event, payload = fakeClient.emitted[0]
        self.assertEqual(event, config.SYNC_MESSAGE)
        self.assertEqual(json.loads(payload), {"bankId": 1, "programIdx": 3, "songId": 2})


if __name__ == "__main__":
    unittest.main()
