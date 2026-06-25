import sys
import types
import unittest
from pathlib import Path
from unittest.mock import Mock, patch


sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

sys.modules.setdefault("requests", types.SimpleNamespace(get=Mock()))

import dataHelper


class ItemWithId:
    def __init__(self, id):
        self.id = id


class DataHelperTest(unittest.TestCase):
    @patch.object(dataHelper.dataController, "getPresets", return_value=[{"id": 1}, {"id": 2}])
    def test_init_presets_returns_dict_by_string_id(self, _getPresets):
        self.assertEqual(dataHelper.initPresets(), {"1": {"id": 1}, "2": {"id": 2}})

    @patch.object(
        dataHelper.dataController,
        "getInstruments",
        return_value=[{"id": 1, "midichannel": 6}, {"id": 2, "midichannel": 1}],
    )
    def test_init_instruments_returns_channel_dict_by_string_id(self, _getInstruments):
        self.assertEqual(dataHelper.initInstruments(), {"1": 6, "2": 1})

    @patch.object(
        dataHelper.dataController,
        "getInstrumentBanks",
        return_value=[{"id": 1, "number": 10}, {"id": 2, "number": 20}],
    )
    def test_init_instrument_banks_returns_number_dict_by_string_id(self, _getInstrumentBanks):
        self.assertEqual(dataHelper.initInstrumentBanks(), {"1": 10, "2": 20})

    @patch.object(dataHelper.dataController, "getSong", return_value={"id": 8})
    def test_get_song_delegates_to_data_controller(self, _getSong):
        self.assertEqual(dataHelper.getSong(8), {"id": 8})

    @patch.object(dataHelper.dataController, "getScheduledGigId", return_value=5)
    @patch.object(dataHelper.dataController, "getGig", return_value={"id": 5})
    def test_load_scheduled_gig_loads_current_gig(self, getGig, _getScheduledGigId):
        self.assertEqual(dataHelper.loadScheduledGig(), {"id": 5})
        getGig.assert_called_once_with(5)

    def test_find_index_by_id_returns_index_or_negative_one(self):
        items = [ItemWithId(10), ItemWithId(20)]

        self.assertEqual(dataHelper.findIndexById(items, 20), 1)
        self.assertEqual(dataHelper.findIndexById(items, 30), -1)

    def test_unicode_to_ascii_replaces_known_sequences(self):
        self.assertEqual(
            dataHelper.unicodetoASCII("A\\xe2\\x80\\x99B\\xe2\\x80\\x94C"),
            "A'B-C",
        )


if __name__ == "__main__":
    unittest.main()
