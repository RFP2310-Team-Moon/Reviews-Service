const router = require("express").Router();
const controllers = require("./controllers");

router.route("/reviews").get(controllers.getReviews);
router.route("/reviews").post(controllers.postReview);
router.route("/reviews/:review_id/reported").put(controllers.report);
router.route("/reviews/:review_id/helpful").put(controllers.markHelpful);
router.route("/reviews/meta").get(controllers.getMetadata);

module.exports = router;
