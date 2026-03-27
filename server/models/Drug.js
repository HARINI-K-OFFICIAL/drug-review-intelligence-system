import mongoose from 'mongoose';

const drugSchema = new mongoose.Schema({
    uniqueID: { type: String, unique: true },
    drugName: { type: String, required: true },
    condition: { type: String, required: true },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
}, { timestamps: true });

// Text index for search
drugSchema.index({ drugName: 'text', condition: 'text' });

export default mongoose.model('Drug', drugSchema);
