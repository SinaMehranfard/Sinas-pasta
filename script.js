
/* =========================
   SINA'S PASTA
   JavaScript interactions
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /* 1. Make the plate react to mouse movement */

    const heroArt = document.getElementById("heroArt");
    const plate = document.getElementById("plate");

    if (
        heroArt &&
        plate &&
        !reduceMotion &&
        window.matchMedia("(pointer: fine)").matches
    ) {
        heroArt.addEventListener("pointermove", (event) => {
            const rect = heroArt.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) / rect.width - 0.5;

            const y =
                (event.clientY - rect.top) / rect.height - 0.5;

            plate.style.transform =
                `rotateX(${-y * 12}deg) rotateY(${x * 14}deg)`;
        });

        heroArt.addEventListener("pointerleave", () => {
            plate.style.transform = "";
        });
    }

    /* 2. Reveal sections when they enter the screen */

    const revealElements = document.querySelectorAll(".reveal");

    if (
        "IntersectionObserver" in window &&
        !reduceMotion
    ) {
        const observer = new IntersectionObserver(
            (entries, currentObserver) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        currentObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach((element, index) => {
            element.style.transitionDelay =
                `${(index % 3) * 100}ms`;

            observer.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("visible");
        });
    }

    /* 3. Draw the spaghetti as the page scrolls */

    const road = document.getElementById("spaghettiRoad");
    const trail = document.getElementById("pastaTrail");
    const highlight = document.getElementById("pastaHighlight");

    if (!road || !trail || !highlight) {
        return;
    }

    if (reduceMotion) {
        road.remove();
        return;
    }

    let animationFramePending = false;

    function updateSpaghettiRoad() {
        const pageHeight = Math.max(
            document.documentElement.scrollHeight,
            document.body.scrollHeight
        );

        const viewportHeight = window.innerHeight;

        // Match the decorative SVG to the full page height.
        road.style.height = `${pageHeight}px`;

        // Calculate how far the visitor has scrolled.
        const scrollableDistance = Math.max(
            1,
            pageHeight - viewportHeight
        );

        const progress = Math.min(
            1,
            Math.max(0, window.scrollY / scrollableDistance)
        );

        // Reveal more of the SVG path as the visitor scrolls.
        const offset = 1 - progress;

        trail.style.strokeDashoffset = String(offset);
        highlight.style.strokeDashoffset = String(offset);

        animationFramePending = false;
    }

    function requestRoadUpdate() {
        if (animationFramePending) {
            return;
        }

        animationFramePending = true;
        window.requestAnimationFrame(updateSpaghettiRoad);
    }

    window.addEventListener(
        "scroll",
        requestRoadUpdate,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        requestRoadUpdate
    );

    window.addEventListener(
        "load",
        requestRoadUpdate
    );

    updateSpaghettiRoad();
});
