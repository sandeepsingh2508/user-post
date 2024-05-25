const postDB = require("../models/post");
const userAuthDB = require("../models/auth");
const response = require("../middlewares/response");
const { default: mongoose } = require("mongoose");
const createPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const decodedId = req.user.id;
    const { title, body, geoLocation } = req.body;
    if (!title || !body || !geoLocation) {
      return response.validationError(
        res,
        "Cannot create an post without proper information"
      );
    }
    const findUser = await userAuthDB.findById({ _id: userId });
    if (!findUser) {
      return response.notFoundError(res, "Cannot find this user");
    }
    const newPost = await new postDB({
      title: title,
      body: body,
      createdBy: decodedId,
      geoLocation: geoLocation,
    }).save();

    if (!newPost) {
      return response.internalServerError(res, "Cannot create the user Post");
    }
    response.successResponse(res, newPost, "Successfully create the user post");
  } catch (error) {
    response.internalServerError(res, error.message || "Internal server error");
  }
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id || id === ":id") {
      return response.validationError(
        res,
        "Cannot update user post without a userId"
      );
    }
    const { title, body, isActive } = req.body;
    console.log(isActive);
    const userId = req.user._id;
    const findUser = await userAuthDB.findById({ _id: userId });
    if (!findUser) {
      return response.notFoundError(res, "Cannot find user post");
    }
    const updatedData = {
      ...(title && { title: title }),
      ...(body && { body: body }),
      isActive: isActive,
    };
    console.log(updatedData);
    const updatedPost = await postDB.findByIdAndUpdate(
      { _id: id },
      updatedData,
      { new: true }
    );

    if (!updatedPost) {
      return response.internalServerError(res, "Cannot update the user post");
    }
    response.successResponse(
      res,
      updatedPost,
      "Successfully updated the user post"
    );
  } catch (error) {
    console.log(error);
    response.internalServerError(res, error.message || "Internal server error");
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id || id === ":id") {
      return response.validationError(
        res,
        "Cannot delete user post without a userId"
      );
    }
    const userId = req.user._id;
    const findUser = await userAuthDB.findById({ _id: userId });
    if (!findUser) {
      return response.notFoundError(res, "Cannot find user");
    }
    const deletedPost = await postDB.findByIdAndDelete({ _id: id });
    if (!deletedPost) {
      return response.internalServerError(res, "Cannot delete the post");
    }
    response.successResponse(
      res,
      deletedPost,
      "Successfully deleted the user post"
    );
  } catch (error) {
    response.internalServerError(res, error.message || "Internal server error");
  }
};

const getSinglePost = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id || id === ":id") {
      return response.validationError(
        res,
        "Cannot get user post without a userId"
      );
    }
    const userId = req.user._id;
    const findUser = await userAuthDB.findById({ _id: userId });
    if (!findUser) {
      return response.notFoundError(res, "Cannot find user");
    }
    const findPost = await postDB.findById({ _id: id });
    if (!findPost) {
      return response.notFoundError(res, "Cannot find user post");
    }

    response.successResponse(res, findPost, "Successfully find the user post");
  } catch (error) {
    response.internalServerError(res, error.message || "Internal server error");
  }
};

const getAllPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const decodedId = req.user.id;
    const findUser = await userAuthDB.findById({ _id: userId });
    if (!findUser) {
      return response.notFoundError(res, "Cannot find user");
    }
    const allPosts = await postDB.find({ createdBy: decodedId });
    if (!allPosts) {
      return response.internalServerError(res, "Post not found");
    }
    response.successResponse(res, allPosts || "Successfully found all post");
  } catch (error) {
    response.internalServerError(res, error.message || "Internal server error");
  }
};

const getActiveInactivePostCount = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const counts = await postDB.aggregate([
      {
        $match: {
          createdBy: userId,
        },
      },
      {
        $group: {
          _id: "$isActive",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: {
            $cond: {
              if: { $eq: ["$_id", true] },
              then: "Active",
              else: "Inactive",
            },
          },
          count: 1,
        },
      },
    ]);

    const result = counts.reduce(
      (acc, curr) => {
        acc[curr.status.toLowerCase()] = curr.count;
        return acc;
      },
      { active: 0, inactive: 0 }
    );
    response.successResponse(res, result, "Successfully fetched the result");
  } catch (err) {
    response.internalServerError(res, err.message);
  }
};

const postUsingCordinates = async (req, res) => {
  const { latitude, longitude, radius = 5000 } = req.query;

  try {
    if (!latitude || !longitude) {
      return response.validationError(
        res,
        "Latitude and longitude are required"
      );
    }
    const posts = await postDB.find({
      geoLocation: {
        $near: {
          $geometry: {
            type: Number,
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseInt(radius),
        },
      },
    });
    if (!posts) {
      return response.notFoundError(res, "Cannot find the posts");
    }
    response.successResponse(
      res,
      posts,
      "Successfully find all posts for given location"
    );
  } catch (error) {
    response.internalServerError(res, error.message);
  }
};
module.exports = {
  createPost,
  updatePost,
  deletePost,
  getSinglePost,
  getAllPost,
  getActiveInactivePostCount,
  postUsingCordinates
};
