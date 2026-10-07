/* =========================================================
   STEAM LOCATOR NIGERIA
   COMPLETE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       REGISTRATION FORM
       ===================================================== */

    const registerForm = document.getElementById("registerForm");
    const registerMessage = document.getElementById("registerMessage");
    const registerSubmitButton = document.getElementById("registerSubmitButton");

    if (registerForm) {

        registerForm.addEventListener("submit", async function (event) {

            // Prevent page reload
            event.preventDefault();

            /* ---------------------------------------------
               Get form fields
            --------------------------------------------- */

            const fullName = document.getElementById("fullName");
            const email = document.getElementById("email");
            const state = document.getElementById("state");
            const education = document.getElementById("education");

            const selectedInterest = document.querySelector(
                'input[name="interest"]:checked'
            );


            /* ---------------------------------------------
               Check that fields exist
            --------------------------------------------- */

            if (
                !fullName ||
                !email ||
                !state ||
                !education
            ) {
                showRegisterMessage(
                    "There is a problem with the registration form. Please refresh the page and try again.",
                    "error"
                );

                return;
            }


            /* ---------------------------------------------
               Check STEAM interest
            --------------------------------------------- */

            if (!selectedInterest) {

                showRegisterMessage(
                    "Please select at least one STEAM interest.",
                    "error"
                );

                return;
            }


            /* ---------------------------------------------
               Collect form data
            --------------------------------------------- */

            const data = {
                name: fullName.value.trim(),
                email: email.value.trim(),
                state: state.value.trim(),
                education: education.value.trim(),
                interest: selectedInterest.value
            };


            /* ---------------------------------------------
               Validate required fields
            --------------------------------------------- */

            if (
                !data.name ||
                !data.email ||
                !data.state ||
                !data.education ||
                !data.interest
            ) {

                showRegisterMessage(
                    "Please complete all required fields.",
                    "error"
                );

                return;
            }


            /* ---------------------------------------------
               Basic email validation
            --------------------------------------------- */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(data.email)) {

                showRegisterMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                return;
            }


            /* ---------------------------------------------
               Disable button while submitting
            --------------------------------------------- */

            if (registerSubmitButton) {

                registerSubmitButton.disabled = true;

                registerSubmitButton.innerHTML = `
                    <span>Submitting...</span>
                    <i class="fas fa-spinner fa-spin"></i>
                `;
            }


            /* ---------------------------------------------
               Show submitting message
            --------------------------------------------- */

            showRegisterMessage(
                "Submitting your registration...",
                "info"
            );


            /* ---------------------------------------------
               Send data to Flask
            --------------------------------------------- */

            try {

                const response = await fetch("/api/register", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(data)

                });


                /* -----------------------------------------
                   Safely read server response
                ----------------------------------------- */

                let result;

                try {

                    result = await response.json();

                } catch (jsonError) {

                    result = {
                        success: false,
                        message:
                            "The server returned an unexpected response."
                    };
                }


                /* -----------------------------------------
                   Successful registration
                ----------------------------------------- */

                if (response.ok && result.success) {

                    /*
                     * If your Flask backend sends an email,
                     * it can return:
                     *
                     * email_sent: true
                     *
                     * Then we show the email confirmation.
                     */

                    if (result.email_sent === true) {

                        showRegisterMessage(
                            "You successfully registered through the website! A confirmation email has also been sent to your email address.",
                            "success"
                        );

                    } else {

                        showRegisterMessage(
                            result.message ||
                            "You successfully registered through the website! Your registration has been saved successfully.",
                            "success"
                        );
                    }


                    /* -------------------------------------
                       Clear form after successful submit
                    ------------------------------------- */

                    registerForm.reset();


                    /* -------------------------------------
                       Scroll to success message
                    ------------------------------------- */

                    if (registerMessage) {

                        registerMessage.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });
                    }

                } else {

                    /* -------------------------------------
                       Registration failed
                    ------------------------------------- */

                    showRegisterMessage(
                        result.message ||
                        "Registration could not be completed. Please try again.",
                        "error"
                    );
                }

            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );

                showRegisterMessage(
                    "Unable to connect to the server. Please make sure the Flask server is running and try again.",
                    "error"
                );

            } finally {

                /* -----------------------------------------
                   Restore button
                ----------------------------------------- */

                if (registerSubmitButton) {

                    registerSubmitButton.disabled = false;

                    registerSubmitButton.innerHTML = `
                        <span>Join STEAM Locator</span>
                        <i class="fas fa-arrow-right"></i>
                    `;
                }
            }

        });
    }


    /* =====================================================
       REGISTRATION MESSAGE FUNCTION
       ===================================================== */

    function showRegisterMessage(message, type) {

        if (!registerMessage) {
            return;
        }

        registerMessage.textContent = message;

        registerMessage.className =
            "form-message " + type;

        registerMessage.style.display = "block";
    }


    /* =====================================================
       CONTACT FORM
       ===================================================== */

    const contactForm =
        document.getElementById("contactForm");

    const contactMessage =
        document.getElementById("contactMessage");

    const contactSubmitButton =
        document.getElementById("contactSubmitButton");


    if (contactForm) {

        contactForm.addEventListener("submit", async function (event) {

            // Prevent page reload
            event.preventDefault();


            /* ---------------------------------------------
               Get fields
            --------------------------------------------- */

            const name =
                document.getElementById("contactName");

            const email =
                document.getElementById("contactEmail");

            const subject =
                document.getElementById("contactSubject");

            const message =
                document.getElementById("contactText");


            /* ---------------------------------------------
               Check fields
            --------------------------------------------- */

            if (
                !name ||
                !email ||
                !subject ||
                !message
            ) {

                showContactMessage(
                    "There is a problem with the contact form. Please refresh the page and try again.",
                    "error"
                );

                return;
            }


            /* ---------------------------------------------
               Collect data
            --------------------------------------------- */

            const data = {

                name: name.value.trim(),

                email: email.value.trim(),

                subject: subject.value.trim(),

                message: message.value.trim()

            };


            /* ---------------------------------------------
               Validate fields
            --------------------------------------------- */

            if (
                !data.name ||
                !data.email ||
                !data.subject ||
                !data.message
            ) {

                showContactMessage(
                    "Please complete all fields.",
                    "error"
                );

                return;
            }


            /* ---------------------------------------------
               Email validation
            --------------------------------------------- */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(data.email)) {

                showContactMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                return;
            }


            /* ---------------------------------------------
               Disable button
            --------------------------------------------- */

            if (contactSubmitButton) {

                contactSubmitButton.disabled = true;

                contactSubmitButton.innerHTML = `
                    <span>Sending...</span>
                    <i class="fas fa-spinner fa-spin"></i>
                `;
            }


            /* ---------------------------------------------
               Show sending message
            --------------------------------------------- */

            showContactMessage(
                "Sending your message...",
                "info"
            );


            /* ---------------------------------------------
               Send to Flask
            --------------------------------------------- */

            try {

                const response = await fetch(
                    "/api/contact",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(data)
                    }
                );


                /* -----------------------------------------
                   Read response
                ----------------------------------------- */

                let result;

                try {

                    result = await response.json();

                } catch (jsonError) {

                    result = {
                        success: false,
                        message:
                            "The server returned an unexpected response."
                    };
                }


                /* -----------------------------------------
                   Success
                ----------------------------------------- */

                if (
                    response.ok &&
                    result.success
                ) {

                    showContactMessage(
                        result.message ||
                        "Your message was sent successfully!",
                        "success"
                    );

                    contactForm.reset();


                    if (contactMessage) {

                        contactMessage.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });
                    }

                } else {

                    showContactMessage(
                        result.message ||
                        "Something went wrong. Please try again.",
                        "error"
                    );
                }

            } catch (error) {

                console.error(
                    "Contact error:",
                    error
                );

                showContactMessage(
                    "Unable to connect to the server. Please make sure the Flask server is running and try again.",
                    "error"
                );

            } finally {

                /* -----------------------------------------
                   Restore contact button
                ----------------------------------------- */

                if (contactSubmitButton) {

                    contactSubmitButton.disabled = false;

                    contactSubmitButton.innerHTML = `
                        <span>Send Message</span>
                        <i class="fas fa-paper-plane"></i>
                    `;
                }
            }

        });
    }


    /* =====================================================
       CONTACT MESSAGE FUNCTION
       ===================================================== */

    function showContactMessage(message, type) {

        if (!contactMessage) {
            return;
        }

        contactMessage.textContent = message;

        contactMessage.className =
            "form-message " + type;

        contactMessage.style.display = "block";
    }


    /* =====================================================
       MOBILE NAVIGATION
       ===================================================== */

    const menuToggle =
        document.querySelector(".menu-toggle");

    const navLinks =
        document.querySelector(".nav-links");


    if (menuToggle && navLinks) {

        menuToggle.addEventListener(
            "click",
            function () {

                navLinks.classList.toggle("show");

            }
        );


        /* Close menu after clicking a link */

        const links =
            navLinks.querySelectorAll("a");

        links.forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    navLinks.classList.remove("show");

                }
            );

        });
    }

});