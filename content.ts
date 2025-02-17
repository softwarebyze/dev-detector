import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["http://localhost:*/*", "https://localhost:*/*"],
  all_frames: true,
  run_at: "document_start"
}

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
      pointer-events: none;
      user-select: none;
      border-bottom-left-radius: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 8px;
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
}

// Initial creation
createBanner()
