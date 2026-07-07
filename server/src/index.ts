import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Apply Helmet security headers
app.use(helmet());

// Configure Rate Limiting: Max 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again after 15 minutes." }
});
app.use("/api/", apiLimiter);

// Configure CORS securely
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "10kb" })); // Limit payload sizes to prevent Denial of Service

// --- Input Validation Helpers ---
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === "string" && email.length < 80 && emailRegex.test(email);
};

const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[0-9\s-]{10,15}$/;
  return typeof phone === "string" && phone.length < 20 && phoneRegex.test(phone);
};

// --- API Routes ---

// API Status health check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date(), platform: "Smart Bharat API" });
});

// Mock Auth Login Route
app.post("/api/auth/login", (req, res) => {
  const { email } = req.body;
  
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format or length exceeded." });
  }

  res.json({
    token: "mock-jwt-token-12345",
    user: {
      id: "user-rahul-123",
      fullName: "Rahul Sharma",
      email: email,
      role: "CITIZEN",
      profile: {
        age: 21,
        gender: "Male",
        income: 180000,
        occupation: "Student"
      }
    }
  });
});

// Mock Auth OTP request
app.post("/api/auth/otp-request", (req, res) => {
  const { phone } = req.body;
  
  if (!phone || !isValidPhone(phone)) {
    return res.status(400).json({ error: "Invalid phone number format or length exceeded." });
  }

  res.json({ success: true, message: `OTP sent successfully to ${phone}` });
});

// Mock Auth OTP verification
app.post("/api/auth/otp-verify", (req, res) => {
  const { phone, code } = req.body;
  
  if (!phone || !isValidPhone(phone)) {
    return res.status(400).json({ error: "Invalid phone number format." });
  }
  if (!code || typeof code !== "string" || code.length > 8) {
    return res.status(400).json({ error: "Invalid OTP code format." });
  }

  res.json({
    token: "mock-jwt-token-54321",
    user: {
      id: "user-rahul-123",
      fullName: "Rahul Sharma",
      phone: phone,
      email: "rahul.sharma@gmail.com",
      role: "CITIZEN",
      profile: {
        age: 21,
        gender: "Male",
        income: 180000,
        occupation: "Student"
      }
    }
  });
});

// AI Chat endpoint with prompt size restriction
app.post("/api/ai/chat", (req, res) => {
  const { message } = req.body;
  
  if (!message || typeof message !== "string" || message.length > 1000) {
    return res.status(400).json({ error: "Invalid input query. Content must be text and under 1000 characters." });
  }

  // A realistic mock response representing LLM pipeline
  let responseText = "I can assist you with your request. For the passport application, you need your Aadhaar card, PAN card, and address proof. You can apply on the official passportindia.gov.in portal. Would you like me to guide you step-by-step?";
  
  const query = message.toLowerCase();
  if (query.includes("scheme") || query.includes("kisan")) {
    responseText = "Based on your interest in schemes: The PM-KISAN scheme provides ₹6,000 yearly income support. Since you are registered as a farmer with income under ₹3 Lakh, you qualify. You will need your Land Ownership Documents and Aadhaar card to apply.";
  } else if (query.includes("road") || query.includes("damaged") || query.includes("garbage")) {
    responseText = "I see you have a civic issue to report. You can upload an image in the Complaint Desk and I will automatically tag the department (e.g. Municipal Corporation), assess priority, and lodge it for trackable updates.";
  }

  res.json({
    response: responseText,
    suggestedQuestions: [
      "What documents are needed for PM-KISAN?",
      "How can I track my complaint status?",
      "Am I eligible for PM Awas Yojana?"
    ]
  });
});

// AI Document Explainer route
app.post("/api/ai/document-explain", (req, res) => {
  const { documentType } = req.body;
  
  if (!documentType || typeof documentType !== "string" || documentType.length > 50) {
    return res.status(400).json({ error: "Invalid document specification." });
  }

  res.json({
    summary: `This is an analysis of the ${documentType}.`,
    deadlines: [
      { event: "Submission Deadline", date: "August 31, 2026" },
      { event: "Verification Auditing", date: "September 15, 2026" }
    ],
    fees: "₹1,500 (Standard processing) or ₹3,500 (Tatkaal / Express processing)",
    requirements: [
      "Proof of Identity (Aadhaar, PAN, or Voter ID)",
      "Proof of Address (Utility bill or Rent agreement)",
      "Date of Birth Certificate"
    ],
    faqs: [
      { q: "Is physical presence required?", a: "Yes, for biometric scans at the designated Center." },
      { q: "How long does verification take?", a: "Typically 15 to 30 working days depending on police verification." }
    ]
  });
});

// AI Document Validator OCR audit check
app.post("/api/ai/document-validate", (req, res) => {
  res.json({
    isValid: true,
    qualityMetrics: {
      blurLevel: "low (0.12)",
      contrast: "good (0.85)",
      isLegible: true
    },
    ocrData: {
      documentId: "XXXX-XXXX-8901",
      name: "RAHUL SHARMA",
      dob: "15/08/2005",
      address: "H-45, Connaught Place, New Delhi - 110001"
    },
    warnings: []
  });
});

// SMS Scam Detector route
app.post("/api/ai/fraud-detect", (req, res) => {
  const { text } = req.body;
  
  if (!text || typeof text !== "string" || text.length > 1000) {
    return res.status(400).json({ error: "Invalid SMS content length or format." });
  }

  const lowercaseText = text.toLowerCase();
  let riskScore = 15;
  let isScam = false;
  let advice = "This message seems official and safe. However, always double-check sender details.";
  let indicators = ["Official sender layout", "No urgent payment demands"];

  if (lowercaseText.includes("win") || lowercaseText.includes("lottery") || lowercaseText.includes("suspend") || lowercaseText.includes("click here") || lowercaseText.includes("aadhaar update link")) {
    riskScore = 92;
    isScam = true;
    indicators = [
      "Suspicious shortened URL (HTTP link instead of HTTPS)",
      "Urgent fear-inducing language ('Account will be blocked')",
      "Unofficial mobile number instead of government alphanumeric shortcode",
      "Request for Aadhaar / OTP details"
    ];
    advice = "WARNING: DO NOT click the link. Government departments never ask for OTPs or immediate payments via SMS. Block the sender and report to the national cybercrime portal (cybercrime.gov.in).";
  }

  res.json({ riskScore, isScam, advice, indicators });
});

// Start listening
app.listen(PORT, () => {
  console.log(`Smart Bharat Backend listening at http://localhost:${PORT}`);
});
