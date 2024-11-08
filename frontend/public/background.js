// background.js

// Event listener for when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed successfully!");
  chrome.storage.sync.set({ isFirstRun: true }, () => {
    console.log("Default settings have been set.");
  });
});

// Event listener for when the browser action is clicked
chrome.action.onClicked.addListener((tab) => {
  console.log("Browser action clicked!");
  chrome.tabs.create({ url: "https://www.example.com" });
});

// Example of using a message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "hello") {
    console.log("Received hello message!");
    sendResponse({ message: "Hello from background!" });
  }
});
