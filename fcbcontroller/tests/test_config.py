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

    def test_biasfx_effect_targets_are_guitar_only(self):
        self.assertEqual(
            config.BIASFX_EFFECT_TARGETS,
            (
                (config.DEV1_GUITAR_CHANNEL, config.DEV1_GUITAR_VOLUME_IDX),
                (config.DEV2_GUITAR_CHANNEL, config.DEV2_GUITAR_VOLUME_IDX),
            ),
        )

    def test_live_effect_ccs_are_consecutive_and_avoid_standard_volume_pan(self):
        self.assertEqual(config.BIASFX_DELAY_TOGGLE_CC, 20)
        self.assertEqual(config.BIASFX_REVERB_TOGGLE_CC, 21)
        self.assertEqual(config.BIASFX_MOD_TOGGLE_CC, 22)
        self.assertEqual(config.BIASFX_BOOST_TOGGLE_CC, 23)
        self.assertNotIn(config.BIASFX_BOOST_TOGGLE_CC, {config.VOLUME_CC, 10})

    def test_fcb_live_effect_pedals_match_buttons_6_to_9(self):
        self.assertEqual(config.FCB_PEDAL_6_VALUE, 16)
        self.assertEqual(config.FCB_PEDAL_7_VALUE, 17)
        self.assertEqual(config.FCB_PEDAL_8_VALUE, 18)
        self.assertEqual(config.FCB_PEDAL_9_VALUE, 19)

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
