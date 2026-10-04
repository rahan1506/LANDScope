import { LegalKnowledgeService } from "./legalKnowledgeService";
import { getLLMProvider } from "./llmProvider";

export interface DocumentChunk {
  chunkId: string;
  documentTitle: string;
  sectionNumber: string;
  content: string;
  sourceUrl?: string;
  citation: string;
  similarityScore?: number;
}

export interface RagQueryResponse {
  question: string;
  answer: string;
  retrievedChunks: DocumentChunk[];
  sourceCitations: string[];
  modelUsed: string;
  confidence: number;
}

export class RagService {
  /**
   * Chunks legal text documents into semantically coherent segments.
   */
  static chunkDocument(docTitle: string, fullText: string, chunkSize: number = 300): DocumentChunk[] {
    const paragraphs = fullText.split("\n\n").filter((p) => p.trim().length > 0);
    return paragraphs.map((para, idx) => ({
      chunkId: `chk-${Date.now()}-${idx}`,
      documentTitle: docTitle,
      sectionNumber: `Para ${idx + 1}`,
      content: para.trim(),
      citation: `${docTitle}, ${idx + 1}`,
    }));
  }

  /**
   * Retrieves relevant legal chunks matching the user query from the sovereign knowledge corpus.
   */
  static retrieve(query: string, topK: number = 3): DocumentChunk[] {
    const terms = query.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    const searchResults = LegalKnowledgeService.searchLegalCorpus(query);

    const candidates: DocumentChunk[] = [];

    for (const sec of searchResults.sections) {
      let score = 0.5;
      for (const t of terms) {
        if (sec.summary.toLowerCase().includes(t)) score += 0.2;
        if (sec.title.toLowerCase().includes(t)) score += 0.3;
      }
      candidates.push({
        chunkId: `sec-${sec.id}`,
        documentTitle: sec.title,
        sectionNumber: sec.sectionNumber,
        content: sec.summary,
        citation: `${sec.sectionNumber} (${sec.title})`,
        similarityScore: Math.min(0.98, score),
      });
    }

    for (const conflict of searchResults.conflicts) {
      candidates.push({
        chunkId: `conf-${conflict.id}`,
        documentTitle: `Conflict: ${conflict.frameworkA} vs ${conflict.frameworkB}`,
        sectionNumber: "Judicial Precedent",
        content: `${conflict.conflictDescription} Evidence: ${conflict.evidence}`,
        citation: conflict.citation,
        similarityScore: 0.95,
      });
    }

    candidates.sort((a, b) => (b.similarityScore || 0) - (a.similarityScore || 0));
    return candidates.slice(0, topK);
  }

  /**
   * Generates a cited answer answering strictly from the retrieved evidence.
   */
  static async askLegalQuestion(question: string): Promise<RagQueryResponse> {
    const chunks = this.retrieve(question, 3);
    const llm = getLLMProvider();

    if (chunks.length === 0) {
      return {
        question,
        answer: "Unable to verify source. No matching statutory provisions or judicial precedents found in the sovereign legal knowledge base.",
        retrievedChunks: [],
        sourceCitations: ["Unable to verify source."],
        modelUsed: llm.providerName,
        confidence: 0.0,
      };
    }

    const contextText = chunks.map((c) => `[Source: ${c.citation}]\n${c.content}`).join("\n\n");
    const answer = await llm.generateAnswer(question, contextText);

    return {
      question,
      answer,
      retrievedChunks: chunks,
      sourceCitations: chunks.map((c) => c.citation),
      modelUsed: llm.providerName,
      confidence: 0.95,
    };
  }
}
