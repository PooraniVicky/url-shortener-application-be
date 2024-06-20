// Import mongoose
import mongoose from 'mongoose';

// Define the schema
const urlSchema = new mongoose.Schema({
  longUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  clickCount: {
    type: Number,
    default: 0,
  },
  
});

// Create a model from the schema
const Url = mongoose.model('Url', urlSchema);

// Export the model
export default Url;
