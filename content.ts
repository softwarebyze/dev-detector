import type { PlasmoCSConfig } from "plasmo"

import { Storage } from "@plasmohq/storage"

export const config: PlasmoCSConfig = {
  matches: ["http://localhost/*", "https://localhost/*"],
  all_frames: true,
  run_at: "document_start"
}

const storage = new Storage()

// Create and inject the banner component
const createBanner = () => {
  // Remove any existing banners first
  const existingBanners = document.querySelectorAll(".dev-mode-banner")
  existingBanners.forEach((banner) => banner.remove())

  // Remove any existing styles
  const existingStyles = document.querySelectorAll(
    "style[data-dev-mode-banner]"
  )
  existingStyles.forEach((style) => style.remove())

  const banner = document.createElement("div")
  banner.className = "dev-mode-banner"
  banner.textContent = `Dev Mode${window.location.port ? `:${window.location.port}` : ""}`

  // Add styles
  const style = document.createElement("style")
  style.setAttribute("data-dev-mode-banner", "true")
  style.textContent = `
    .dev-mode-banner {
      position: fixed;
      top: 0;
      right: 0;
      z-index: 999999;
      background: #dc2626;
      color: white;
      padding: 8px 24px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      user-select: none;
      border-bottom-left-radius: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 8px;
      opacity: 1;
      transition: opacity 0.2s ease-in-out;
      pointer-events: auto;
    }
    
    .dev-mode-banner::after {
      content: '';
      display: block;
      width: 8px;
      height: 8px;
      background: white;
      border-radius: 50%;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }
  `

  // Ensure we have both head and body before injecting
  const tryInject = () => {
    if (document.head && document.body) {
      document.head.appendChild(style)
      document.body.appendChild(banner)
      console.log("[DEV-DETECTOR] Banner injected!")
    }
  }

  // Try immediately
  tryInject()

  // Also try when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tryInject)
  }

  let boundingBox = banner.getBoundingClientRect()
  // if mouse is within bounding box, remove banner
  document.addEventListener("mousemove", (e) => {
    boundingBox = banner.getBoundingClientRect()
    if (
      e.clientX > boundingBox.left &&
      e.clientX < boundingBox.right &&
      e.clientY > boundingBox.top &&
      e.clientY < boundingBox.bottom
    ) {
      banner.style.opacity = "0"
      banner.style.pointerEvents = "none"
    } else {
      banner.style.opacity = "1"
      banner.style.pointerEvents = "auto"
    }
  })
}

const removeBanner = () => {
  const existingBanners = document.querySelectorAll(".dev-mode-banner")
  existingBanners.forEach((banner) => banner.remove())
  const existingStyles = document.querySelectorAll(
    "style[data-dev-mode-banner]"
  )
  existingStyles.forEach((style) => style.remove())
}

// Handle messages from background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "toggleState") {
    if (message.enabled) {
      createBanner()
    } else {
      removeBanner()
    }
  }
})

// Check if enabled before creating banner
const init = async () => {
  const enabled = await storage.get("enabled")
  if (enabled) {
    createBanner()
  }
}

// Initial creation
init()
