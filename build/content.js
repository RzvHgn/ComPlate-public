/* global chrome */

const allowedHosts = ["sim.amazon.com", "issues.amazon.com"];
if (!allowedHosts.includes(window.location.hostname)) {
  console.warn("Extension not allowed on this domain.");
  throw new Error("Domain not allowed");
}

// Create the floating bubble (button)
const bubble = document.createElement("button");
bubble.id = "blurbinator-bubble";
bubble.textContent = "Standard Communication";

// Use CSS sizes, no explicit width/height needed here, since your CSS sets padding
bubble.style.position = "fixed";
bubble.style.bottom = "20px";
bubble.style.right = "20px";
bubble.style.zIndex = "10000";
bubble.style.cursor = "grab";
bubble.style.userSelect = "none";

document.body.appendChild(bubble);

// Create the floating window container
const floatingContainer = document.createElement("div");
floatingContainer.id = "floating-blurb-viewer";
floatingContainer.style.display = "none"; // Start hidden
document.body.appendChild(floatingContainer);

// Create iframe inside floating window
const iframe = document.createElement("iframe");
iframe.src = chrome.runtime.getURL("index.html");
iframe.id = "blurbinator-iframe";
floatingContainer.appendChild(iframe);

// Create minimize button
const minimizeButton = document.createElement("button");
minimizeButton.innerText = "−";
minimizeButton.className = "minimize-button";
floatingContainer.appendChild(minimizeButton);

// Toggle window visibility
function toggleFloatingWindow() {
  if (floatingContainer.style.display === "none") {
    floatingContainer.style.display = "flex";
    bubble.style.display = "none";
  } else {
    floatingContainer.style.display = "none";
    bubble.style.display = "block";
  }
}

bubble.addEventListener("click", toggleFloatingWindow);
minimizeButton.addEventListener("click", toggleFloatingWindow);

// Make the bubble draggable
let isDragging = false;
let offsetX, offsetY;

bubble.addEventListener("mousedown", (e) => {
  isDragging = true;
  // Calculate offsets relative to button's position
  const rect = bubble.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;
  document.body.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    // Limit bubble to viewport boundaries (optional)
    let left = e.clientX - offsetX;
    let top = e.clientY - offsetY;
    const maxLeft = window.innerWidth - bubble.offsetWidth;
    const maxTop = window.innerHeight - bubble.offsetHeight;
    if (left < 0) left = 0;
    if (top < 0) top = 0;
    if (left > maxLeft) left = maxLeft;
    if (top > maxTop) top = maxTop;

    bubble.style.left = left + "px";
    bubble.style.top = top + "px";

    // Override fixed bottom/right to absolute positioning for dragging
    bubble.style.bottom = "auto";
    bubble.style.right = "auto";
  }
});

document.addEventListener("mouseup", () => {
  if (isDragging) {
    isDragging = false;
    document.body.style.cursor = "default";
  }
});

// Make floating window resizable from left side
const resizeHandle = document.createElement("div");
resizeHandle.className = "resize-handle";
floatingContainer.appendChild(resizeHandle);

let isResizing = false;
let initialWidth, initialX;

resizeHandle.addEventListener("mousedown", (e) => {
  e.preventDefault();
  isResizing = true;
  initialWidth = floatingContainer.offsetWidth;
  initialX = e.clientX;
  document.body.style.cursor = "ew-resize";
});

document.addEventListener("mousemove", (e) => {
  if (isResizing) {
    const deltaX = initialX - e.clientX;
    const newWidth = initialWidth + deltaX;

    if (newWidth >= 250 && newWidth <= 600) {
      floatingContainer.style.width = newWidth + "px";
    }
  }
});

document.addEventListener("mouseup", () => {
  if (isResizing) {
    isResizing = false;
    document.body.style.cursor = "default";
  }
});

// Listen for messages from the iframe to paste text
window.addEventListener("message", (event) => {
  if (
    event.origin !== window.location.origin &&
    !event.origin.startsWith("chrome-extension://")
  ) {
    return; // Ignore non-extension messages
  }

  const { type, payload } = event.data;

  if (type === "PASTE_BLURB" && payload && typeof payload.text === "string") {
    pasteToFocusedField(payload.text);
  }
});

// Smart Pasting Function
function pasteToFocusedField(text) {
  let active = document.activeElement;

  const isEditable =
    active &&
    (active.tagName === "TEXTAREA" ||
      (active.tagName === "INPUT" &&
        /text|search|email|url|tel|password/.test(active.type)) ||
      active.isContentEditable);

  if (!isEditable) {
    // Fallback to Amazon's main comment box
    const fallback = document.querySelector("#issue-conversation");
    if (fallback) {
      fallback.focus();
      active = fallback;
    }
  }

  if (active) {
    if (active.isContentEditable) {
      active.innerText = text;
    } else {
      active.value = text;
    }

    // Trigger React-like input change event
    const event = new Event("input", { bubbles: true });
    active.dispatchEvent(event);
  } else {
    console.warn("No input field to paste into.");
  }
}
