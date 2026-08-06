import express from "express";
import { extractContent } from "../controllers/extract.controller.js";

const router = express.Router();

router.post("/", extractContent);

export default router;