import express from "express";
import { validateRequest, extractContent } from "../controllers/extract.controller.js";
import { getKeywords } from "../services/pipeline.service.js";

const router = express.Router();

router.post("/", validateRequest, getKeywords, extractContent);

export default router;
