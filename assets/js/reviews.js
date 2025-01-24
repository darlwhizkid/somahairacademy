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
  try {
    const response = await fetch(`${API_URL}/api/reviews`);
    const reviews = await response.json();

    const reviewsList = document.querySelector(".reviews-list");
    reviewsList.innerHTML = reviews
      .map((review) => createReviewElement(review))
      .join("");
  } catch (error) {
    console.error("Error loading reviews:", error);
  }
}

function createReviewElement(review) {
  return `
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
                    <small class="text-muted">${formatDate(
                      review.createdAt
                    )}</small>
                </div>
                <div class="review-actions mt-3">
                    <button class="btn btn-sm btn-primary edit-review">Edit</button>
                    <button class="btn btn-sm btn-danger delete-review">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    <div class="edit-form" style="display: none;">
                        <textarea class="form-control">${
                          review.review
                        }</textarea>
                        <button class="btn btn-sm btn-success save-edit">Save</button>
                        <button class="btn btn-sm btn-danger cancel-edit">Cancel</button>
                    </div>
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
    `;
}



// Function to handle edit click
function handleEditClick(e) {
  const reviewCard = e.target.closest(".review-item");
  reviewCard.querySelector(".edit-form").style.display = "block";
  e.target.style.display = "none";
}

// Function to generate star rating display
function generateStars(rating) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

// Function to format date
function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

// Load reviews on page load
loadReviews();

// Add event listener for delete buttons
document.addEventListener("click", async (e) => {
  if (e.target.closest(".delete-review")) {
    const reviewId = e.target.closest(".review-item").dataset.reviewId;
    if (confirm("Are you sure you want to delete this review?")) {
      await deleteReview(reviewId);
    }
  }
});

// Function to delete review
async function deleteReview(reviewId) {
  try {
    const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      const reviewElement = document.querySelector(
        `[data-review-id="${reviewId}"]`
      );
      reviewElement.remove();
    } else {
      throw new Error("Failed to delete review");
    }
  } catch (error) {
    console.error("Error deleting review:", error);
  }
}
