# Context Extraction Service — Engineering Writeup

## 1. Overview

This project implements a context-extraction microservice for startup/market research.

Given a startup idea and its industry, the service:

1. Extracts search keywords from the supplied topic.
2. Retrieves publicly available posts/content from multiple sources.
3. Converts results from different providers into a common `ContentItem` representation.
4. Combines the collected content.
5. Uses an LLM to extract structured signals such as:
   - pain points
   - emotional valence
   - occupation clues
   - life stage
   - geography
   - language register
6. Returns the extracted information in JSON.

The implementation is intentionally provider-agnostic. Search providers and content sources are isolated behind interfaces so that individual providers can be replaced without changing the rest of the pipeline.


## 2. Architecture

The service is organized into several logical layers:

Request
  ↓
Validation
  ↓
Keyword extraction
  ↓
Content retrieval
  ├── Reddit / PullPush
  ├── Tavily
  ├── Brave
  └── Serper
  ↓
Provider fallback
  ↓
Content normalization
  ↓
Content selection
  ↓
LLM prompt generation
  ↓
LLM response generation
  ↓
Structured JSON response

### Provider abstraction

Search providers implement a common interface:

`SearchProvider.search(query) -> SearchResult[]`

This allows the application to use multiple search engines without restricting the pipeline to a particular provider or conditioning the LLM for different types of search results.

The search service uses the configured provider chain and falls back to the next provider when a provider fails or returns no useful results.

### Common content representation

Different sources do not expose the same fields.

For example, Reddit provides discussions and engagement information, while a search engine may provide only a title, URL and snippet.

Instead of maintaining separate downstream pipelines for every platform, results are normalized into a common `ContentItem` structure.

Fields that are unavailable for a particular source are left undefined rather than fabricated.

## 3. Source Selection

I deliberately separated content sources from search infrastructure because they have very different cost and reliability characteristics.

### 3.1 Reddit — PullPush

PullPush was selected as the primary Reddit data source because it exposes publicly available Reddit submissions and comments through an API without requiring a paid Reddit API subscription.

It provides dedicated endpoints for searching submissions and comments and therefore gives substantially richer data than a generic web-search result.

This is particularly useful for this project because Reddit discussions contain:

- personal experiences
- complaints
- feature requests
- workflows
- comments and discussion context
- engagement information

PullPush therefore provides a better signal for market research than simply searching Reddit URLs through a search engine.

However, I do **not** consider PullPush an infrastructure dependency that can be assumed to have production-grade availability forever. It is an external service, and its availability/index freshness is outside the application's control.

PullPush also experiences internal server errors very frequently which might result in less accuracy from the LLM model used.

The application therefore treats source failure as an expected condition rather than assuming that Reddit data will always be available.

### 3.2 Web Search — Tavily, Brave and Serper

For LinkedIn and Instagram, direct scraping was deliberately avoided.

The implementation instead performs targeted web searches such as:

    site:linkedin.com "keyword1" "keyword2"
    site:instagram.com "keyword1" "keyword2"

This allows the service to query search-engine indexes rather than interacting directly with platforms that may have login requirements, anti-bot systems, CAPTCHAs and frequently changing page/HTML structures.

The search providers are arranged as a fallback chain:

    Tavily → Brave → Serper

If the first provider fails or returns no usable results, the next provider is attempted.

#### Important limitation

These providers are NOT genuinely unlimited/free at production-scale usage.

I initially investigated their free tiers because the assignment requires minimizing dependence on paid scraping infrastructure. However, after implementing and testing the providers, I found that their free usage is intended primarily for development and limited usage rather than unlimited production traffic.

Therefore, I do not claim that Tavily, Brave or Serper satisfies the "genuinely unlimited/free" requirement.

Instead, I treat them as replaceable search infrastructure.

The provider abstraction means that a self-hosted or otherwise unrestricted search backend can be introduced later without changing the platform-specific search code or LLM layers.

## 3.3 My Research & Alternatives Considered

Before settling on the current search-provider architecture, I investigated several alternatives that could potentially reduce or eliminate the dependency on commercial search APIs.

The alternatives below were not rejected simply because they were inconvenient. I evaluated them based on cost, scalability, infrastructure requirements, search quality, latency, and how well they matched the specific requirements of this service.

### SearXNG

SearXNG was one of the most interesting alternatives I found.

It is an open-source metasearch engine that can be self-hosted and aggregates results from many search engines. This makes the software itself effectively free, with the main cost being the infrastructure required to operate it.

However, self-hosting SearXNG does not make the underlying search infrastructure unlimited.

SearXNG forwards searches to upstream search engines, meaning that a high-volume public deployment can itself be rate-limited or blocked by those engines. SearXNG's own documentation explicitly includes bot detection and rate limiting because excessive automated requests can cause upstream search engines to classify the instance as a bot.

For a production deployment, I would therefore need proper infrastructure, monitoring, rate limiting, and potentially a proxy/network strategy depending on the selected upstream engines.

I did not use SearXNG for this submission because I did not have suitable production infrastructure to operate it responsibly. Running it directly from my personal network would also make my home connection the infrastructure behind all search traffic.

