const VALID_AGE_GROUPS = ["kid", "adult", "senior"];
const VALID_GENDERS = ["male", "female"];
const VALID_MODEL_STYLES = ["ecommerce", "fashion", "luxury", "casual", "traditional"];
const VALID_POSES = ["standing_front", "standing_angle", "walking", "crossed_arms"];
const VALID_GENERATIONS = [1, 2, 4, 8];

const validate = (req, res, next) => {
  const { ageGroup, gender, backgroundColor, modelStyle, pose, generations } = req.body;
  const files = req.files;

  // ─── Required: Images ───────────────────────────────────────
  if (!files || files.length === 0) {
    return res.status(400).json({
      success: false,
      // CHANGED: "At least one clothing image is required" → more human
      message: "Please add at least 1 clothing photo to continue.",
    });
  }

  // ─── Required: Age Group ────────────────────────────────────
  if (!ageGroup) {
    return res.status(400).json({
      success: false,
      message: "Please select an age group to continue.",
    });
  }
  if (!VALID_AGE_GROUPS.includes(ageGroup.toLowerCase())) {
    return res.status(400).json({
      success: false,
      // CHANGED: technical list → plain sentence
      message: "Invalid age group. Please choose Kid, Adult, or Senior.",
    });
  }

  // ─── Required: Gender ───────────────────────────────────────
  if (!gender) {
    return res.status(400).json({
      success: false,
      message: "Please select a gender to continue.",
    });
  }
  if (!VALID_GENDERS.includes(gender.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: "Invalid gender. Please choose Male or Female.",
    });
  }

  // ─── Optional: Model Style ──────────────────────────────────
  if (modelStyle && !VALID_MODEL_STYLES.includes(modelStyle.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: `Invalid model style. Choose from: ${VALID_MODEL_STYLES.join(", ")}.`,
    });
  }

  // ─── Optional: Pose ─────────────────────────────────────────
  if (pose && !VALID_POSES.includes(pose.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: `Invalid pose. Choose from: ${VALID_POSES.join(", ")}.`,
    });
  }

  // ─── Optional: Generations ──────────────────────────────────
  const genCount = parseInt(generations);
  if (generations && !VALID_GENERATIONS.includes(genCount)) {
    return res.status(400).json({
      success: false,
      message: `Invalid number of images. Choose 1, 2, 4, or 8.`,
    });
  }

  // ─── Optional: Background Color ─────────────────────────────
  if (backgroundColor && !/^#([0-9A-Fa-f]{6})$/.test(backgroundColor)) {
    return res.status(400).json({
      success: false,
      // CHANGED: added example in message
      message: "Invalid background color. Please use a hex code like #FFFFFF or #000000.",
    });
  }

  next();
};

module.exports = validate;