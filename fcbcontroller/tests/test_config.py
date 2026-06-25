import sys
import unittest
from pathlib import Path


sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import config


class ConfigTest(unittest.TestCase):
    def test_live_device_channels_match_current_routing(self):
        self.assertEqual(config.DEV1_GUITAR_CHANNEL, 6)
        self.assertEqual(config.DEV1_KEYBOARD_CHANNEL, 1)
        self.assertEqual(config.DEV2_GUITAR_CHANNEL, 4)
        self.assertEqual(config.DEV2_KEYBOARD_CHANNEL, 2)

    def test_expression_pedal_targets_are_derived_from_device_channels(self):
        self.assertEqual(
            config.EXPRESSION_PEDAL_1_TARGETS,
            (
                (config.DEV2_GUITAR_CHANNEL, config.DEV2_GUITAR_VOLUME_IDX),
                (config.DEV1_GUITAR_CHANNEL, config.DEV1_GUITAR_VOLUME_IDX),
            ),
        )
        self.assertEqual(
            config.EXPRESSION_PEDAL_2_TARGETS,
            (
                (config.DEV1_KEYBOARD_CHANNEL, config.DEV1_KEYBOARD_VOLUME_IDX),
                (config.DEV2_KEYBOARD_CHANNEL, config.DEV2_KEYBOARD_VOLUME_IDX),
            ),
        )

    def test_volume_indexes_match_current_volume_list_shape(self):
        all_indexes = {
            config.DEV1_GUITAR_VOLUME_IDX,
            config.DEV2_GUITAR_VOLUME_IDX,
            config.DEV1_KEYBOARD_VOLUME_IDX,
            config.DEV2_KEYBOARD_VOLUME_IDX,
        }

        self.assertEqual(all_indexes, {0, 1, 2, 3})


if __name__ == "__main__":
    unittest.main()