**Why I would reconsider it in production:**  
With a proper VPS/cloud deployment, controlled request rates, caching and appropriate upstream configuration, SearXNG becomes a much more attractive option because the software itself does not impose a per-search API fee.

---

### fastCRW

I also investigated fastCRW, an open-source web scraping and crawling service.

Its self-hosted version is available under AGPL-3.0 and can be run without a license fee. The project also provides a `/v1/search` endpoint when deployed with its Docker stack, using a SearXNG sidecar for search.

This was particularly interesting because it could provide not only search but also scraping, crawling and mapping capabilities from the same infrastructure.

However, self-hosting moves the operational responsibility from the API provider to me.

A production deployment would require:

- server infrastructure
- bandwidth
- monitoring
- authentication
- rate limiting
- upstream search-engine management
- scaling/concurrency management
- protection against abuse

The fastCRW documentation itself recommends adding authentication, TLS and edge controls before exposing a self-hosted deployment broadly.

For this assignment, I did not have the appropriate VPS/cloud infrastructure or operational requirements to expose such a service safely.

**Why I would reconsider it in production:**  
If the service were deployed on proper infrastructure, fastCRW would be a strong candidate for reducing dependency on commercial scraping/search APIs. It is especially interesting because the same infrastructure could eventually handle search and page extraction.

---

### Exa

Exa was another strong candidate.

Its API currently provides a $10 monthly free allowance, in addition to signup credits. This is substantially more generous than a small one-time development allowance.

However, Exa is fundamentally designed as an AI-oriented search engine. It provides different search modes optimized for speed, quality and deeper reasoning, including `auto`, `instant`, `fast`, `deep-lite` and `deep`.

For this particular project, I wanted the search layer to behave primarily as a deterministic mechanism.

The queries I generate are intentionally platform-specific, for example:

    site:linkedin.com "keyword1" "keyword2"
    site:instagram.com "keyword1" "keyword2"

The goal is to retrieve indexed pages matching explicit keywords rather than have the search layer perform additional semantic interpretation.

Because Exa's core value proposition is AI-oriented search and semantic retrieval, I considered it less suitable for this particular provider role than a conventional web-search API.

Therefore, I did not use Exa despite its attractive free allowance.

**Why I would reconsider it:**  
Exa could become useful if the project evolves toward semantic discovery rather than strict keyword-based source retrieval. It may also be useful as a separate high-quality research provider rather than as a direct replacement for the current search providers.

---

### Bright Data

I also evaluated Bright Data's SERP API.

Bright Data currently provides a free tier of 5,000 SERP requests per month, followed by paid usage. Its current SERP pricing lists $1.50 per 1,000 requests for pay-as-you-go usage and approximately $1.30 per 1,000 additional requests on its larger scale plan.

The service is technically attractive because it provides managed proxy infrastructure, search-engine access and large-scale collection capabilities without requiring me to operate the underlying proxy infrastructure myself.

However, this comes with a higher cost than simpler search APIs.

For the relatively small search payload required by this project, I considered Bright Data's infrastructure to be more than was necessary. I would effectively be paying for a large-scale data-collection infrastructure when my application primarily needs search-result discovery.

I therefore rejected it for this implementation because of:

- higher per-request cost
- unnecessary infrastructure complexity for the current workload
- additional latency compared with simpler search APIs
- over-engineering relative to the requirements of this service

**Why I would reconsider it:**  
At significantly higher traffic volumes, Bright Data becomes more attractive because their managed proxy infrastructure removes a substantial amount of operational complexity. The higher cost could then be justified by the infrastructure and scalability it provides.

---

### Summary of Alternatives

| Option | Main advantage | Main drawback | Decision |
|--------|----------------|---------------|----------|
| SearXNG | Open-source, self-hostable, no API fee | Requires infrastructure and upstream search management | Rejected for current infrastructure |
| fastCRW | Search + scraping + crawling, self-hostable | Requires VPS/cloud infrastructure and operations | Rejected for current infrastructure |
| Exa | $10/month free API allowance and high-quality AI search | Less aligned with strict keyword-oriented discovery | Rejected for this use case |
| Bright Data | Managed proxies and scalable SERP infrastructure | Higher cost and unnecessary complexity for current workload | Rejected on cost/complexity |
| Tavily | Simple API and good search quality | Usage-limited free tier | Used |
| Brave | Independent fallback search provider | Usage-limited/paid beyond free allowance | Used |
| Serper | Simple Google SERP access and inexpensive at small scale | Limited free allowance | Used |

## 4. Why I Did Not Directly Scrape LinkedIn or Instagram

I considered directly scraping LinkedIn and Instagram using a headless browser.

I rejected this approach for several reasons:

- authentication/login walls
- CAPTCHA and anti-bot mechanisms
- risk of IP/account blocking
- unstable DOM structures
- platform layout changes
- higher operational complexity
- increased infrastructure requirements

A scraper that works today can break when the platform changes its frontend.

Search-engine indexing provides a less fragile alternative for this assignment because the service is interested primarily in discovering publicly indexed discussions and pages rather than reproducing the complete social-media platform.

