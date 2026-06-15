const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ─── Step 1: Clothing analyse karo ────────────────────────────
const analyzeClothing = async (imageBuffer) => {
  const base64Image = imageBuffer.toString("base64");

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:image/png;base64,${base64Image}`,
            },
          },
          {
            type: "text",
            text: `Analyze this clothing item image carefully and respond in pure JSON only. No extra text, no markdown.
{
  "clothingType": "top" | "bottom" | "full_outfit" | "shoes" | "accessories",
  "shotType": "upper_body" | "lower_body" | "full_body" | "feet",
  "category": "shirt" | "t-shirt" | "jacket" | "coat" | "dress" | "pants" | "jeans" | "shorts" | "skirt" | "shoes" | "kurta" | "saree" | "lehenga" | "suit" | "other",
  "color": "exact color description",
  "pattern": "solid" | "striped" | "checkered" | "printed" | "embroidered" | "other",
  "fabric": "cotton" | "silk" | "denim" | "wool" | "polyester" | "linen" | "other",
  "details": "describe key details like collar type, sleeve length, buttons, embroidery, print, logo, etc",
  "fitType": "slim fit" | "regular fit" | "loose fit" | "oversized"
}`,
          },
        ],
      },
    ],
    max_tokens: 300,
  });

  try {
    const text = response.choices[0].message.content;
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    console.log("[openai] Clothing analysis:", parsed);
    return parsed;
  } catch {
    console.log("[openai] Analysis parse failed, using defaults");
    return {
      clothingType: "top",
      shotType: "upper_body",
      category: "shirt",
      color: "as shown in image",
      pattern: "as shown in image",
      fabric: "as shown in image",
      details: "as shown in uploaded image",
      fitType: "regular fit",
    };
  }
};

// ─── Step 2: Smart prompt banao ───────────────────────────────
const buildSmartPrompt = (info, { ageGroup, gender, modelStyle, pose, backgroundColor }) => {
  const style = modelStyle || "ecommerce";
  const bg = backgroundColor || "#FFFFFF";
  const poseLabel = (pose || "standing_front").replace(/_/g, " ");

  const shotMap = {
    upper_body: "upper body shot from waist up, model's torso and face clearly visible, focus on the upper garment",
    lower_body: "lower body shot from waist down to feet, focus on the bottom garment",
    full_body: "full body shot from head to toe, entire outfit visible",
    feet: "lower leg and feet shot, focus on the footwear",
  };

  const shot = shotMap[info.shotType] || shotMap.upper_body;

  return `TASK: Generate a professional ${style} fashion catalogue photo of a ${ageGroup} ${gender} model wearing the EXACT clothing item shown in the uploaded reference image.

CLOTHING TO RECREATE:
- Item: ${info.category}
- Color: ${info.color}
- Pattern: ${info.pattern}
- Fabric: ${info.fabric}
- Fit: ${info.fitType}
- Key details: ${info.details}

CRITICAL RULES:
- The clothing MUST be identical to the uploaded image — same color, same pattern, same design, same fabric texture, same fit, same every detail
- Do NOT change, modify, or improve the clothing in any way
- Do NOT add or remove any design elements
- Reproduce every visible detail exactly as shown

PHOTO SPECIFICATIONS:
- Shot type: ${shot}
- Model pose: ${poseLabel}
- Background: pure solid ${bg} color, no shadows, no gradients
- Lighting: professional studio lighting, soft and even
- Camera: sharp focus on garment, shallow depth of field
- Quality: ultra high resolution, photorealistic, not illustrated

OUTPUT STYLE: Premium ${style} catalogue photography, similar to top fashion ecommerce brands.`;
};

// ─── Error Mapper ─────────────────────────────────────────────
// CHANGED: ab httpStatus bhi set hota hai error pe
// Taki route.js string match nahi kare — direct status code use kare
const mapOpenAIError = (error) => {
  console.error("[openai] Raw error:", error?.status, error?.code, error?.message);

  const status = error?.status;
  const code = error?.code || error?.error?.code;

  let userMessage;
  let httpStatus;

  if (status === 429 && code === "insufficient_quota") {
    // Credits khatam
    userMessage = "AI generation credits are exhausted. Please try again later or contact support.";
    httpStatus = 503;
  } else if (status === 429) {
    // Too many requests
    userMessage = "Our AI is busy right now. Please wait 30 seconds and try again.";
    httpStatus = 429;
  } else if (status === 401 || code === "invalid_api_key") {
    // Wrong/expired key
    userMessage = "AI service authentication failed. Please contact support.";
    httpStatus = 503;
  } else if (status === 400 && code === "model_not_found") {
    // Model config issue
    userMessage = "AI model configuration error. Please contact support.";
    httpStatus = 503;
  } else if (status === 400) {
    // OpenAI rejected the image/request (content policy etc.)
    userMessage =
      error?.error?.message ||
      "This image could not be processed. Please try a different photo.";
    httpStatus = 400;
  } else if (status === 503 || status === 502) {
    // OpenAI server down
    userMessage = "AI service is temporarily unavailable. Please try again in a moment.";
    httpStatus = 502;
  } else {
    userMessage = "AI generation failed. Please try again.";
    httpStatus = 500;
  }

  const err = new Error(userMessage);
  err.httpStatus = httpStatus; // ← route.js yahi use karega
  return err;
};

// ─── Main Generate Function ───────────────────────────────────
const generate = async (prompt, imageBuffers, count, options = {}) => {
  const results = [];
  const primaryImageBuffer = imageBuffers[0];

  try {
    // Step 1: Clothing analyse karo
    console.log("[openai] Analyzing clothing...");
    const clothingInfo = await analyzeClothing(primaryImageBuffer);

    // Step 2: Smart prompt banao
    const smartPrompt = buildSmartPrompt(clothingInfo, options);
    console.log("[openai] Smart prompt built for:", clothingInfo.category);

    // Step 3: Image generate karo
    const imageFile = await OpenAI.toFile(primaryImageBuffer, "clothing.png", {
      type: "image/png",
    });

    const response = await client.images.edit({
      model: "gpt-image-2",
      image: imageFile,
      prompt: smartPrompt,
      n: count,
      size: "1024x1024",
      quality: "low",
    });

    for (const img of response.data) {
      if (img.url) {
        results.push({ url: img.url });
      } else if (img.b64_json) {
        results.push({ url: `data:image/png;base64,${img.b64_json}` });
      }
    }

    if (results.length === 0) {
      const err = new Error("AI returned no images. Please try again.");
      err.httpStatus = 500;
      throw err;
    }

    return results;
  } catch (error) {
    // Agar error already mapped hai (httpStatus set hai) toh directly throw karo
    if (error.httpStatus) {
      throw error;
    }
    // Warna OpenAI raw error ko map karo
    throw mapOpenAIError(error);
  }
};

module.exports = { generate };