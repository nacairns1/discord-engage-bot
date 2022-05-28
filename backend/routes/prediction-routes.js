const express = require("express");
const router = express.Router();

const {
	getPredictionByPredictionId,
	getUsersByPredictionId,
	createNewPredictionInGuildId,
    editPredictionByPredictionId,
    addNewPredictionInGuildId,
    removeUserFromGuildByGuildId
} = require("../controllers/prediction-controllers");

router.get("/:predictionId/users", getUsersByPredictionId);
router.get("/:predictionId", getPredictionByPredictionId);

router.post("/:predictionId/guildId", createNewPredictionInGuildId);

router.patch("/:predictionId", editPredictionByPredictionId);

router.post("/:predictionId/:guildId", addNewPredictionInGuildId);

router.delete("/:guildId/:userId", removeUserFromGuildByGuildId);

module.exports = router;
