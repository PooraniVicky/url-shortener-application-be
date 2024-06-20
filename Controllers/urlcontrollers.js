import Url from "../Models/urlSchema.js";
// Function to generate a random short ID
function generateShortId(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}


export const createURL = async (req, res) => {
  const { longUrl } = req.body; // Assuming req.body contains 'longUrl'
console.log( {longUrl});
  try {
    // Generate a short URL ID (example: using a random string)
    const shortUrlId = generateShortId(7); // Function defined in helpers.js
    const shortUrl = shortUrlId;

    // Create a new URL document
    const newURL = new Url({
      longUrl,
      shortUrl,
      date: new Date(),
      clickCount: 0
    });

    // Save the new URL document to the database
    await newURL.save();

    // Respond with success message and new URL object
    res.status(201).json({ message: 'URL created successfully', url: shortUrl });
  } catch (error) {
    console.error('Error creating URL:', error);
    res.status(500).json({ message: 'Error creating URL', error: error.message });
  }
};

export const getAllURL = async (req, res) => {
  try {
    const urls = await Url.find({});
    res.status(200).json({urls});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get URL statistics
export const getUrlStats = async (req, res) => {
  try {
    const daily = await Url.countDocuments({ date: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
    const monthly = await Url.countDocuments({ date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });
console.log(daily, monthly);
    res.status(200).json({ daily, monthly });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch URL statistics.' });
  }
};

// Redirect Short URL
export const redirectShortUrl = async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const urlDoc = await Url.findOne({ shortUrl });

    if (!urlDoc) {
      return res.status(404).json({ message: 'URL not found.' });
    }

    // Increment the click count
    urlDoc.clickCount += 1;
    await urlDoc.save();

    // Redirect to the long URL
    return res.redirect(urlDoc.longUrl);
  } catch (err) {
    console.error(`Error processing short URL: ${shortUrl}`, err);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};