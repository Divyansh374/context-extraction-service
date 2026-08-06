import { PipelineInput } from "../services/pipeline.service.ts";

declare global {
    namespace Express {
        interface Request {
            pipelineInput?: PipelineInput;
        }
    }
}

export {};
