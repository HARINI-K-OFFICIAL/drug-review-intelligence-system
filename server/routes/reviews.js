import express from 'express';
import axios from 'axios';

const router = express.Router();
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// Mock reviews storage
const mockReviews = [
    {
        _id: "101",
        user: { _id: "1", username: "testuser" },
        drug: "1",
        reviewText: "Worked great for my pain. No side effects.",
        rating: 5,
        sentiment: "Positive",
        predictedCondition: "Pain",
        date: new Date().toISOString()
    }
];

// Verify token mock middleware
const mockVerifyToken = (req, res, next) => {
    // Basic mock authentication middleware
    req.user = { id: "1" };
    next();
};

// Get reviews for a drug
router.get('/:drugId', async (req, res) => {
    try {
        const reviews = mockReviews
            .filter(r => r.drug === req.params.drugId)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Post a review
router.post('/', mockVerifyToken, async (req, res) => {
    try {
        const { drugId, reviewText, rating } = req.body;
        
        // 1. Send text to ML Microservice for predictions (if it is running)
        let sentiment = "Neutral";
        let predictedCondition = "Unknown";
        
        try {
            const sentimentRes = await axios.post(`${ML_SERVICE_URL}/sentiment`, { review_text: reviewText });
            sentiment = sentimentRes.data.sentiment;
            
            const conditionRes = await axios.post(`${ML_SERVICE_URL}/condition`, { review_text: reviewText });
            predictedCondition = conditionRes.data.condition;
        } catch (mlError) {
            console.error("ML Service Error:", mlError.message);
            // Fallback to defaults
        }

        const newReview = {
            _id: String(mockReviews.length + 102),
            user: { _id: req.user.id, username: "current_user" },
            drug: drugId,
            reviewText,
            rating,
            sentiment,
            predictedCondition,
            date: new Date().toISOString()
        };
        
        mockReviews.push(newReview);
        res.status(201).json(newReview);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ML Integration API - separate endpoints proxying to ML
router.post('/summary', async (req, res) => {
    try {
         const summaryRes = await axios.post(`${ML_SERVICE_URL}/summary`, { review_text: req.body.reviewText });
         res.status(200).json(summaryRes.data);
    } catch (err) {
        res.status(200).json({ summary: "This is a mock summary. The model is unreachable." });
    }
});

router.post('/chatbot', async (req, res) => {
    // Mock Chatbot via ML service or directly here
    const { query } = req.body;
    let reply = "I'm a mock chatbot. You asked: " + query;
    if (query && query.toLowerCase().includes("headache")) {
        reply = "For headaches, common medications include Ibuprofen and Acetaminophen. Please consult a doctor.";
    }
    res.status(200).json({ reply });
});

// Add comprehensive AI Analysis endpoint
router.post('/analyze', async (req, res) => {
    try {
        const { reviewText } = req.body;
        if (!reviewText) return res.status(400).json({ error: "Review text is required" });

        // Call ML endpoints in parallel
        const [sentiment, rating, condition] = await Promise.all([
            axios.post(`${ML_SERVICE_URL}/sentiment`, { review_text: reviewText }).then(r => r.data).catch(() => ({ sentiment: "Neutral" })),
            axios.post(`${ML_SERVICE_URL}/rating`, { review_text: reviewText }).then(r => r.data).catch(() => ({ rating: 5.0 })),
            axios.post(`${ML_SERVICE_URL}/condition`, { review_text: reviewText }).then(r => r.data).catch(() => ({ condition: "Unknown" }))
        ]);

        res.status(200).json({
            sentiment: sentiment.sentiment,
            rating: rating.rating,
            condition: condition.condition
        });
    } catch (err) {
        console.error("AI Analysis Error:", err.message);
        res.status(500).json({ error: "Failed to analyze review" });
    }
});

export default router;
