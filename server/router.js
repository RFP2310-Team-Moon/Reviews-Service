const controllers = require("./controllers");
const router = require("express").Router();

router.route("/reviews").get(controllers.reviews.getReviews);
router.route("/reviews").post(controllers.reviews.postReview);
router.route("/reviews/:review_id/reported").put(controllers.reviews.report);
router
  .route("/reviews/:review_id/helpful")
  .put(controllers.reviews.markHelpful);
router.route("/reviews/meta").get(controllers.reviews.getMeta);

module.exports = router;
