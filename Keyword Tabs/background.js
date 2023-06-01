chrome.omnibox.onInputEntered.addListener(function(text) {
  var keyword = text;
  chrome.storage.local.get('keywords', function(result) {
    var keywords = result.keywords || {};
    var urls = keywords[keyword];
    if (urls && urls.length > 0) {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var currentTabId = tabs[0].id;
        for (var i = 0; i < urls.length; i++) {
          chrome.tabs.create({ url: urls[i] }, function(newTab) {
            if (newTab.id !== currentTabId) {
              chrome.tabs.remove(currentTabId);
            }
          });
        }
      });
    }
  });
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  chrome.storage.local.get('keywords', function(result) {
    var keywords = result.keywords || {};
    for (var keyword in keywords) {
      var urls = keywords[keyword];
      var index = urls.indexOf(removeInfo.url);
      if (index !== -1) {
        urls.splice(index, 1);
        chrome.storage.local.set({ 'keywords': keywords }, function() {
          console.log('Removed URL association for keyword:', keyword);
        });
      }
    }
  });
});
