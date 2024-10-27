const IsRelevant=(prompt, editorial)=> {
    const tokenizer = new natural.WordTokenizer();
    
    const editorialTokens = tokenizer.tokenize(editorial.toLowerCase());
    const promptTokens = tokenizer.tokenize(prompt.toLowerCase());
  
    const editorialBagOfWords = new natural.TfIdf();
    editorialBagOfWords.addDocument(editorialTokens.join(' '));
  
    const promptBagOfWords = new natural.TfIdf();
    promptBagOfWords.addDocument(promptTokens.join(' '));
  
    let similarity = 0;
    editorialBagOfWords.tfidfs(promptTokens.join(' '), (i, measure) => {
      similarity = measure;
    });
  
    // Similarity threshold: You can adjust this value based on testing
    return similarity > 0.1;
  }

  module.exports = {
    IsRelevant
  };
  