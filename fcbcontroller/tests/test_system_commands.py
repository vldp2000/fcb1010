import sys
import unittest
from pathlib import Path
from unittest.mock import Mock, patch


sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import systemCommands


class FakeDisplay:
    def __init__(self):
        self.calls = []

    def drawSysCommand(self, text):
        self.calls.append(("drawSysCommand", text))

    def drawShutdown(self):
        self.calls.append(("drawShutdown",))

    def drawReboot(self):
        self.calls.append(("drawReboot",))


class SystemCommandsTest(unittest.TestCase):
    def setUp(self):
        self.display = FakeDisplay()
        self.debugMessages = []
        systemCommands.init(self.display, self.debugMessages.append)
        systemCommands.gSystemCommandCounter = 0
        systemCommands.gSystemCommandCode = -1

    def test_reset_system_command_counter(self):
        systemCommands.gSystemCommandCounter = 1

        systemCommands.resetSystemCommandCounter()

        self.assertEqual(systemCommands.gSystemCommandCounter, 0)

    @patch.object(systemCommands.subprocess, "Popen")
    def test_first_shutdown_message_arms_command_without_executing(self, popenMock):
        result = systemCommands.executeSystemCommand(1)

        self.assertFalse(result)
        self.assertEqual(self.display.calls, [("drawSysCommand", "SHUTDOWN")])
        self.assertEqual(systemCommands.gSystemCommandCounter, 1)
        self.assertEqual(systemCommands.gSystemCommandCode, 1)
        popenMock.assert_not_called()

    @patch.object(systemCommands.subprocess, "Popen")
    def test_second_shutdown_message_executes_command(self, popenMock):
        process = Mock()
        process.communicate.return_value = [b"ok"]
        popenMock.return_value = process
        systemCommands.executeSystemCommand(1)

        result = systemCommands.executeSystemCommand(1)

        self.assertTrue(result)
        self.assertIn(("drawShutdown",), self.display.calls)
        popenMock.assert_called_once_with(
            ["/usr/bin/sudo", "/home/pi/sys/shutdown.sh"],
            stdout=systemCommands.subprocess.PIPE,
        )

    @patch.object(systemCommands.subprocess, "Popen")
    def test_reboot_and_restart_use_reboot_display_on_execute(self, popenMock):
        process = Mock()
        process.communicate.return_value = [b"ok"]
        popenMock.return_value = process

        systemCommands.executeSystemCommand(2)
        self.assertTrue(systemCommands.executeSystemCommand(2))
        systemCommands.resetSystemCommandCounter()
        systemCommands.executeSystemCommand(3)
        self.assertTrue(systemCommands.executeSystemCommand(3))

        self.assertEqual(self.display.calls.count(("drawReboot",)), 2)
        self.assertEqual(popenMock.call_count, 2)

    @patch.object(systemCommands.subprocess, "Popen")
    def test_different_command_rearms_instead_of_executing(self, popenMock):
        systemCommands.executeSystemCommand(1)

        result = systemCommands.executeSystemCommand(2)

        self.assertFalse(result)
        self.assertEqual(systemCommands.gSystemCommandCounter, 1)
        self.assertEqual(systemCommands.gSystemCommandCode, 2)
        popenMock.assert_not_called()

    @patch.object(systemCommands.subprocess, "Popen")
    def test_unknown_command_returns_false(self, popenMock):
        result = systemCommands.executeSystemCommand(99)

        self.assertFalse(result)
        self.assertEqual(self.display.calls, [])
        popenMock.assert_not_called()


if __name__ == "__main__":
    unittest.main()
