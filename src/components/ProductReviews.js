import { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Card, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import { StarFill, Star } from 'react-bootstrap-icons';

const ProductReviews = ({ productId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: ''
  });
  const [loading, setLoading] = useState(true);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId, fetchReviews]);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First, get all reviews for the product
      const q = query(
        collection(db, 'reviews'),
        where('productId', '==', productId)
      );
      
      const querySnapshot = await getDocs(q);
      const reviewsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort reviews by date on the client side
      reviewsList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setReviews(reviewsList);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to fetch reviews. Please try again later.');
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const handleSubmitReview = useCallback(async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to leave a review');
      navigate('/login');
      return;
    }

    if (newReview.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!newReview.comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    try {
      const reviewData = {
        productId,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userPhoto: user.photoURL,
        rating: newReview.rating,
        comment: newReview.comment.trim(),
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'reviews'), reviewData);

      toast.success('Review submitted successfully');
      setNewReview({ rating: 0, comment: '' });
      fetchReviews(); // Refresh reviews after submission
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    }
  }, [user, navigate, newReview, productId, fetchReviews]);

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-danger mb-3">{error}</p>
        <Button 
          variant="primary"
          onClick={fetchReviews}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <h2 className="h4 mb-4">Customer Reviews</h2>

        {/* Overall Rating */}
        <div className="d-flex align-items-center gap-2 mb-4">
          <h3 className="h5 mb-0">{calculateAverageRating()}</h3>
          <div className="text-warning">
            {[...Array(5)].map((_, i) => (
              <span key={i}>
                {i < Math.round(calculateAverageRating()) ? (
                  <StarFill size={20} />
                ) : (
                  <Star size={20} />
                )}
              </span>
            ))}
          </div>
          <span className="text-muted">({reviews.length} reviews)</span>
        </div>

        {/* Review Form */}
        {user && (
          <Card className="bg-light border-0 mb-4">
            <Card.Body>
              <h3 className="h5 mb-3">Write a Review</h3>
              <Form onSubmit={handleSubmitReview}>
                <Form.Group className="mb-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Form.Label className="mb-0">Rating:</Form.Label>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Button
                        key={star}
                        variant="link"
                        className="p-0 text-warning"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                      >
                        {star <= (hoveredRating || newReview.rating) ? (
                          <StarFill size={24} />
                        ) : (
                          <Star size={24} />
                        )}
                      </Button>
                    ))}
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Write your review here..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  />
                </Form.Group>

                <Button type="submit" variant="primary">
                  Submit Review
                </Button>
              </Form>
            </Card.Body>
          </Card>
        )}

        {/* Reviews List */}
        <Row className="g-3">
          {reviews.length === 0 ? (
            <Col xs={12}>
              <div className="text-center py-4">
                <p className="text-muted mb-0">
                  No reviews yet. Be the first to review this product!
                </p>
              </div>
            </Col>
          ) : (
            reviews.map((review) => (
              <Col xs={12} key={review.id}>
                <Card className="h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-2">
                      <div className="text-warning">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>
                            {i < review.rating ? (
                              <StarFill size={16} />
                            ) : (
                              <Star size={16} />
                            )}
                          </span>
                        ))}
                      </div>
                      <small className="text-muted">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                    <div className="d-flex gap-3 mb-2">
                      <img
                        src={review.userPhoto || 'https://via.placeholder.com/40'}
                        alt={review.userName}
                        className="rounded-circle"
                        width="40"
                        height="40"
                      />
                      <div>
                        <h6 className="mb-1">{review.userName}</h6>
                        <p className="mb-0 text-muted">{review.comment}</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ProductReviews; 