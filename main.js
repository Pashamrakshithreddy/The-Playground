document.addEventListener('DOMContentLoaded', () => {
    // Opening or closing sidebar
    const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }
    const sidebar = document.querySelector("[data-sidebar]");
    const sidebarBtn = document.querySelector("[data-sidebar-btn]");
    sidebarBtn.addEventListener("click", function() { elementToggleFunc(sidebar); });

    // Activating Modal-testimonial
    const testimonialsItem = document.querySelectorAll('[data-testimonials-item]');
    const modalContainer = document.querySelector('[data-modal-container]');
    const modalCloseBtn = document.querySelector('[data-modal-close-btn]');
    const overlay = document.querySelector('[data-overlay]');
    const modalImg = document.querySelector('[data-modal-img]');
    const modalTitle = document.querySelector('[data-modal-title]');
    const modalText = document.querySelector('[data-modal-text]');

    const testimonialsModalFunc = function () {
        modalContainer.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    for (let i = 0; i < testimonialsItem.length; i++) {
        testimonialsItem[i].addEventListener('click', function () {
            modalImg.src = this.querySelector('[data-testimonials-avatar]').src;
            modalImg.alt = this.querySelector('[data-testimonials-avatar]').alt;
            modalTitle.innerHTML = this.querySelector('[data-testimonials-title]').innerHTML;
            modalText.innerHTML = this.querySelector('[data-testimonials-text]').innerHTML;
            testimonialsModalFunc();
        });
    }

    // Activating close button in modal-testimonial
    modalCloseBtn.addEventListener('click', testimonialsModalFunc);
    overlay.addEventListener('click', testimonialsModalFunc);

    // Activating Filter Select and filtering options
    const select = document.querySelector('[data-select]');
    const selectItems = document.querySelectorAll('[data-select-item]');
    const selectValue = document.querySelector('[data-select-value]');
    const filterBtn = document.querySelectorAll('[data-filter-btn]');

    select.addEventListener('click', function () { elementToggleFunc(this); });

    for (let i = 0; i < selectItems.length; i++) {
        selectItems[i].addEventListener('click', function () {
            let selectedValue = this.innerText.toLowerCase();
            selectValue.innerText = this.innerText;
            elementToggleFunc(select);
            filterFunc(selectedValue);
        });
    }

    const filterItems = document.querySelectorAll('[data-filter-item]');

    const filterFunc = function (selectedValue) {
        for (let i = 0; i < filterItems.length; i++) {
            if (selectedValue == "all") {
                filterItems[i].classList.add('active');
            } else if (selectedValue == filterItems[i].dataset.category) {
                filterItems[i].classList.add('active');
            } else {
                filterItems[i].classList.remove('active');
            }
        }
    }

    // Enabling filter button for larger screens
    let lastClickedBtn = filterBtn[0];

    for (let i = 0; i < filterBtn.length; i++) {
        filterBtn[i].addEventListener('click', function () {
            let selectedValue = this.innerText.toLowerCase();
            selectValue.innerText = this.innerText;
            filterFunc(selectedValue);
            lastClickedBtn.classList.remove('active');
            this.classList.add('active');
            lastClickedBtn = this;
        });
    }

    // Enabling Contact Form
    const form = document.querySelector('[data-form]');
    const formInputs = document.querySelectorAll('[data-form-input]');
    const formBtn = document.querySelector('[data-form-btn]');

    for (let i = 0; i < formInputs.length; i++) {
        formInputs[i].addEventListener('input', function () {
            if (form.checkValidity()) {
                formBtn.removeAttribute('disabled');
            } else {
                formBtn.setAttribute('disabled', '');
            }
        });
    }

    // Enabling Page Navigation
    const navigationLinks = document.querySelectorAll('[data-nav-link]');
    const pages = document.querySelectorAll('[data-page]');

    for (let i = 0; i < navigationLinks.length; i++) {
        navigationLinks[i].addEventListener('click', function () {
            for (let i = 0; i < pages.length; i++) {
                if (this.innerText.toLowerCase() == pages[i].dataset.page) {
                    pages[i].classList.add('active');
                    navigationLinks[i].classList.add('active');
                    window.scrollTo(0, 0);
                } else {
                    pages[i].classList.remove('active');
                    navigationLinks[i].classList.remove('active');
                }
            }
        });
    }

    // Fetch and display posts
    const postsSection = document.querySelector('.posts-section');
    fetch('/posts')
        .then(response => response.json())
        .then(posts => {
            posts.forEach(post => {
                const postItem = document.createElement('div');
                postItem.classList.add('post-item');
                postItem.innerHTML = `
                    <div class="post-content">
                        <img src="${post.image}" alt="${post.caption}" loading="lazy">
                        <h3 class="post-title">${post.title}</h3>
                        <p class="post-caption">${post.caption}</p>
                    </div>
                    <div class="post-interactions">
                        <div class="likes">
                            <ion-icon name="heart-outline"></ion-icon>
                            <span>${post.likes} Likes</span>
                        </div>
                        <div class="comments">
                            <ion-icon name="chatbubble-outline"></ion-icon>
                            <span>${post.comments.length} Comments</span>
                        </div>
                    </div>
                `;
                postsSection.appendChild(postItem);
            });
        })
        .catch(error => console.error('Error fetching posts:', error));

    // Fetch and display reels
    const reelsSection = document.querySelector('.reels-section');
    fetch('/reels')
        .then(response => response.json())
        .then(reels => {
            reels.likedPosts.forEach(post => {
                const reelItem = document.createElement('li');
                reelItem.classList.add('reel-item');
                reelItem.innerHTML = `
                    <video src="${post.video}" controls></video>
                    <div class="reel-interactions">
                        <div class="like-btn">
                            <ion-icon name="heart-outline"></ion-icon>
                            <span>Like</span>
                        </div>
                        <div class="comment-btn">
                            <ion-icon name="chatbubble-outline"></ion-icon>
                            <span>Comment</span>
                        </div>
                    </div>
                `;
                reelsSection.querySelector('.reels-list:first-child').appendChild(reelItem);
            });

            reels.interests.forEach(interest => {
                const reelItem = document.createElement('li');
                reelItem.classList.add('reel-item');
                reelItem.innerHTML = `<p>${interest}</p>`;
                reelsSection.querySelector('.reels-list:last-child').appendChild(reelItem);
            });
        })
        .catch(error => console.error('Error fetching reels:', error));

    // Liked Posts button functionality
    const likedPostsBtn = document.querySelector('[data-liked-posts-btn]');
    likedPostsBtn.addEventListener('click', function () {
        const likedPostsSection = document.querySelector('.reels-section .reels-list:first-child');
        likedPostsSection.scrollIntoView({ behavior: 'smooth' });
    });

    // Comment box functionality
    const commentBox = document.querySelector('#comment-box');
    const comments = document.querySelectorAll('.comment-btn');

    comments.forEach(comment => {
        comment.addEventListener('click', function () {
            commentBox.style.display = 'block';
        });
    });

    const commentSubmitBtn = document.querySelector('.comment-submit-btn');
    commentSubmitBtn.addEventListener('click', function () {
        const textarea = commentBox.querySelector('textarea');
        if (textarea.value.trim() !== '') {
            // Here you can add the logic to send the comment to the server
            console.log('Comment:', textarea.value);
            textarea.value = '';
            commentBox.style.display = 'none';
        }
    });

    // Like button functionality
    const likeBtns = document.querySelectorAll('.like-btn');
    likeBtns.forEach(likeBtn => {
        likeBtn.addEventListener('click', function () {
            const icon = this.querySelector('ion-icon');
            if (icon.getAttribute('name') === 'heart-outline') {
                icon.setAttribute('name', 'heart');
                icon.style.color = 'var(--orange-yellow-crayola)';
            } else {
                icon.setAttribute('name', 'heart-outline');
                icon.style.color = 'var(--light-gray)';
            }
        });
    });
});
