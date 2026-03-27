export const logRAG = (data: {
    query: string
    rewrittenQuery: string
    generatedQueries: string[]
    retrievedDocs: any[]
    rerankedDocs: any[]
    context: string
  }) => {
  
    console.log(" RAG DEBUG START ====================")
  
    console.log(" User Query:", data.query)
  
    console.log(" Rewritten Query:", data.rewrittenQuery)
  
    console.log(" Generated Queries:", data.generatedQueries)
  
    console.log(
      " Retrieved Docs:",
      data.retrievedDocs.map((d) => d.pageContent)
    )
  
    console.log(
      " Reranked Docs:",
      data.rerankedDocs.map((d) => d.pageContent)
    )
  
    console.log(" Final Context:", data.context)
  
    console.log(" RAG DEBUG END ======================")
  }