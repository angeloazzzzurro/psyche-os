export interface SearchResult {
  rank: number
  similarity: number
  type: string
  source: string
  confidence: number
  text: string
}

export interface SearchQuery {
  query: string
  results: SearchResult[]
}

export interface VectorSearchPipeline {
  model: string
  total_documents: number
  vector_db: string
  vector_db_path: string
  embedding_dimensions: number
}

export interface VectorSearchDemo {
  pipeline: VectorSearchPipeline
  searches: SearchQuery[]
}

export const vectorSearchDemo: VectorSearchDemo = {
  pipeline: {
    model: 'all-MiniLM-L6-v2',
    total_documents: 223,
    vector_db: 'ChromaDB',
    vector_db_path: './output/vector-db',
    embedding_dimensions: 384,
  },
  searches: [
    {
      query: 'What are my main creative patterns?',
      results: [
        {
          rank: 1,
          similarity: 0.91,
          type: 'cross_validated_pattern',
          source: 'social-traces',
          confidence: 0.79,
          text: 'Consumption-Production Asymmetry: Visible output remains lower than internal accumulation. Creative pressure builds when intake outpaces external form.',
        },
        {
          rank: 2,
          similarity: 0.88,
          type: 'theme',
          source: 'social-traces',
          confidence: 0.76,
          text: 'Aesthetic Restraint: Public traces prefer atmosphere, reduction, silence, and compressed signals over ornamental excess.',
        },
        {
          rank: 3,
          similarity: 0.84,
          type: 'potential',
          source: 'synthesis',
          confidence: 0.81,
          text: 'Public Studio Practice: A strong potential to translate internal symbolic density into a coherent outward-facing body of work.',
        },
      ],
    },
    {
      query: 'How does body discipline relate to cognition?',
      results: [
        {
          rank: 1,
          similarity: 0.94,
          type: 'cross_validated_pattern',
          source: 'claude-sessions',
          confidence: 0.76,
          text: 'Sovereignty-Body Bridge: Embodied repetition acts as the strongest antidote to cognitive fragmentation and improves execution quality.',
        },
        {
          rank: 2,
          similarity: 0.87,
          type: 'theme',
          source: 'codex-sessions',
          confidence: 0.73,
          text: 'Embodied Discipline: Physical regularity functions as a stabilizer when abstraction, philosophy, and tool-building begin to drift apart.',
        },
        {
          rank: 3,
          similarity: 0.82,
          type: 'potential',
          source: 'synthesis',
          confidence: 0.78,
          text: 'Transfer somatic consistency into one knowledge-work lane, using repetition instead of constant redesign as the primary engine.',
        },
      ],
    },
    {
      query: 'What is the shadow aspect of my personality?',
      results: [
        {
          rank: 1,
          similarity: 0.89,
          type: 'archetype',
          source: 'synthesis',
          confidence: 0.74,
          text: 'Golden Shadow, The Essayist: A public voice capable of turning systems, psyche, and lived experience into lucid long-form thought.',
        },
        {
          rank: 2,
          similarity: 0.86,
          type: 'cross_validated_pattern',
          source: 'codex-sessions',
          confidence: 0.86,
          text: 'Dialogic Externalization: Thinking clarifies through a counterpart voice, suggesting that some unlived material appears first in mediated dialogue.',
        },
        {
          rank: 3,
          similarity: 0.79,
          type: 'theme',
          source: 'claude-sessions',
          confidence: 0.71,
          text: 'Narrative Identity: The self is repeatedly understood as a sequence of chapters, roles, and unrealized integrations rather than a fixed profile.',
        },
      ],
    },
  ],
}
