const form = document.querySelector("[data-form]");
const urlInput = document.querySelector("[data-url-input]");
const submit = document.querySelector("[data-submit]");
const success = document.querySelector("[data-success]");

/* Form validtion */
form?.addEventListener("submit", (e) => {
 if (!(input.validity.valid && input.value.length > 10)) return

    form.value = ""; // Clear the input
    submit.setAttribute("aria-busy", "true")
});

const params = new URLSearchParams(window.location.search);
const shortID = params.get("success");

