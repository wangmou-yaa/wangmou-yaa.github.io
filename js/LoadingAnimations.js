// Don't know what to do with this javascript class? Please visit 'https://github.com/wangmou-yaa/LoadingAnimations.js' for more info. (OR in 'https://gitee.com/wangmou-yaa/LoadingAnimations.js')

class LoadingAnimations {
    constructor(options = {}) {
        this.options = options;
        this.imagesLoaded = 0;
        this.totalImages = 0;
        this.retryCounts = {};
        this.init();
    }

    init() {
        this.insertCustomCSS();
        this.bindEvents();
        if (this.options.observeImages) {
            this.observeImages();
        }
    }

    insertCustomCSS() {
        const style = document.createElement('style');
        style.innerHTML = `
            .loading-spinner {
                display: inline-block;
                width: 50px;
                height: 50px;
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top-color: #fff;
                animation: spin 1s ease-in-out infinite;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            .loading-error {
                color: red;
                font-size: 16px;
                display: none;
            }
            .loading-transition {
                transition: opacity 0.5s ease;
            }
            ${this.options.customCSS || ''}
        `;
        document.head.appendChild(style);
    }

    bindEvents() {
        document.addEventListener('DOMContentLoaded', this.showSpinner.bind(this));
        window.addEventListener('load', this.hideSpinner.bind(this));
    }

    showSpinner() {
        if (!this.spinnerElement) {
            this.spinnerElement = document.createElement('div');
            this.spinnerElement.className = 'loading-spinner';
            if (this.options.customSpinnerClass) {
                this.spinnerElement.classList.add(this.options.customSpinnerClass);
            }
            document.body.appendChild(this.spinnerElement);
        }
    }

    hideSpinner() {
        if (this.spinnerElement) {
            this.spinnerElement.classList.add('loading-transition');
            setTimeout(() => {
                this.spinnerElement.remove();
                this.spinnerElement = null;
            }, 500);
        }
    }

    showLoadError() {
        if (!this.errorElement) {
            this.errorElement = document.createElement('div');
            this.errorElement.className = 'loading-error';
            if (this.options.customErrorClass) {
                this.errorElement.classList.add(this.options.customErrorClass);
            }
            this.errorElement.textContent = 'Loading failed, please try again.';
            document.body.appendChild(this.errorElement);
        }
        this.errorElement.style.display = 'block';
    }

    hideLoadError() {
        if (this.errorElement) {
            this.errorElement.style.display = 'none';
        }
    }
    onImageLoaded(img) {
        this.imagesLoaded++;
        this.updateProgress();
        if (this.imagesLoaded === this.totalImages) {
            this.onFinishLoading();
        }
        this.options.onImageLoaded && this.options.onImageLoaded(img);
    }

    onError(img) {
        this.updateProgress();
        if (this.options.retryOnError && this.retryCounts[img.src] < this.options.maxRetries) {
            this.retryCounts[img.src] = (this.retryCounts[img.src] || 0) + 1;
            this.loadImage(img);
        } else {
            this.showLoadError();
            this.options.onError && this.options.onError(img);
        }
    }

    onFinishLoading() {
        this.hideSpinner();
        this.options.onFinishLoading && this.options.onFinishLoading();
    }

    updateProgress() {
        this.options.onProgress && this.options.onProgress(this.imagesLoaded, this.totalImages);
    }

    observeImages() {
        if (document.body) {
        this.totalImages = document.querySelectorAll('img').length;
        this.addImageListeners(document.querySelectorAll('img'));
            const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'IMG') {
                        this.totalImages++;
                        this.addImageListeners([node]);
                    }
                });
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            this.observeImages();
        });
    }
}

    addImageListeners(images) {
        images.forEach(img => {
            img.addEventListener('load', this.imageLoadHandler.bind(this, img));
            img.addEventListener('error', this.imageErrorHandler.bind(this, img));
        });
    }

    imageLoadHandler(img) {
        this.onImageLoaded(img);
        this.removeImageListeners(img);
    }

    imageErrorHandler(img) {
        this.onError(img);
        this.removeImageListeners(img);
    }

    removeImageListeners(img) {
        img.removeEventListener('load', this.imageLoadHandler.bind(this, img));
        img.removeEventListener('error', this.imageErrorHandler.bind(this, img));
    }

    loadImage(img) {
        setTimeout(() => {
            img.src = img.src;
        }, this.options.retryDelay || 1000); //destroy() {
    this.unbindEvents();
    if (this.observer) {
        this.observer.disconnect();
    }
    if (this.spinnerElement) {
        this.spinnerElement.remove();
        this.spinnerElement = null;
    }
    if (this.errorElement) {
        this.errorElement.remove();
        this.errorElement = null;
    }
}

unbindEvents() {
    document.removeEventListener('DOMContentLoaded', this.showSpinner.bind(this));
    window.removeEventListener('load', this.hideSpinner.bind(this));
}
}

document.addEventListener('DOMContentLoaded', () => {
    const loader = new LoadingAnimations({
        observeImages: true,
        onProgress: (loaded, total) => { console.log(`Image loading progress: ${loaded} / ${total} `);
        onFinishLoading: () => { console.log('All images loaded'); }
        }
    });
});
// loader.destroy() // When no longer needed, destroy the component to clean up resources.
