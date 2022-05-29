const express = require("express");
const router = express.Router();

const {
	getPredictionByPredictionId,
	getUsersByPredictionId,
	createNewPredictionInGuildId,
    editPredictionByPredictionId,
    finishPredictionByPredictionId
} = require("../controllers/prediction-controllers");

router.get("/:predictionId/users", getUsersByPredictionId);

router.get("/:predictionId", getPredictionByPredictionId);

router.post("/new", createNewPredictionInGuildId);

router.post("/end", finishPredictionByPredictionId);

// router.patch("/:predictionId", editPredictionByPredictionId);

module.exports = router;
