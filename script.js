document.getElementById("year").textContent = new Date().getFullYear();

window.addEventListener("load", () => {
    setTimeout(() => {
        const intro = document.getElementById("intro-screen");
        const main = document.getElementById("main-content");

        intro.style.opacity = "0";
        setTimeout(() => {
            intro.style.display = "none";
            main.classList.remove("opacity-0");
            main.classList.add("opacity-100");
            initObservers();
        }, 500);
    }, 6000);
});

const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");

if (window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("mousemove", (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate(
            {
                left: `${posX}px`,
                top: `${posY}px`,
            },
            { duration: 300, fill: "forwards" },
        );
    });

    const interactives = document.querySelectorAll(
        ".interactive, a, button, input, textarea",
    );
    interactives.forEach((el) => {
        el.addEventListener("mouseenter", () => {
            document.body.classList.add("cursor-hover");
        });
        el.addEventListener("mouseleave", () => {
            document.body.classList.remove("cursor-hover");
        });
    });
}

function initObservers() {
    const reveals = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                } else {
                    entry.target.classList.remove("active");
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px",
        },
    );

    reveals.forEach((reveal) => {
        revealObserver.observe(reveal);
    });
}

const form = document.getElementById("contactForm");
const callbackCheckbox = document.getElementById("requestCallback");
const phoneContainer = document.getElementById("phoneContainer");
const phoneInput = document.getElementById("phone");
const formFeedback = document.getElementById("formFeedback");

callbackCheckbox.addEventListener("change", (e) => {
    if (e.target.checked) {
        phoneContainer.style.display = "block";
        void phoneContainer.offsetWidth;
        phoneContainer.classList.remove("opacity-0");
        phoneInput.setAttribute("required", "required");
    } else {
        phoneContainer.classList.add("opacity-0");
        phoneInput.removeAttribute("required");
        phoneInput.value = "";

        setTimeout(() => {
            if (!callbackCheckbox.checked) {
                phoneContainer.style.display = "none";
            }
        }, 500);
    }
});

function showMessage(msg, type) {
    formFeedback.textContent = msg;
    formFeedback.className = "mt-6 text-[10px] md:text-xs uppercase tracking-widest-xl text-center py-4 border transition-opacity duration-500 opacity-100";

    if (type === 'success') {
        formFeedback.classList.add('border-gold', 'text-gold', 'bg-[#c5a0590a]');
    } else {
        formFeedback.classList.add('border-red-500', 'text-red-500', 'bg-[#ff00000a]');
    }

    setTimeout(() => {
        formFeedback.classList.replace('opacity-100', 'opacity-0');
        setTimeout(() => {
            formFeedback.classList.add('hidden');
        }, 500);
    }, 5000);
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const submitBtn = form.querySelector(".form-submit");
    submitBtn.innerHTML = "Sending...";

    fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: json,
    })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                showMessage("Request submitted successfully.", "success");
                form.reset();
                phoneContainer.classList.add("opacity-0");
                setTimeout(() => { phoneContainer.style.display = "none"; }, 500);
                phoneInput.removeAttribute("required");
            } else {
                showMessage(json.message || "Failed to submit. Please try again.", "error");
            }
        })
        .catch((error) => {
            showMessage("Something went wrong! Please try again.", "error");
        })
        .finally(function () {
            submitBtn.innerHTML = "Submit";
        });
});

console.log(
    "%c Website built by ApexCause %c https://apexcause.com",
    "color: white; background: #000; padding: 5px 10px; font-weight: bold;",
    "color: #888; background: #f4f4f4; padding: 5px 10px;",
);