The trade-off is that search results provide less information than direct platform APIs or scraping.

For example, a search result may contain:

- URL
- title
- snippet

but not:

- complete post body
- comments
- engagement
- author metadata

The normalized `ContentItem` therefore does not fabricate unavailable fields.

## 6. What Would Break First in Production?

The first limitations would not necessarily be the application code itself. They would primarily be external dependencies.

### 6.1 Search API quotas and cost

Tavily, Brave and Serper have usage limits/pricing.

At sufficient traffic, the search layer would become the first significant operational cost.

Preventive measures:

- provider fallback
- request deduplication
- caching
- query batching where possible
- limiting the number of search results
- configurable search depth
- usage monitoring
- per-provider budgets
- eventually replacing paid search APIs with self-hosted search infrastructure where economically justified

### 6.2 LLM token limits and cost

The LLM receives multiple pieces of external content.

Sending too many complete posts and comments can exceed token-per-minute limits and increase inference cost.

Preventive measures:

- cap the number of content items
- cap comment count per item
- truncate excessively large content
- deduplicate results
- rank/select the most relevant content before inference
- maintain a configurable input-token budget

The current implementation already limits the amount of content passed to the model rather than sending an unbounded amount of scraped data.

### 6.3 External source availability

PullPush and search providers are external dependencies.

If a provider becomes unavailable, the service should degrade gracefully rather than fail completely.

Preventive measures:

- provider abstraction
- fallback providers
- timeouts
- retry policies with exponential backoff
- circuit breakers for repeatedly failing providers
- structured error logging

### 6.4 Search-result quality

Search engines may return pages that are technically relevant to the query but are not useful market evidence.

For example:

    site:linkedin.com healthcare

may return company pages, job listings or generic articles instead of actual discussions.

Preventive measures:

- more targeted queries
- platform-specific filtering
- result deduplication
- relevance filtering before LLM inference
- allowing the LLM to explicitly reject irrelevant content

## 7. Architectural Decisions

The main architectural goal was to prevent external providers from leaking into the rest of the application.

For example, replacing Tavily should only require implementing another `SearchProvider`.

The pipeline should not need to know whether the result came from:

- Tavily
- Brave
- Serper
- a self-hosted search engine
- another future provider

Similarly, platform-specific scrapers convert their source data into `ContentItem[]`.

This allows the LLM layer to operate entirely on normalized content rather than knowing anything about Reddit, LinkedIn or Instagram.

This separation makes adding another platform relatively inexpensive.

For example, adding Instagram required primarily:

1. constructing the platform-specific search query
2. calling the common search service
3. mapping the returned results to `ContentItem`

No changes were required to the LLM processing pipeline.

## 8. Comparison With Percura's Approach

The goal of this implementation was not to reproduce Percura's production infrastructure, but to build the requested context-extraction layer with a similar separation between acquisition, processing and inference.

### Where this implementation is stronger

#### Provider abstraction

The search layer is provider-independent.

This makes it possible to introduce or remove search providers without changing the downstream processing pipeline.

#### Multi-source normalization

Content from different platforms is normalized into a common representation before reaching the LLM.

This makes the inference layer independent of the original platform.

#### Graceful handling of missing information

The LLM is instructed not to fabricate unavailable demographic information.

If life stage or geography cannot be inferred from the source content, it returns `unknown`.

This is preferable than forcing every field to contain a value.

#### Direct platform-specific treatment

Reddit is treated differently from generic web-search results because Reddit provides richer discussion data, including comments and engagement.

### Where this implementation is weaker

#### Search infrastructure

The current search layer depends on commercial APIs.

This is not a genuinely unlimited/free production solution.

A production implementation would need either:

- an appropriately funded search API strategy,
- a self-hosted search stack,
- or another sustainable source of indexed public-web data.

#### External dependency reliability

PullPush and third-party search APIs are outside the application's control.

A production system would need stronger observability, caching and provider health management.

#### Limited search-result context

Search-engine snippets are less informative than complete platform content.

This particularly affects LinkedIn and Instagram, where the application may receive only indexed snippets rather than complete posts and discussion threads.

#### Production-scale infrastructure

This submission focuses on the requested microservice and provider architecture rather than building the entire production infrastructure required for very high request volumes.

## 9. Final Assessment

The current implementation satisfies the core architectural objective of extracting structured market-context signals from multiple public sources, while keeping acquisition providers replaceable.

The main unresolved production concern is the availability and economics of unrestricted web search.

I intentionally did not describe the current Tavily/Brave/Serper configuration as an unlimited/free production solution because their public pricing models do not support that claim.

Instead, the implementation isolates the search layer so that the current providers can be replaced by a more sustainable backend when the service moves beyond the current scale appropriate for a development/assignment deployment.

If this were being taken to production, my next priorities would be:

1. introduce caching.
2. enforce an explicit LLM input budget.
3. add provider health checks and circuit breaking.
4. add structured observability and usage tracking.
5. introduce a sustainable/self-hosted search backend with suitable infrastructure where appropriate.