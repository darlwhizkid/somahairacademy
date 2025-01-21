const API_URL = "https://soma-backend-2syz.onrender.com";

// Handle star rating selection
const stars = document.querySelectorAll(".star-rating i");
let selectedRating = 0;

stars.forEach((star) => {
  star.addEventListener("click", () => {
    selectedRating = star.dataset.rating;
    updateStars(selectedRating);
  });
});

function updateStars(rating) {
  stars.forEach((star) => {
    const starRating = parseInt(star.dataset.rating);
    star.classList.toggle("fas", starRating <= rating);
    star.classList.toggle("far", starRating > rating);
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

  const reviewsList = document.querySelector(".reviews-list");
  reviewsList.innerHTML = reviews
    .map(
      (review) => `
    <div class="review-item card mb-3" data-review-id="${review._id}">
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
        <div class="review-actions">
          <button class="btn btn-sm btn-primary edit-review">Edit</button>
          <div class="edit-form" style="display: none;">
            <textarea class="form-control">${review.review}</textarea>
            <button class="btn btn-sm btn-success save-edit">Save</button>
            <button class="btn btn-sm btn-danger cancel-edit">Cancel</button>
          </div>
        </div>
        <div class="admin-response-section">
          <textarea class="form-control admin-response-text"></textarea>
          <button class="btn btn-primary submit-admin-response" data-review-id="${
            review._id
          }">
            Submit Response
          </button>
        </div>
        ${
          review.adminResponse
            ? `
          <div class="admin-response mt-3">
            <div class="admin-badge">Admin</div>
            <p>${review.adminResponse}</p>
          </div>
        `
            : ""
        }
      </div>
    </div>
  `
    )
    .join("");

  // Add event listeners for edit functionality
  document.querySelectorAll(".edit-review").forEach((button) => {
    button.addEventListener("click", handleEditClick);
  });

  // Add event listeners for save and cancel edit
  document.querySelectorAll(".save-edit").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const reviewCard = e.target.closest(".review-item");
      const reviewId = reviewCard.dataset.reviewId;
      const newText = reviewCard.querySelector(".edit-form textarea").value;

      const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ review: newText }),
      });

      if (response.ok) {
        loadReviews();
      }
    });
  });

  document.querySelectorAll(".cancel-edit").forEach((button) => {
    button.addEventListener("click", (e) => {
      const reviewCard = e.target.closest(".review-item");
      reviewCard.querySelector(".edit-form").style.display = "none";
      reviewCard.querySelector(".edit-review").style.display = "block";
    });
  });

  // Add event listeners for admin response submission
  document.querySelectorAll(".submit-admin-response").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const reviewId = e.target.dataset.reviewId;
      const responseText = e.target.previousElementSibling.value;

      const response = await fetch(
        `${API_URL}/api/reviews/${reviewId}/respond`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ adminResponse: responseText }),
        }
      );

      if (response.ok) {
        loadReviews();
      }
    });
  });
}

function handleEditClick(e) {
  const reviewCard = e.target.closest(".review-item");
  reviewCard.querySelector(".edit-form").style.display = "block";
  e.target.style.display = "none";
}

function generateStars(rating) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

// Load reviews on page load
loadReviews();
