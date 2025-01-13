// Handle star rating selection
const stars = document.querySelectorAll('.star-rating i');
let selectedRating = 0;

stars.forEach(star => {
  star.addEventListener('click', () => {
    selectedRating = star.dataset.rating;
    updateStars(selectedRating);
  });
});

// Submit review
document.getElementById('submitReview').addEventListener('click', async () => {
  const reviewText = document.querySelector('textarea').value;
  
  const response = await fetch('/api/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      rating: selectedRating,
      review: reviewText,
      name: 'Anonymous' // You can add user authentication later
    })
  });
  
  if (response.ok) {
    loadReviews();
    document.getElementById('reviewForm').style.display = 'none';
  }
});

// Load reviews
async function loadReviews() {
  const response = await fetch('/api/reviews');
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

// Load reviews on page load
loadReviews();
