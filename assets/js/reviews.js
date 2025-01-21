const API_URL = "https://soma-backend-2syz.onrender.com";

// Handle star rating selection
const stars = document.querySelectorAll('.star-rating i');
let selectedRating = 0;

stars.forEach(star => {
  star.addEventListener('click', () => {
    selectedRating = star.dataset.rating;
    updateStars(selectedRating);
  });
});

function updateStars(rating) {
  stars.forEach(star => {
    const starRating = parseInt(star.dataset.rating);
    star.classList.toggle('fas', starRating <= rating);
    star.classList.toggle('far', starRating > rating);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Show/Hide review form
  document.getElementById("writeReviewBtn").addEventListener("click", () => {
    console.log("Button clicked");
    document.getElementById("reviewForm").style.display = "block";
  });

  // Submit review
  document
    .getElementById("submitReview")
    .addEventListener("click", async () => {
      const reviewText = document.querySelector("textarea").value;

      const response = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: selectedRating,
          review: reviewText,
          name: document.getElementById("reviewerName").value,
        }),
      });

      if (response.ok) {
        loadReviews();
        document.getElementById("reviewForm").style.display = "none";
      }
    });
});


// Load and display reviews
async function loadReviews() {
  const response = await fetch(`${API_URL}/api/reviews`);
  const reviews = await response.json();
  
  const reviewsList = document.querySelector('.reviews-list');
  reviewsList.innerHTML = reviews.map(review => `
    <div class="review-item card mb-3">
      <div class="card-body">
        <div class="d-flex justify-content-between">
          <div>
            <div class="stars">
              ${generateStars(review.rating)}
            </div>
            <h5>${review.name}</h5>
            <p class="review-text">${review.review}</p>
          </div>
          <small class="text-muted">${formatDate(review.date)}</small>
        </div>
        ${review.adminResponse ? `
          <div class="admin-response mt-3">
            <div class="admin-badge">Admin</div>
            <p>${review.adminResponse}</p>
          </div>
        ` : ''}
      </div>
    </div>
  `).join('');
}

function generateStars(rating) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

// Load reviews on page load
loadReviews();
