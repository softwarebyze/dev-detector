import { Storage } from "@plasmohq/storage"

const storage = new Storage()

// Initialize the enabled state
chrome.runtime.onInstalled.addListener(async () => {
  await storage.set("enabled", true)
})

// Handle icon clicks
chrome.action.onClicked.addListener(async () => {
  const enabled = await storage.get("enabled")
  const newState = !enabled
  await storage.set("enabled", newState)
})
