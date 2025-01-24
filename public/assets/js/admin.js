async function loadAdminReviews() {
    const response = await fetch('/api/reviews');
    const reviews = await response.json();
    
    const reviewsContainer = document.getElementById('adminReviews');
    reviewsContainer.innerHTML = reviews.map(review => `
        <div class="card mb-3">
            <div class="card-body">
                <h5>${review.name}</h5>
                <div class="stars">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
                <p>${review.review}</p>
                <div class="admin-response-section">
                    <textarea class="form-control mb-2" placeholder="Admin response...">${review.adminResponse || ''}</textarea>
                    <button class="btn btn-primary" onclick="submitResponse('${review._id}', this)">
                        ${review.adminResponse ? 'Update Response' : 'Post Response'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

async function submitResponse(reviewId, button) {
    const responseText = button.previousElementSibling.value;
    
    const response = await fetch(`/api/reviews/${reviewId}/respond`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ adminResponse: responseText })
    });
    
    if (response.ok) {
        loadAdminReviews();
    }
}

loadAdminReviews();
