import json
import sys
import tempfile
import types
import unittest
from pathlib import Path
from unittest.mock import Mock, patch


sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

sys.modules.setdefault("requests", types.SimpleNamespace(get=Mock()))

import config
import dataController


class DataControllerTest(unittest.TestCase):
    def _mock_response(self, data):
        response = Mock()
        response.json.return_value = data
        return response

    @patch.object(dataController.requests, "get")
    def test_get_scheduled_gig_id_returns_id_when_present(self, getMock):
        getMock.return_value = self._mock_response({"id": 9})

        self.assertEqual(dataController.getScheduledGigId(), 9)
        getMock.assert_called_once_with(config.API_URL + "/currentgig")

    @patch.object(dataController.requests, "get")
    def test_get_scheduled_gig_id_returns_negative_one_when_empty(self, getMock):
        getMock.return_value = self._mock_response({})

        self.assertEqual(dataController.getScheduledGigId(), -1)

    @patch.object(dataController.requests, "get")
    def test_get_gig_returns_data_when_present(self, getMock):
        getMock.return_value = self._mock_response({"id": 3, "name": "Gig"})

        self.assertEqual(dataController.getGig(3), {"id": 3, "name": "Gig"})
        getMock.assert_called_once_with(url=config.API_URL + "/gig/3")

    @patch.object(dataController.requests, "get")
    def test_get_gig_returns_empty_dict_when_missing(self, getMock):
        getMock.return_value = self._mock_response({})

        self.assertEqual(dataController.getGig(99), {})

    @patch.object(dataController.requests, "get")
    def test_get_collection_endpoints_return_json(self, getMock):
        getMock.return_value = self._mock_response([{"id": 1}])

        self.assertEqual(dataController.getPresets(), [{"id": 1}])
        self.assertEqual(dataController.getInstruments(), [{"id": 1}])
        self.assertEqual(dataController.getInstrumentBanks(), [{"id": 1}])

        self.assertEqual(
            [call.kwargs["url"] for call in getMock.call_args_list],
            [
                config.API_URL + "/all/preset",
                config.API_URL + "/all/instrument",
                config.API_URL + "/all/instrumentbank",
            ],
        )

    @patch.object(dataController.requests, "get")
    def test_get_song_returns_json(self, getMock):
        getMock.return_value = self._mock_response({"id": 7})

        self.assertEqual(dataController.getSong(7), {"id": 7})
        getMock.assert_called_once_with(config.API_URL + "/song/7")

    def test_read_song_from_json_uses_configured_folder(self):
        with tempfile.TemporaryDirectory() as tempDir:
            songFile = Path(tempDir) / "11.json"
            songFile.write_text(json.dumps({"id": 11, "name": "Song"}), encoding="utf-8")
            with patch.object(dataController, "PATH_TO_SONG_FOLDER", str(Path(tempDir)) + "\\"):
                self.assertEqual(
                    dataController.readSongFromJson(11),
                    {"id": 11, "name": "Song"},
                )


if __name__ == "__main__":
    unittest.main()
