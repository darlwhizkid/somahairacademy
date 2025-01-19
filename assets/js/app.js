// Preloader
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");

  // Ensure content is loaded
  setTimeout(() => {
    preloader.style.opacity = "0";
    preloader.style.transition = "opacity 0.8s ease";

    setTimeout(() => {
      preloader.style.display = "none";
      document.body.style.overflow = "visible";
    }, 800);
  }, 1500);
});
// Preloader ends

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});
// Smooth Scroll ends

// Announcement Bar starts
document.addEventListener("DOMContentLoaded", function () {
  const announcementCarousel = new bootstrap.Carousel(
    document.querySelector("#announcementCarousel"),
    {
      interval: 3000,
      ride: true,
      wrap: true,
    }
  );
});
// Announcement bar ends

// Review Begins
document.addEventListener("DOMContentLoaded", function () {
  const writeReviewBtn = document.getElementById("writeReviewBtn");
  const reviewForm = document.getElementById("reviewForm");
  const submitReview = document.getElementById("submitReview");
  const starRating = document.querySelectorAll(".star-rating i");

  // Show/Hide review form
  writeReviewBtn.addEventListener("click", () => {
    reviewForm.style.display =
      reviewForm.style.display === "none" ? "block" : "none";
  });

  // Handle star rating
  starRating.forEach((star) => {
    star.addEventListener("mouseover", function () {
      const rating = this.getAttribute("data-rating");
      highlightStars(rating);
    });

    star.addEventListener("click", function () {
      const rating = this.getAttribute("data-rating");
      setRating(rating);
    });
  });

  // Submit review
  submitReview.addEventListener("click", () => {
    reviewForm.style.display = "none";
    // Add logic to save review
  });

  function highlightStars(rating) {
    starRating.forEach((star) => {
      const starRating = star.getAttribute("data-rating");
      star.classList.toggle("fas", starRating <= rating);
      star.classList.toggle("far", starRating > rating);
    });
  }

  function setRating(rating) {
    highlightStars(rating);
    // Add logic to store the rating
  }
});
// Review ends

// Scroll to the top begins
const scrollToTopBtn = document.getElementById("scrollToTop");

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Show/hide scroll button based on scroll position
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
});
// Scroll to the top ends






