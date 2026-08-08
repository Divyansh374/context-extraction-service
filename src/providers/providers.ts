import tavily from "./tavily.provider.js";
import brave from "./brave.provider.js";
import serper from "./serper.provider.js";

export function getProviders() {
    return [tavily, brave, serper];
}
