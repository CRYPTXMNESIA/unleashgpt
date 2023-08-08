const imgNames = document.querySelectorAll(".img-name");
const imgPreviewContainer = document.querySelector(".img-preview-container");
const imgViewContainer = document.querySelector(".img-modal .img-view");
const closeBtn = document.querySelector(".close-btn");
const modalName = document.querySelector(".modal-name");
const tl = gsap.timeline({ paused: true });
const modalText = document.querySelector("#modal-text");

document.addEventListener('mouseup', function () {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const highlightOverlay = document.createElement('div');
    highlightOverlay.className = 'highlight-overlay';
    highlightOverlay.style.left = rect.left + window.pageXOffset + 'px';
    highlightOverlay.style.top = rect.top + window.pageYOffset + 'px';
    highlightOverlay.style.width = rect.width + 'px';
    highlightOverlay.style.height = rect.height + 'px';
    document.body.appendChild(highlightOverlay);
    setTimeout(() => {
      document.body.removeChild(highlightOverlay);
    }, 500); // Duration of the highlight effect
  });

  imgNames.forEach((imgName) => {
    // Commenting out or removing the mouseover event listener
    // imgName.addEventListener("mouseover", () => {
    //     const dataImg = imgName.getAttribute("data-img");
    //     imgPreviewContainer.innerHTML = `
    //     <div class="logo-container">
    //         <img src="./assets/logo3.png" alt="" />
    //         <img src="./assets/logo3.png" class="top-logo" alt="" />
    //     </div>
    //     `;
    // });

    imgName.addEventListener("click", () => {
        const dataImg = imgName.getAttribute("data-img");
        const specificText = imgName.getAttribute("data-text");
        imgViewContainer.innerHTML = `
        <div class="logo-container">
            <img src="./assets/logo3.png" alt="" />
            <img src="./assets/logo3.png" class="top-logo" alt="" />
        </div>
        `;
        modalText.value = specificText;  // Update the textarea
        tl.reversed(!tl.reversed());
    });
});

modalText.addEventListener("click", function() {
    // Highlight the content of the textarea
    modalText.select();

    // Copy the highlighted content to the clipboard
    navigator.clipboard.writeText(modalText.value).then(function() {
        console.log('Text successfully copied to clipboard!');
    }, function(err) {
        console.error('Could not copy text: ', err);
    });
});

closeBtn.onclick = function () {
    tl.reversed(!tl.reversed());
};

function revealImg() {
    tl.to(".img-names .name", 1, {
        top: "30px",
        ease: "power4.inOut",
    });

    tl.to(".img-preview-container",
        1,
        {
            clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
            y: 25,
            ease: "power4.inOut",
        },
        "<"
    );

    tl.to(".img-modal", 0.005, {
        opacity: 1,
        ease: "none",
        pointerEvents: "auto",
        delay: -0.125,
    });

    tl.to(
        ".img-view", 1,
        {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            y: 25,
            ease: "power4.inOut",
        },
        "<"
    );

    tl.to(
        ".close-btn .btn", 
        1,
        {
            top: "0",
            ease: "power4.inOut",
        },
        "<"
    );

    tl.to(
        "#modal-text",  // Target the #modal-text textarea
        1,
        {
            opacity: 1,  // Fade in the textarea
            ease: "power4.inOut",
        },
        "<"
    ).reverse();
}

revealImg();