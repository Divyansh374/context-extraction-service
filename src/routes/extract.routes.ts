import express from "express";
import { validateRequest, extractContent } from "../controllers/extract.controller.js";
import { extractKeywords } from "../services/pipeline.service.js";

const router = express.Router();

router.post("/", validateRequest, extractKeywords, extractContent);

export default router;
