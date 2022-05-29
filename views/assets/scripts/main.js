const form = document.querySelector("[data-form]");
const input = document.querySelector("[data-input]");
const submit = document.querySelector("[data-submit]");

input.addEventListener("input", () => {
  /* If the input is valid, enable the submit button */
  // input.validity.valid && input.value.length > 10 ? submit.disabled = false : submit.disabled = true;
});

/* Form validtion */
form.addEventListener("submit", (e) => {
  if (input.validity.valid && input.value.length > 10) {
    console.log("Link:", input.value);
    form.value = ""; // Clear the input
  } else {
    console.log("Form is invalid");
  }
});
