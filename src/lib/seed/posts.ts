import type { PostContent } from "@/models/Post";

interface SeedPost {
  title: string;
  description: string;
  slug: string;
  date: string;
  published: boolean;
  content: PostContent;
}

export const SEED_POSTS: SeedPost[] = [
  {
    title: "Building a Hybrid, Fast-Booting Sentiment & Emotion API",
    description:
      "How I built a resilient text-analysis microservice using FastAPI, background model bootstrapping, and a multi-model architecture.",
    slug: "hybrid-sentiment-emotion-api",
    date: "2026-04-01",
    published: true,
    content: {
      intro:
        "When building deepsocial's backend, we needed a text-analysis system capable of detecting hybrid sentiment and specific emotions (ANGER, JOY, FEAR, etc.) from complex social media text. The challenge wasn't just prediction accuracy. It was designing a service that boots up instantly, securely loads multi-gigabyte ML models in the background, and seamlessly handles concurrent batch processing without dropping requests.",
      sections: [
        {
          heading: "1. Background Model Bootstrapping",
          description:
            "Heavy ML models shouldn't block network binding. We load MARBERT, XLM-RoBERTa, and custom emotion models via a background daemon thread. This allows Uvicorn to bind to its port immediately, ensuring Kubernetes liveness probes pass while the models are downloaded or mounted from persistent volumes.",
          codeSnippet: `@app.on_event("startup")
def startup_event():
    # Start bootstrap in background so the server binds to PORT immediately.
    if FASTAPI_ENV == "production":
        t = threading.Thread(target=bootstrap_models_background, daemon=True)
        t.start()`,
          codeLanguage: "python",
        },
        {
          heading: "2. Lazy-Loaded Predictors",
          description:
            "We avoid importing fragile and heavy AI model code at the global module level. Predictor functions are imported and cached dynamically. If an import fails, it won't prevent the server from binding to the port.",
          codeSnippet: `_predictor_fn = None

def get_predictor():
    global _predictor_fn
    if _predictor_fn is None:
        from core.predictor import predict_comment_full as fn
        _predictor_fn = fn
    return _predictor_fn`,
          codeLanguage: "python",
        },
        {
          heading: "3. Robust Preprocessing & Early Discard",
          description:
            "Social media data is noisy. The API strips out URLs, mentions, and hashtags on the fly. More importantly, it uses Regex constraints to swiftly discard gibberish before wasting valuable CPU/GPU cycles on model inference.",
          codeSnippet: `def preprocess_comment(text: str) -> str:
    text = re.sub(r"http\\S+|www\\S+", "", text)
    text = re.sub(r"@\\w+", "", text)
    text = re.sub(r"#\\w+", "", text)
    # Swift regex evaluation to discard zero-meaning inputs
    return text.strip()`,
          codeLanguage: "python",
        },
        {
          heading: "4. Batch Processing for Speed",
          description:
            "A dedicated /predict_batch endpoint is optimized for analyzing massive arrays of comments simultaneously, preventing network I/O bottlenecks and ensuring optimized inference iteration.",
        },
      ],
      lessonsLearned: [
        "Background bootstrapping is vital for resilient deployments with large artifacts.",
        "FastAPI's startup events combined with threading unlock non-blocking initializations.",
        "Regex-based early-discard saves massive compute resources in production.",
        "Lazy loading prevents deep-level dependency issues from taking down the API layer.",
      ],
      techStack: ["Python", "FastAPI", "Pydantic", "MARBERT", "XLM-RoBERTa", "Uvicorn"],
      performanceMetrics: [
        "Instant API startup (Non-blocking network binding)",
        "Zero-downtime model mounting via background sync",
        "High-throughput batch handling",
      ],
    },
  },
];
