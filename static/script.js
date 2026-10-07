document.addEventListener("DOMContentLoaded", function () {

    // ================================
    // REGISTER FORM
    // ================================
    const registerForm = document.getElementById("registerForm");
    const registerMessage = document.getElementById("registerMessage");
    const registerSubmitButton = document.getElementById("registerSubmitButton");

    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const fullName = document.getElementById("fullName");
            const email = document.getElementById("email");
            const state = document.getElementById("state");
            const education = document.getElementById("education");

            const selectedInterest = document.querySelector(
                'input[name="interest"]:checked'
            );

            if (!fullName || !email || !state || !education) {
                console.error("Required form fields are missing.");
                return;
            }

            if (!selectedInterest) {
                showRegisterMessage(
                    "Please select at least one STEAM interest.",
                    "error"
                );
                return;
            }

            const data = {
                name: fullName.value.trim(),
                email: email.value.trim(),
                state: state.value.trim(),
                education: education.value.trim(),
                interest: selectedInterest.value
            };

            if (!data.name || !data.email || !data.state || !data.education) {
                showRegisterMessage(
                    "Please complete all required fields.",
                    "error"
                );
                return;
            }

            if (registerSubmitButton) {
                registerSubmitButton.disabled = true;
                registerSubmitButton.textContent = "Submitting...";
            }

            showRegisterMessage("Submitting your registration...", "info");

            try {
                const response = await fetch("/api/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    showRegisterMessage(
                        result.message || "Registration successful! Thank you for joining us.",
                        "success"
                    );

                    registerForm.reset();
                } else {
                    showRegisterMessage(
                        result.message || "Something went wrong. Please try again.",
                        "error"
                    );
                }

            } catch (error) {
                console.error("Registration error:", error);

                showRegisterMessage(
                    "Unable to connect to the server. Please try again.",
                    "error"
                );
            } finally {
                if (registerSubmitButton) {
                    registerSubmitButton.disabled = false;
                    registerSubmitButton.textContent = "Register Now";
                }
            }
        });
    }


    // ================================
    // REGISTER MESSAGE
    // ================================
    function showRegisterMessage(message, type) {
        if (!registerMessage) return;

        registerMessage.textContent = message;
        registerMessage.className = "form-message " + type;
        registerMessage.style.display = "block";
    }


    // ================================
    // CONTACT FORM
    // ================================
    const contactForm = document.getElementById("contactForm");
    const contactMessage = document.getElementById("contactMessage");
    const contactSubmitButton = document.getElementById("contactSubmitButton");

    if (contactForm) {
        contactForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const name = document.getElementById("contactName");
            const email = document.getElementById("contactEmail");
            const subject = document.getElementById("contactSubject");
            const message = document.getElementById("contactText");

            if (!name || !email || !subject || !message) {
                console.error("Contact form fields are missing.");
                return;
            }

            const data = {
                name: name.value.trim(),
                email: email.value.trim(),
                subject: subject.value.trim(),
                message: message.value.trim()
            };

            if (!data.name || !data.email || !data.subject || !data.message) {
                showContactMessage(
                    "Please complete all fields.",
                    "error"
                );
                return;
            }

            if (contactSubmitButton) {
                contactSubmitButton.disabled = true;
                contactSubmitButton.textContent = "Sending...";
            }

            showContactMessage("Sending your message...", "info");

            try {
                const response = await fetch("/api/contact", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    showContactMessage(
                        result.message || "Your message was sent successfully!",
                        "success"
                    );

                    contactForm.reset();
                } else {
                    showContactMessage(
                        result.message || "Something went wrong. Please try again.",
                        "error"
                    );
                }

            } catch (error) {
                console.error("Contact error:", error);

                showContactMessage(
                    "Unable to connect to the server. Please try again.",
                    "error"
                );
            } finally {
                if (contactSubmitButton) {
                    contactSubmitButton.disabled = false;
                    contactSubmitButton.textContent = "Send Message";
                }
            }
        });
    }


    // ================================
    // CONTACT MESSAGE
    // ================================
    function showContactMessage(message, type) {
        if (!contactMessage) return;

        contactMessage.textContent = message;
        contactMessage.className = "form-message " + type;
        contactMessage.style.display = "block";
    }

});