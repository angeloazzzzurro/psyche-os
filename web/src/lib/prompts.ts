import extractionPrompt from '../prompts/extraction.txt?raw'
import synthesisPrompt from '../prompts/synthesis.txt?raw'
import neurodivergencePrompt from '../prompts/neurodivergence.txt?raw'

// PSYCHE/OS canonical prompts

export const EXTRACTION_PROMPT = extractionPrompt.trim()
export const SYNTHESIS_PROMPT = synthesisPrompt.trim()
export const NEURODIVERGENCE_PROMPT = neurodivergencePrompt.trim()

export const CLAUDE_CODE_CMD = `claude -p "$(cat <<'PROMPT'
Read all .jsonl session transcripts in ~/.claude/projects/ recursively.
${EXTRACTION_PROMPT}
Save the output to ./sources/claude/extraction.json
PROMPT
)"
`

export const CODEX_CMD = `codex -p "$(cat <<'PROMPT'
Read all session files in ~/Library/Application\\ Support/codex-cli/ recursively.
${EXTRACTION_PROMPT}
Save the output to ./sources/codex/extraction.json
PROMPT
)"
`

export const SIFTLY_SETUP_CMD = `# One-command Siftly setup + extraction
if [ ! -d "./vendor/siftly" ]; then
  git clone https://github.com/viperrcrypto/Siftly ./vendor/siftly
  cd ./vendor/siftly && npm install && cd ../..
fi
cd ./vendor/siftly && npm run export && cd ../..
cp ./vendor/siftly/output/*.json ./sources/twitter/
`

export const GOOGLE_TAKEOUT_INSTRUCTIONS = `1. Go to takeout.google.com
2. Select: Chrome History, YouTube (Watch History, Subscriptions), Google Maps (Location History)
3. Export and download the archive
4. Extract and copy files:

   cp Takeout/Chrome/BrowserHistory.json ./sources/google/
   cp Takeout/YouTube\\ and\\ YouTube\\ Music/history/*.json ./sources/youtube/
   cp Takeout/Location\\ History/*.json ./sources/google/
`

export const VECTOR_EMBED_CMD = `# Create vector embeddings for semantic search
# Requires Python + pip
pip install chromadb sentence-transformers
python3 -c "
from chromadb import Client
from sentence_transformers import SentenceTransformer
import json, glob, os

model = SentenceTransformer('all-MiniLM-L6-v2')
client = Client(Settings(persist_directory='./vector-db'))
col = client.get_or_create_collection('psyche-os')

for f in glob.glob('./output/*.json'):
    data = json.load(open(f))
    texts, ids, metas = [], [], []
    for e in data.get('entities', []):
        texts.append(f\\"{e['name']}: {e['significance']}\\")
        ids.append(f\\"entity-{e['name'].lower().replace(' ','-')}\\")
        metas.append({'type':'entity','source':data.get('source','')})
    for t in data.get('themes', []):
        texts.append(f\\"{t['label']}: {', '.join(t['keywords'])}\\")
        ids.append(f\\"theme-{t['label'].lower().replace(' ','-')}\\")
        metas.append({'type':'theme','dimension':t.get('dimension','')})
    if texts:
        embeddings = model.encode(texts).tolist()
        col.add(embeddings=embeddings, documents=texts, ids=ids, metadatas=metas)
print(f"Indexed {len(col.get()['ids'])} items to ./vector-db/")
"
`

export default VECTOR_EMBED_CMD

export const CLOUD_AI_PROMPT = `Give this prompt directly to Claude.ai, ChatGPT, or Gemini in a conversation where you have significant history:

---

${EXTRACTION_PROMPT}

---

Then save the JSON output to ./sources/<platform>/extraction.json
`
