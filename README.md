# Context Extraction Microservice

A Node.js/TypeScript microservice that collects relevant public content from
Reddit, LinkedIn and Instagram-adjacent web results and extracts structured
context signals using an LLM.

## Features

- Reddit content retrieval through PullPush
- LinkedIn content discovery through web search
- Instagram content discovery through web search
- Tavily → Brave → Serper search-provider fallback
- Automatic keyword extraction
- Cross-platform content normalization
- LLM-based context extraction
- Structured persona signals
- Graceful provider failure handling
- REST API

### 1. Architecture

                   POST /api/v1/extract
                           │
                           ▼
                    Input Validation
                           │
                           ▼
                    Keyword Extraction
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
       Reddit Scraper                Web Search
         (PullPush)          (Tavily → Brave → Serper)
             │                           │
             └─────────────┬─────────────┘
                           ▼
                    ContentItem[]
                           │
                           ▼
                    LLM Extraction
                           │
                           ▼
                  Structured Signals
                           │
                           ▼
                         JSON

### 2. Project Structure

src/
|---constants/
|     |-genericWords.ts
|     |-pipeline.constants.ts
|     |-prompt.constant.ts
|     |-stopWords.ts
|
|---controllers/
|     |-extract.controller.ts
|
|---middlewares/
|     |-globalErrorHandler.ts
|
|---providers/
|     |-tavily.provider.ts
|     |-brave.provider.ts
|     |-serper.provider.ts
|     |-providers.ts
|
|---routes/
|     |-extract.routes.ts
|
|---scrapers/
|     |-reddit/
|     |   |-reddit.scraper.ts
|     |-linkedIn/
|     |   |-linkedIn.scraper.ts
|     |-instagram/
|         |-instagram.scraper.ts
|
|---services/
|     |-getSearchData.service.ts
|     |-llm.service.ts
|     |-nlp.service.ts
|     |-pipeline.service.ts
|     |-prompt.service.ts
|     |-redditComment.service.ts
|     |-search.service.ts
|     |-word_scorer.service.ts
|
|---types/
|     |-contentItem.ts
|     |-keyword.ts
|     |-provider.ts
|     |-searchResult.ts
|     |-token.ts
|     |-express.d.ts
|
|---utils/
|     |-appError.ts
|     |-catchAsync.ts
|
|---app.ts
|---server.ts

### 3. Tech Stack

|Technology|Purpose|
|----------|-------|
|Node.js|Runtime|
|TypeScript|Type safety|
|Express|HTTP API|
|PullPush|Reddit data|
|Tavily|Primary web search|
|Brave Search|Secondary search fallback|
|Serper|Final search fallback|
|Groq|Context extraction|
|GitHub|Source control|

### 4. Prerequisites

- Node.js 20+
- npm
- API keys for:
  - Tavily
  - Brave Search
  - Serper
  - Groq

### 5. Installation

```Bash
git clone https://github.com/Divyansh374/context-extraction-service.git

cd context-extraction-service

npm install

cp .env.example .env
```

### 6. Environment Variables

```env
PORT=3000
TAVILY_API_KEY=<my-tavily-api-key>
BRAVE_API_KEY=<my-brave-api-key>
SERPER_API_KEY=<my-serper-api-key>
GROQ_API_KEY=<my-groq-api-key>
```

|Variable|Description|Required|
|--------|-----------|--------|
|PORT|Server Port|No|
|TAVILY_API_KEY|Tavily search authentication|Yes|
|BRAVE_API_KEY|Brave search authentication|Yes|
|SERPER_API_KEY|Serper authentication|Yes|
|GROQ_API_KEY|LLM authentication|Yes|

### 7. Running the Project

```Bash
# Development
npm run dev

# Build
npm run build

# Production
npm start
```

### 8. API

```http
POST /api/v1/extract
```
#### Description
Accepts a startup topic and industry and returns structured context extracted from publicly available content.

#### Request

```http
POST /api/v1/extract
Content-Type: application/json
```

```json
{
  "topic": "Doctors working in emergency departments need to quickly identify high-risk patients while balancing limited staff, unpredictable workloads, and constantly changing priorities.",
  "industry": "healthcare",
}
```

#### Response

```json
{
  "topic": "...",
  "industry": "healthcare",
  "report": {
    "signals": [
      {
        "contentId": "...",
        "painPoint": "Emergency departments are overwhelmed with non-emergency cases, leading to increased wait times and strain on staff.",
        "emotionalValence": "frustrated",
        "personaSignals": {
          "occupationClues": "healthcare professional",
          "lifeStage": "unknown",
          "geography": "unknown",
          "languageRegister": "formal",
        },
      },
    ]
  },
}
```

### 9. Response Schema

- contentId: Identifier of the source content.

- painPoint: Specific problem extracted from the content.

- emotionalValence: Emotional tone of the content.

- personaSignals: Inferences that can be supported by the available content.

- occupationClues: Occupation/profession clues.

- lifeStage: Student / early-career / mid-career / senior / retired / unknown.

- geography: City / state / region / unknown.

- languageRegister: Formal / casual / mixed / regional.

### 10. Search Provider Fallback

```text
Tavily
|
|--- results found -> return results
|
|--- empty / failure
          ||
          \/
         Brave
          |
          |--- results found -> return results
          |
          |--- empty / failure
                    ||
                    \/
                  Serper
```              

Web search providers are queried through a fallback chain. Tavily is attempted first, followed by Brave Search and finally Serper if the previous provider fails or returns no usable results.

### 11. Supported Sources

#### Reddit
Uses PullPush retreive Reddit content

#### LinkedIn
Does not directly scrape LinkedIn.
Instead:
```text
site:linkedin.com <keywords>
```

#### Instagram
Same approach:
```text
site:instagram.com <keywords>
```

### 12. Error Handling

```text
Provider failure
      ||
      \/
Try fallback provider
      ||
      \/
Another provider fails
      ||
      \/
Try final provider
      ||
      \/
No usable results
      ||
      \/
Return partial/empty result
```

#### API Level Errors

|Situation|Behaviour|
|---------|---------|
|Invalid request|```400 Bad Request```|
|Search provider failure|Fallback|
|All providers fail|Partial/clear failure response|
|LLM failure|```500```/appropriate error|
|Invalid LLM JSON|Handled by parser/error layer|

### 13. LLM Context Extraction

```text
Raw Content
    ||
    \/
Relevance Filtering
    ||
    \/
Pain point extraction
    ||
    \/
Emotional tone
    ||
    \/
Persona clues
    ||
    \/
Structured JSON    
```

## Limitations

- Search-engine results depend on what has already been indexed.
- Search snippets may contain less information than the original page.
- Some persona attributes cannot be inferred when the source contains insufficient evidence.
- External provider availability can affect source coverage.
- Free-tier API quotas are not equivalent to unlimited production capacity.