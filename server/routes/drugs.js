import express from 'express';

const router = express.Router();

// Mock drugs data
const mockDrugs = [
    { _id: "1", name: "Ibuprofen", condition: "Pain", averageRating: 4.5, totalReviews: 120 },
    { _id: "2", name: "Amoxicillin", condition: "Bacterial Infection", averageRating: 4.0, totalReviews: 85 },
    { _id: "3", name: "Lisinopril", condition: "High Blood Pressure", averageRating: 3.8, totalReviews: 45 },
    { _id: "4", name: "Metformin", condition: "DiabetesType2", averageRating: 4.2, totalReviews: 200 }
];

// Get all drugs (with optional pagination/search)
router.get('/', async (req, res) => {
    try {
        const { search, condition, limit = 20, page = 1 } = req.query;
        let filteredDrugs = [...mockDrugs];
        
        if (search) {
            filteredDrugs = filteredDrugs.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
        }
        if (condition && condition !== 'All Conditions') {
            filteredDrugs = filteredDrugs.filter(d => d.condition.toLowerCase() === condition.toLowerCase());
        }

        const startIndex = (page - 1) * limit;
        const paginatedDrugs = filteredDrugs.slice(startIndex, startIndex + Number(limit));
        
        res.status(200).json({
            drugs: paginatedDrugs,
            totalPages: Math.ceil(filteredDrugs.length / limit) || 1,
            currentPage: Number(page)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single drug by ID
router.get('/:id', async (req, res) => {
    try {
        const drug = mockDrugs.find(d => d._id === req.params.id);
        if (!drug) return res.status(404).json({ msg: "Drug not found" });
        res.status(200).json(drug);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
