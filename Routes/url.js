import express from 'express';
import { createURL, getAllURL, getUrlStats, redirectShortUrl } from '../Controllers/urlcontrollers.js'

const router = express.Router();

// URL routes
router.post('/create-url', createURL);

// route to get all URLs
router.get('/urls', getAllURL);

// Get URL statistics
router.get('/stats', getUrlStats);

// Redirect Short URL
router.get('/:shortUrl', redirectShortUrl);

export default router;
