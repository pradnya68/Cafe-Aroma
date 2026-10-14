import express from 'express';
import { geocodeAddress, reverseGeocode } from '../controllers/locationController.js';

const router = express.Router();

router.get('/geocode', geocodeAddress);
router.get('/reverse', reverseGeocode);

export default router;
