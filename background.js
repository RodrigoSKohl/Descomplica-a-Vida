let lastUrlPartWithAssertions = null;

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    const url = details.url;
    const regex = /assertions-corrections\?(.+)/;
    const match = url.match(regex);

    if (match && match[1]) {
      lastUrlPartWithAssertions = match[1];
    }
  },
  { urls: ["<all_urls>"] },
  ["requestHeaders"]
);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request === "getLastRequestPart") {
    sendResponse({ urlPart: lastUrlPartWithAssertions });
  }
});
