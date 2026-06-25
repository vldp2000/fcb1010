import sys
import unittest
from pathlib import Path
from unittest.mock import patch


sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import myutils


class MyUtilsTest(unittest.TestCase):
    def setUp(self):
        myutils.gDebugFlag = False
        myutils.gDebugCount = 0

    def test_set_and_get_debug_flag(self):
        myutils.setDebugFlag(1)
        self.assertTrue(myutils.getDebugFlag())

        myutils.setDebugFlag("")
        self.assertFalse(myutils.getDebugFlag())

    @patch("builtins.print")
    def test_print_debug_prints_and_increments_when_enabled(self, printMock):
        myutils.setDebugFlag(True)

        myutils.printDebug("hello")

        printMock.assert_called_once_with("<0>  --  hello")
        self.assertEqual(myutils.gDebugCount, 1)

    @patch("builtins.print")
    def test_print_debug_is_silent_when_disabled(self, printMock):
        myutils.printDebug("hello")

        printMock.assert_not_called()
        self.assertEqual(myutils.gDebugCount, 0)


if __name__ == "__main__":
    unittest.main()
