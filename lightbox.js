document.addEventListener("DOMContentLoaded", () => {
    const lightboxLinks = document.querySelectorAll('[data-light="lightbox"]');
    const totalImages = lightboxLinks.length; // Total number of images

    lightboxLinks.forEach((link, index) => {
        link.dataset.index = index; // Store the index of each link
        link.addEventListener("click", event => {
            event.preventDefault();
            openLightbox(link);
        });
    });

    function openLightbox(link) {
        const originalImageSrc = link.getAttribute('href');
        const currentIndex = parseInt(link.dataset.index);
        const thumbnailLinks = document.querySelectorAll('[data-light="lightbox"]');

        const thumbnailsHtml = Array.from(thumbnailLinks).map((thumbLink, index) => `
            <img src="${thumbLink.querySelector('img').src}" 
                 data-original="${thumbLink.getAttribute('href')}"
                 class="lightbox-thumbnail ${originalImageSrc === thumbLink.getAttribute('href') ? 'active' : ''}" 
                 data-index="${index}" 
                 draggable="false" />
        `).join('');

        const lightboxHtml = `
            <div id="lightbox-overlay">
                <div id="lightbox">
                    <div id="lightbox-header">
                        <div id="lightbox-image-counter">${currentIndex + 1} / ${totalImages}</div>
                        <div id="lightbox-options"><button id="lightbox-info">info</button>
                        <button id="lightbox-delete">dlt</button>
                        <button id="lightbox-transform">trans</button></div>
                        <button id="close-lightbox">x</button>
                    </div>
                    <div id="lightbox-image-container">
                        <button id="lightbox-prev">&lt;</button>
                        <img id="lightbox-image" src="${originalImageSrc}" alt="Lightbox Image" data-index="${currentIndex}" draggable="false" />
                        <button id="lightbox-next">&gt;</button>
                    </div>
                    <div id="lightbox-options">
                        <div id="lightbox-thumbnails" class="hidden">${thumbnailsHtml}</div>
                        <div id="lightbox-footer">
                            <button id="thumbnail-toggle"><svg width="22" height="19" viewBox="0 0 26 19" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon">
  <path d="M4 1H22C23.1046 1 24 1.89543 24 3V13.6C24 14.7046 23.1046 15.6 22 15.6H4C2.89543 15.6 2 14.7046 2 13.6V3C2 1.89543 2.89543 1 4 1Z
           M1.519958 11.8H24.40 
           M10.5333 11V15 
           M5.33331 11V15 
           M15.7333 11V15
           M20.9333 11V15" 
        stroke="currentColor" 
        stroke-width="2"/>
</svg></button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', lightboxHtml);
        document.body.style.overflow = 'hidden'; // Disable body scroll

        document.getElementById("close-lightbox").addEventListener("click", closeLightbox);
        document.getElementById("lightbox-prev").addEventListener("click", showPreviousImage);
        document.getElementById("lightbox-next").addEventListener("click", showNextImage);
        document.getElementById("thumbnail-toggle").addEventListener("click", toggleThumbnails);

        document.querySelectorAll('.lightbox-thumbnail').forEach(thumb => {
            thumb.addEventListener("click", event => {
                const newSrc = event.target.getAttribute('data-original');
                document.getElementById('lightbox-image').src = newSrc;
                const newIndex = event.target.dataset.index;
                document.getElementById('lightbox-image').dataset.index = newIndex;

                updateImageCounter(newIndex);
                updateActiveThumbnail(newIndex);
            });
        });
    }

    function closeLightbox() {
        const lightboxOverlay = document.getElementById('lightbox-overlay');
        if (lightboxOverlay) {
            lightboxOverlay.remove();
            document.body.style.overflow = ''; // Re-enable body scroll
        }
    }

    function showPreviousImage() {
        const currentImage = document.getElementById('lightbox-image');
        const currentIndex = parseInt(currentImage.dataset.index);
        const thumbnailLinks = document.querySelectorAll('[data-light="lightbox"]');

        let newIndex = currentIndex - 1;
        if (newIndex < 0) newIndex = thumbnailLinks.length - 1;

        const newImageSrc = thumbnailLinks[newIndex].getAttribute('href');
        currentImage.src = newImageSrc;
        currentImage.dataset.index = newIndex;

        updateImageCounter(newIndex);
        updateActiveThumbnail(newIndex);
    }

    function showNextImage() {
        const currentImage = document.getElementById('lightbox-image');
        const currentIndex = parseInt(currentImage.dataset.index);
        const thumbnailLinks = document.querySelectorAll('[data-light="lightbox"]');

        let newIndex = currentIndex + 1;
        if (newIndex >= thumbnailLinks.length) newIndex = 0;

        const newImageSrc = thumbnailLinks[newIndex].getAttribute('href');
        currentImage.src = newImageSrc;
        currentImage.dataset.index = newIndex;

        updateImageCounter(newIndex);
        updateActiveThumbnail(newIndex);
    }

    function updateImageCounter(index) {
        document.getElementById('lightbox-image-counter').textContent = `${parseInt(index) + 1} / ${totalImages}`;
    }

    function updateActiveThumbnail(index) {
        document.querySelectorAll('.lightbox-thumbnail').forEach(thumb => {
            thumb.classList.remove('active');
        });
        document.querySelector(`.lightbox-thumbnail[data-index="${index}"]`).classList.add('active');
    }

    function toggleThumbnails() {
        const thumbnailDiv = document.getElementById('lightbox-thumbnails');
        const imageContainer = document.getElementById('lightbox-image-container');
        const lightbox = document.getElementById('lightbox');

        if (thumbnailDiv.classList.contains('hidden')) {
            thumbnailDiv.classList.remove('hidden');
            thumbnailDiv.style.height = '80px';
            imageContainer.style.height = 'calc(100vh - 160px)'; // Reduce height by 160px to accommodate thumbnails
            lightbox.style.gridTemplateRows = '40px calc(100vh - 160px) 40px'; // Adjust grid rows
        } else {
            thumbnailDiv.classList.add('hidden');
            thumbnailDiv.style.height = '0';
            imageContainer.style.height = 'calc(100vh - 80px)'; // Reduce height by 80px (thumbnails hidden)
            lightbox.style.gridTemplateRows = '40px calc(100vh - 80px) 40px'; // Adjust grid rows
        }
    }
});
