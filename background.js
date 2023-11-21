//Variavel que fica salvo o Payload das questões
let lastUrlPartWithAssertions = null;

//Funçao de background que captura o ultimo request da URL que retorna o JSON com as questões
chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    const url = details.url;
    const regex = /assertions-corrections\?(.+)/;
    const match = url.match(regex);

    if (match && match[1]) {
      lastUrlPartWithAssertions = match[1];
      // Armazene os dados no armazenamento local
      chrome.storage.local.set({ lastUrlPartWithAssertions: lastUrlPartWithAssertions }, function() {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
      });
    }
  },
  { urls: ["<all_urls>"] },
  ["requestHeaders"]
);
//Funçao de background que recupera o Payload salvo localmente para ficar disponivel na chamada de popup.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request === "getLastRequestPart") {
    // Recupere os dados do armazenamento local
    chrome.storage.local.get(['lastUrlPartWithAssertions'], function(result) {
      sendResponse({ urlPart: result.lastUrlPartWithAssertions });
      // Certifique-se de chamar sendResponse imediatamente dentro deste bloco de callback
    });
    return true; // Manter a porta de mensagem aberta até que a resposta seja enviada
  }
  return false; // Esta função de listener não lidou com a mensagem, então mantenha a porta de mensagem fechada
});