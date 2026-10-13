
const form = document.getElementById("form");
const success = document.getElementById("success");
const submit = document.getElementById("submit");

function getError(field) {
    if (field.id === "agreement")
        return field.closest(".agreement").querySelector("small");

    return field.closest(".password")
        ? field.closest(".password").parentElement.querySelector("small")
        : field.parentElement.querySelector("small");
}

function validateField(field) {
    const rule = field.dataset.validate;
    const error = getError(field);
    const value = field.value;
    let message = "";

    if (rule === "required" && !value.trim())
        message = field.dataset.error;

    if (rule === "email" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        message = field.dataset.error;

    if (rule === "phone" &&
        !/^(09\d{9}|\+639\d{9})$/.test(value))
        message = field.dataset.error;

    if (rule === "dob") {
        const date = new Date(value + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!value || Number.isNaN(date.getTime()) || date > today)
            message = field.dataset.error;
    }

    if (rule === "password" && value.length < 8)
        message = field.dataset.error;

    if (rule === "confirm" &&
        (!value || value !== document.getElementById("password").value))
        message = field.dataset.error;

    if (rule === "agreement" && !field.checked)
        message = "You must agree before registering.";

    field.classList.toggle("error", !!message);
    error.textContent = message;
    error.classList.toggle("show", !!message);

    return !message;
}

form.addEventListener("input", handleChange);
form.addEventListener("change", handleChange);

function handleChange(event) {
    const field = event.target;

    if (field.dataset.validate)
        validateField(field);

    if (
        field.id === "password" &&
        document.getElementById("confirm").value
    ) {
        validateField(document.getElementById("confirm"));
    }

    success.hidden = true;
    submit.textContent = submit.dataset.default;
    submit.classList.remove("submitted");
    submit.setAttribute("aria-label", "Register");
}

form.addEventListener("blur", function(event) {
    const field = event.target;

    if (field.id === "studentId") {
        field.value = field.value.trim();
        validateField(field);
    }

    if (
        field.id === "fullName" ||
        field.id === "email" ||
        field.id === "address"
    ) {
        field.value = field.value.replace(/\s+/g, " ");
        validateField(field);
    }
}, true);

document.querySelectorAll(".toggle").forEach(button => {
    button.addEventListener("click", () => {
        const field = document.getElementById(button.dataset.target);
        const showing = field.type === "password";

        field.setAttribute("type", showing ? "text" : "password");
        button.textContent = showing ? "Hide" : "Show";
        button.classList.toggle("active", showing);
        button.setAttribute("aria-pressed", String(showing));
        button.setAttribute(
            "aria-label",
            showing ? "Hide password" : "Show password"
        );
    });
});

form.addEventListener("submit", event => {
    event.preventDefault();

    const studentId = document.getElementById("studentId");
    studentId.value = studentId.value.trim();

    ["fullName", "email", "address"].forEach(id => {
        const field = document.getElementById(id);
        field.value = field.value.replace(/\s+/g, " ");
    });

    const fields = [...form.querySelectorAll("[data-validate]")];
    const valid = fields.map(validateField).every(Boolean);

    success.hidden = true;

    if (valid) {
        success.hidden = false;
        submit.textContent = "Registration Successful!";
        submit.classList.add("submitted");
        submit.setAttribute("aria-label", "Registration successful");
    } else {
        submit.textContent = "Check Your Information";

        const firstError = form.querySelector(".error");

        if (firstError) {
            firstError.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            if (firstError.matches("input, select, textarea"))
                firstError.focus({ preventScroll: true });
        }
    }
});

form.addEventListener("reset", () => {
    setTimeout(() => {
        form.querySelectorAll("[data-validate]").forEach(field => {
            field.classList.remove("error");

            const error = getError(field);
            error.textContent = "";
            error.classList.remove("show");
        });

        document.querySelectorAll(".toggle").forEach(button => {
            document.getElementById(button.dataset.target)
                .setAttribute("type", "password");

            button.textContent = "Show";
            button.classList.remove("active");
            button.setAttribute("aria-pressed", "false");
            button.setAttribute("aria-label", "Show password");
        });

        success.hidden = true;
        submit.textContent = submit.dataset.default;
        submit.classList.remove("submitted");
        submit.setAttribute("aria-label", "Register");
    }, 0);
});
