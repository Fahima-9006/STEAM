document.addEventListener("DOMContentLoaded", function () {

    const menuButton = document.getElementById("mobileMenuButton");
    const navigation = document.getElementById("mainNav");

    if (menuButton && navigation) {

        menuButton.addEventListener("click", function () {

            navigation.classList.toggle("active");

            const icon = menuButton.querySelector("i");

            if (navigation.classList.contains("active")) {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");
            } else {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }

        });

    }


    // Close mobile menu after clicking a link

    document.querySelectorAll("#mainNav a").forEach(function (link) {

        link.addEventListener("click", function () {

            if (navigation) {
                navigation.classList.remove("active");
            }

            if (menuButton) {

                const icon = menuButton.querySelector("i");

                if (icon) {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }

            }

        });

    });

});


/* =========================================================
   UNIVERSITY FINDER
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const universityGrid = document.getElementById("universityGrid");
    const universitySearch = document.getElementById("universitySearch");
    const countryFilters = document.querySelectorAll(".filter-button");
    const noResults = document.getElementById("noUniversityResults");
    const loading = document.getElementById("universityLoading");
    const errorBox = document.getElementById("universityError");
    const resultCount = document.getElementById("universityResultCount");
    const clearSearch = document.getElementById("clearUniversitySearch");

    /*
     * If we are not on the Universities page,
     * stop here.
     */
    if (!universityGrid) {
        return;
    }

    let universities = [];
    let selectedCountry = "";


    /* ================= LOAD UNIVERSITIES ================= */

    async function loadUniversities() {

        try {

            loading.style.display = "block";
            errorBox.style.display = "none";
            noResults.style.display = "none";
            universityGrid.innerHTML = "";

            const response = await fetch("/api/universities");

            if (!response.ok) {
                throw new Error("Could not load universities.");
            }

            universities = await response.json();

            loading.style.display = "none";

            displayUniversities();

        } catch (error) {

            console.error("University loading error:", error);

            loading.style.display = "none";
            universityGrid.innerHTML = "";
            errorBox.style.display = "block";

            if (resultCount) {
                resultCount.textContent = "";
            }
        }
    }


    /* ================= DISPLAY UNIVERSITIES ================= */

    function displayUniversities() {

        const searchText = universitySearch
            ? universitySearch.value.trim().toLowerCase()
            : "";

        const filteredUniversities = universities.filter(function (university) {

            const name = String(university.name || "").toLowerCase();
            const country = String(university.country || "").toLowerCase();
            const description = String(university.description || "").toLowerCase();

            const searchMatches =
                !searchText ||
                name.includes(searchText) ||
                country.includes(searchText) ||
                description.includes(searchText);

            const countryMatches =
                !selectedCountry ||
                country.includes(selectedCountry.toLowerCase()) ||
                (
                    selectedCountry.toLowerCase() === "africa" &&
                    [
                        "nigeria",
                        "ghana",
                        "kenya",
                        "south africa",
                        "egypt",
                        "rwanda",
                        "uganda",
                        "tanzania"
                    ].some(function (africanCountry) {
                        return country.includes(africanCountry);
                    })
                );

            return searchMatches && countryMatches;
        });


        /* ================= RESULT COUNT ================= */

        if (resultCount) {

            if (filteredUniversities.length === 1) {
                resultCount.textContent = "1 university found";
            } else {
                resultCount.textContent =
                    filteredUniversities.length + " universities found";
            }
        }


        /* ================= NO RESULTS ================= */

        if (filteredUniversities.length === 0) {

            universityGrid.innerHTML = "";
            noResults.style.display = "block";

            return;
        }

        noResults.style.display = "none";


        /* ================= CREATE CARDS ================= */

        universityGrid.innerHTML = filteredUniversities
            .map(function (university) {

                const name = escapeHtml(university.name || "University");
                const country = escapeHtml(university.country || "Unknown");
                const description = escapeHtml(
                    university.description ||
                    "Explore STEM education opportunities at this university."
                );

                const link = university.link
                    ? escapeAttribute(university.link)
                    : "#";

                return `
                    <article class="card university-card">

                        <div class="card-icon">
                            <i class="fas fa-university"></i>
                        </div>

                        <span class="university-country">
                            <i class="fas fa-location-dot"></i>
                            ${country}
                        </span>

                        <h3>
                            ${name}
                        </h3>

                        <p>
                            ${description}
                        </p>

                        ${
                            university.link
                            ? `
                                <a
                                    href="${link}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="text-link">

                                    Visit University
                                    <i class="fas fa-arrow-right"></i>

                                </a>
                            `
                            : ""
                        }

                    </article>
                `;
            })
            .join("");
    }


    /* ================= COUNTRY FILTER BUTTONS ================= */

    countryFilters.forEach(function (button) {

        button.addEventListener("click", function () {

            countryFilters.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");

            selectedCountry =
                button.getAttribute("data-country") || "";

            displayUniversities();
        });
    });


    /* ================= SEARCH ================= */

    if (universitySearch) {

        universitySearch.addEventListener("input", function () {
            displayUniversities();
        });
    }


    /* ================= CLEAR SEARCH ================= */

    if (clearSearch) {

        clearSearch.addEventListener("click", function () {

            if (universitySearch) {
                universitySearch.value = "";
            }

            selectedCountry = "";

            countryFilters.forEach(function (button) {
                button.classList.remove("active");
            });

            const allButton = document.querySelector(
                '.filter-button[data-country=""]'
            );

            if (allButton) {
                allButton.classList.add("active");
            }

            displayUniversities();
        });
    }


    /* ================= SECURITY HELPERS ================= */

    function escapeHtml(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function escapeAttribute(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }


    /* ================= START ================= */

    loadUniversities();

});
