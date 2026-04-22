const express = require('express');
const router = express.Router();
const axios = require('axios');
const { dbRun, dbGet, dbAll } = require('../database');
require('dotenv').config();

const PLANTNET_API_KEY = process.env.PLANTNET_API_KEY;

// Function to identify plant from image
const identifyPlantFromImage = async (imageBase64) => {
  try {
    if (!PLANTNET_API_KEY) {
      console.warn('PlantNet API key not configured');
      return null;
    }

    const response = await axios.post(
      `https://api.plantnet.org/v2/identify/all?include-related-images=true&no-reject=false&lang=en&api-key=${PLANTNET_API_KEY}`,
      {
        images: [{ imageBase64 }],
        organs: ['leaf', 'flower', 'fruit', 'bark']
      },
      { timeout: 30000 }
    );

    if (response.data.results && response.data.results.length > 0) {
      const topResult = response.data.results[0];
      return {
        name: topResult.species.commonNames?.[0] || topResult.species.scientificNameWithoutAuthor,
        species: topResult.species.scientificNameWithoutAuthor,
        type: 'plant', // default type
        probability: (topResult.score * 100).toFixed(2),
        genus: topResult.species.genus?.scientificNameWithoutAuthor || null
      };
    }
    return null;
  } catch (err) {
    console.error('PlantNet identification error:', err.message);
    return null;
  }
};

// Identify plant from image - returns plant details
router.post('/identify', async (req, res) => {
  try {
    const { image_base64 } = req.body;

    if (!image_base64) {
      return res.status(400).json({ success: false, error: 'image_base64 is required' });
    }

    const plantInfo = await identifyPlantFromImage(image_base64);

    if (!plantInfo) {
      return res.status(400).json({
        success: false,
        error: 'Could not identify plant from image. Please ensure the image shows the plant clearly.'
      });
    }

    res.json({ success: true, data: plantInfo });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single plant details (MUST be before generic /:userId route)
router.get('/details/:plantId', async (req, res) => {
  try {
    const { plantId } = req.params;
    const plant = await dbGet(
      'SELECT * FROM plants WHERE id = $1',
      [plantId]
    );

    if (!plant) {
      return res.status(404).json({ success: false, error: 'Plant not found' });
    }

    // Get recent analysis for this plant
    const analysis = await dbAll(
      'SELECT * FROM plant_analysis WHERE plant_id = $1 ORDER BY created_at DESC LIMIT 5',
      [plantId]
    );

    res.json({ success: true, data: { plant, recentAnalysis: analysis } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add new plant
router.post('/', async (req, res) => {
  try {
    const { user_id, name, species, type, location, water_frequency, sunlight_requirement, notes, image_url } = req.body;

    if (!user_id || !name) {
      return res.status(400).json({ success: false, error: 'user_id and name are required' });
    }

    const result = await dbRun(
      `INSERT INTO plants (user_id, name, species, type, location, water_frequency, sunlight_requirement, notes, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [user_id, name, species, type, location, water_frequency, sunlight_requirement, notes, image_url]
    );

    res.status(201).json({
      success: true,
      message: 'Plant added successfully',
      plantId: result.rows[0].id
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update plant
router.put('/:plantId', async (req, res) => {
  try {
    const { plantId } = req.params;
    const { name, species, type, location, water_frequency, sunlight_requirement, notes, image_url } = req.body;

    await dbRun(
      `UPDATE plants SET name=$1, species=$2, type=$3, location=$4, water_frequency=$5, sunlight_requirement=$6, notes=$7, image_url=$8, updated_at=CURRENT_TIMESTAMP
       WHERE id = $9`,
      [name, species, type, location, water_frequency, sunlight_requirement, notes, image_url, plantId]
    );

    res.json({ success: true, message: 'Plant updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete plant
router.delete('/:plantId', async (req, res) => {
  try {
    const { plantId } = req.params;

    await dbRun('DELETE FROM plant_analysis WHERE plant_id = $1', [plantId]);
    await dbRun('DELETE FROM plants WHERE id = $1', [plantId]);

    res.json({ success: true, message: 'Plant deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all plants for a user (MUST be LAST - generic catch-all route)
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const plants = await dbAll(
      'SELECT * FROM plants WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json({ success: true, data: plants });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
