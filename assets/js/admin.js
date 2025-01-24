const API_URL = "https://soma-backend-2syz.onrender.com";

// Login functionality
async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${API_URL}/api/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("adminToken", data.token);
      showReviewsSection();
      loadAdminReviews();
    } else {
      alert("Invalid credentials");
    }
  } catch (error) {
    console.error("Login error:", error);
  }
}

// Show reviews section after successful login
function showReviewsSection() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("reviewsSection").style.display = "block";
}

// Load reviews for admin management
async function loadAdminReviews() {
  try {
    const response = await fetch(`${API_URL}/api/reviews`);
    const reviews = await response.json();

    const reviewsContainer = document.getElementById("adminReviews");
    reviewsContainer.innerHTML = reviews
      .map((review) => createAdminReviewElement(review))
      .join("");

    // Add event listeners for response buttons
    addResponseEventListeners();
  } catch (error) {
    console.error("Error loading reviews:", error);
  }
}

// Add event listeners for admin response buttons
function addResponseEventListeners() {
  document.querySelectorAll(".respond-btn").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const reviewId = e.target.dataset.reviewId;
      const responseText = e.target.previousElementSibling.value;

      try {
        const response = await fetch(
          `${API_URL}/api/reviews/${reviewId}/respond`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
            body: JSON.stringify({ adminResponse: responseText }),
          }
        );

        if (response.ok) {
          alert("Response submitted successfully");
          loadAdminReviews(); // Reload reviews to show the new response
        } else {
          throw new Error("Failed to submit response");
        }
      } catch (error) {
        console.error("Error submitting response:", error);
        alert("Failed to submit response");
      }
    });
  });
}

// Check if admin is already logged in on page load
document.addEventListener("DOMContentLoaded", () => {
  const adminToken = localStorage.getItem("adminToken");
  if (adminToken) {
    showReviewsSection();
    loadAdminReviews();
  }
});
