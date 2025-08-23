console.log("Script is loaded!");
function addToCart(productName, price) {
    fetch('/api/add-to-cart', {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({productName, price})
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add item to cart');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            showSuccessPopup();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an issue adding the item to your cart.');
        });
}

function showSuccessPopup() {
    const popup = document.createElement('div');
    popup.classList.add('success-popup');
    popup.innerHTML = 'Item added to cart successfully!';
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 3000); // Removes the popup after 3 seconds
}

document.addEventListener("DOMContentLoaded", () => {
    const getStartedBtn = document.getElementById("getStartedBtn");
    if (getStartedBtn) {
        getStartedBtn.addEventListener("click", function() {
            const intro = document.getElementById("intro");
            if (intro) {
                intro.style.display = "none";
                window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
            }
        });
    }
    
    const canvas = document.getElementById("frame");
    const context = canvas.getContext("2d");

    const frames = {
        currentIndex : 0,
        maxIndex : 797,
    };

    let imagesLoaded = 0;
    const images = [];

    const placeholderImageUrl =
        "https://images.unsplash.com/photo-1670404160620-a3a86428560e?q=80&w=2825&auto=format&fit=crop";

    function drawPlaceholderImage() {
        const img = new Image();
        img.src = placeholderImageUrl;
        img.onload = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const scaleX = canvas.width / img.width;
            const scaleY = canvas.height / img.height;
            const scale = Math.max(scaleX, scaleY);

            const newWidth = img.width * scale;
            const newHeight = img.height * scale;

            const offsetX = (canvas.width - newWidth) / 2;
            const offsetY = (canvas.height - newHeight) / 2;

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = "high";
            context.drawImage(img, offsetX, offsetY, newWidth, newHeight);
        };
    }

    // Preload images
    function preLoadImages() {
        for (let i = 0; i <= frames.maxIndex; i++) {
            const imageUrl = `./Watch/frame_${(i + 1).toString().padStart(4, "0")}.jpg`;
            const img = new Image();
            img.src = imageUrl;
            img.onload = () => {
                imagesLoaded++;
                if (imagesLoaded === frames.maxIndex) {
                    drawFrame(frames.currentIndex);
                }
            };
            images.push(img);
        }
    }

    function drawFrame(index) {
        if (images[index] && images[index].complete) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const image = images[index];
            const scaleX = canvas.width / image.width;
            const scaleY = canvas.height / image.height;
            const scale = Math.max(scaleX, scaleY);

            const newWidth = image.width * scale;
            const newHeight = image.height * scale;

            const offsetX = (canvas.width - newWidth) / 2;
            const offsetY = (canvas.height - newHeight) / 2;

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = "high";
            context.drawImage(image, offsetX, offsetY, newWidth, newHeight);
        }
    }

    // CHANGED: Scroll event to show/hide canvas and animate frames after hero section
    window.addEventListener("scroll", () => {
        const parent = document.getElementById("parent");
        const canvas = document.getElementById("frame");
        const rect = parent.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Only animate when #parent is in view
        if (rect.top <= 0 && Math.abs(rect.top) < rect.height - windowHeight) {
            canvas.style.opacity = "1";
            // Calculate scroll percent within #parent
            let percent = Math.abs(rect.top) / (rect.height - windowHeight);
            percent = Math.max(0, Math.min(1, percent));
            let frameIndex = Math.floor(percent * frames.maxIndex);

            if (frameIndex !== frames.currentIndex) {
                frames.currentIndex = frameIndex;
                drawFrame(frameIndex);
            }
        }
        else {
            canvas.style.opacity = "0";
        }
    });

    drawPlaceholderImage();
    preLoadImages();

    window.addEventListener("resize", function() {
        drawFrame(frames.currentIndex);
    });

    // Get Started button functionality
    document.getElementById("getStartedBtn").addEventListener("click", function() {
        document.getElementById("parent").classList.add("opacity-0");
        document.getElementById("get_started_ka_background").classList.add("opacity-0");

        setTimeout(() => {
            // Scroll to the top of the page first
            window.scrollTo(0, 0);

            document.getElementById("parent").style.display = "none";
            document.getElementById("get_started_ka_background").style.display = "none";

            document.getElementById("part").classList.remove("invisible");
            document.getElementById("part").classList.add("visible");
            document.getElementById("part").classList.remove("opacity-0");
            document.getElementById("part").classList.add("opacity-100");

            // Show the product slider section after a delay
            setTimeout(() => {
                const productSlider = document.getElementById("product-slider-section");
                productSlider.classList.remove("invisible");
                productSlider.classList.add("visible");
                productSlider.classList.remove("opacity-0");
                productSlider.classList.add("opacity-100");
            }, 500);
        }, 100);
    });

    // Product Slider Navigation
    document.getElementById('next').addEventListener('click', function() {
        let lists = document.querySelectorAll('.item');
        document.getElementById('slide').appendChild(lists[0]);
    });

    document.getElementById('prev').addEventListener('click', function() {
        let lists = document.querySelectorAll('.item');
        document.getElementById('slide').prepend(lists[lists.length - 1]);
    });

    document.querySelectorAll('.seeMore').forEach(button => {
        button.addEventListener('click', () => {
            const item = button.closest('.item');
            item.classList.add('active');
        });
    });

    document.querySelectorAll('.checkout button').forEach(button => {
        if (button.textContent.trim().toLowerCase() === 'see less') {
            button.addEventListener('click', () => {
                const item = button.closest('.item');
                item.classList.remove('active');
            });
        }
    });
});
