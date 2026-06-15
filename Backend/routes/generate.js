const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const validate = require("../middlewares/validate");
const limiter = require("../middlewares/rateLimit");
const { generateModels } = require("../services/aiService");

/**
 * POST /generate-models
 * Accepts multipart form data with images + config fields
 */
router.post(
  "/generate-models",
  limiter,
  (req, res, next) => {
    upload.array("images", 4)(req, res, (err) => {
      if (!err) return next();

      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: `One of your photos is too large. Please use images under ${process.env.MAX_FILE_SIZE_MB || 10}MB.`,
        });
      }
      if (err.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({
          success: false,
          message: "You can only upload up to 4 photos at once.",
        });
      }
      if (err.message === "INVALID_FORMAT") {
        return res.status(400).json({
          success: false,
          message: "This file type is not supported. Please upload a JPG, PNG, or WEBP photo.",
        });
      }

      // Unknown multer error
      return res.status(400).json({
        success: false,
        message: "Could not read the uploaded file. Please try a different image.",
      });
    });
  },
  validate,
  async (req, res) => {
    try {
      const { ageGroup, gender, backgroundColor, modelStyle, pose, generations } = req.body;

      console.log(`[generate] Request — provider: ${process.env.AI_PROVIDER}, count: ${generations}`);

      const images = await generateModels({
        files: req.files,
        ageGroup,
        gender,
        backgroundColor: backgroundColor || "#FFFFFF",
        modelStyle: modelStyle || "ecommerce",
        pose: pose || "standing_front",
        generations: parseInt(generations) || 1,
      });

      return res.json({ success: true, images });

    } catch (error) {
      console.error("[generate] Error:", error.message);

      // CHANGED: pehle message string match karta tha — bahut fragile tha
      // Ab directly error.httpStatus use karo jo openai.js ne set kiya hai
      // Agar httpStatus nahi hai toh 500 default
      const statusCode = error.httpStatus || 500;

      return res.status(statusCode).json({
        success: false,
        message: error.message || "Something went wrong. Please try again.",
      });
    }
  }
);

module.exports = router;