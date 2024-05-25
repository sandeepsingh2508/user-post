const {
  updatePost,
  getSinglePost,
  createPost,
  getAllPost,
  deletePost,
  getActiveInactivePostCount,
  postUsingCordinates,
} = require("../controllers/post");

const isAuthorized = require("../middlewares/auth");
const { createValidate, updateValidate } = require("../validators/post");

const router = require("express").Router();
router.post("/create", isAuthorized, createValidate, createPost);
router.put("/update/:id", isAuthorized, updateValidate, updatePost);
router.get("/singlepost/:id", isAuthorized, getSinglePost);
router.get("/getall", isAuthorized, getAllPost);
router.delete("/delete/:id", isAuthorized, deletePost);
router.get(
  "/getactiveinactivecounts",
  isAuthorized,
  getActiveInactivePostCount
);
router.get("/postusingcordinates", isAuthorized, postUsingCordinates);

module.exports = router;
