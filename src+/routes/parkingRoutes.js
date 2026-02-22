import express from "express";
const router = express.Router();

// Placeholder - we will add real routes later
router.get("/", (req, res) => {
    res.json({ message: "Auth route is working!" });
});

export default router;