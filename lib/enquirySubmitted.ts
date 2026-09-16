const STORAGE_KEY = "negi-enquiry-submitted";
const EVENT_NAME = "negi-enquiry-submitted";

export function hasSubmittedEnquiry() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markEnquirySubmitted() {
  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // Ignore private-mode write failures
  }
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function subscribeEnquirySubmitted(onChange: () => void) {
  window.addEventListener(EVENT_NAME, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT_NAME, onChange);
    window.removeEventListener("storage", onChange);
  };
}
