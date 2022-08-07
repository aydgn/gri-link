const form = document.querySelector("[data-form]");
const urlInput = document.querySelector("[data-url-input]");
const submit = document.querySelector("[data-submit]");
const successContainer = document.querySelector("[data-success]");
const CURRRENT_ORIGIN = window.location.origin;

/* Form validtion */
form?.addEventListener("submit", e => {
  if (!(input.validity.valid && input.value.length > 10)) return;

  form.value = ""; // Clear the input
  submit.setAttribute("aria-busy", "true");
});

const params = new URLSearchParams(window.location.search);
const shortID = params.get("success");

if (shortID) {
  const template = document.querySelector("template");
  const success = template.content.cloneNode(true);
  const shortURL = `${CURRRENT_ORIGIN}/${shortID}`;

  success.querySelector("a").href = shortURL;
  success.querySelector("a").innerText = shortURL;
  success.querySelector("[data-url]").setAttribute("data-url", shortID);
  successContainer.appendChild(success);
}

const copy = async e => {
  const text = e.getAttribute("data-url");
  const url = `${window.location.origin}/${text}`;

  await navigator.clipboard.writeText(url);
  e.setAttribute("data-tooltip", "🎉 Copied!");
  setTimeout(() => e.setAttribute("data-tooltip", "Copy to clipboard... again."), 5000);

  if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i)) {
    alert(`The URL ${url} has been copied to your clipboard! You can now share it!`);
  }
};
