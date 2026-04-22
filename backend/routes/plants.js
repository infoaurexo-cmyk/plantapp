const express = require('express');
const router = express.Router();
const { dbRun, dbGet, dbAll } = require('../database');

// Get single plant details (MUST be before generic /:userId route)
router.get('/details/:plantId', async (req, res) => {
  try {
    const { plantId } = req.params;
    const plant = await dbGet(
      'SELECT * FROM plants WHERE id = ?',
      [plantId]
    );

    if (!plant) {
      return res.status(404).json({ success: false, error: 'Plant not found' });
    }

    // Get recent analysis for this plant
    const analysis = await dbAll(
      'SELECT * FROM plant_analysis WHERE plant_id = ? ORDER BY created_at DESC LIMIT 5',
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
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, name, species, type, location, water_frequency, sunlight_requirement, notes, image_url]
    );

    res.status(201).json({
      success: true,
      message: 'Plant added successfully',
      plantId: result.lastID
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
      `UPDATE plants SET name=?, species=?, type=?, location=?, water_frequency=?, sunlight_requirement=?, notes=?, image_url=?, updated_at=CURRENT_TIMESTAMP
       WHERE id = ?`,
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

    await dbRun('DELETE FROM plant_analysis WHERE plant_id = ?', [plantId]);
    await dbRun('DELETE FROM plants WHERE id = ?', [plantId]);

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
      'SELECT * FROM plants WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json({ success: true, data: plants });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
