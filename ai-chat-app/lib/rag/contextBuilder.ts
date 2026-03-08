export const buildContext = (docs: any[], maxTokens: number= 1200) => {

    let totalTokens = 0;
    const selectedDocs = [];
    for(const doc of docs) {
        const docTokens = doc.pageContent.length/4;
        if(totalTokens + docTokens > maxTokens) {
            break;
        } else {
            selectedDocs.push(doc);
            totalTokens += docTokens;
        }
    }
return selectedDocs.map(doc => doc.pageContent).join("\n\n");
}