const express = require('express');
const router = express.Router();
const { dbRun, dbGet, dbAll } = require('../database');

// Create new user
router.post('/', async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ success: false, error: 'username and email are required' });
    }

    const result = await dbRun(
      'INSERT INTO users (username, email) VALUES (?, ?)',
      [username, email]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      userId: result.lastID
    });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ success: false, error: 'Username or email already exists' });
    } else {
      res.status(500).json({ success: false, error: err.message });
    }
  }
});

// Get user's analysis history (MUST be before generic /:userId route)
router.get('/:userId/analysis-history', async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await dbAll(
      `SELECT pa.* FROM plant_analysis pa
       JOIN plants p ON pa.plant_id = p.id
       WHERE p.user_id = ?
       ORDER BY pa.created_at DESC
       LIMIT 20`,
      [userId]
    );

    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get user profile (MUST be LAST - generic catch-all route)
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await dbGet('SELECT * FROM users WHERE id = ?', [userId]);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Get user's plants count
    const plantsCount = await dbGet(
      'SELECT COUNT(*) as count FROM plants WHERE user_id = ?',
      [userId]
    );

    res.json({ success: true, data: { ...user, plantsCount: plantsCount.count } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update user profile
router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email } = req.body;

    await dbRun(
      'UPDATE users SET username=?, email=?, updated_at=CURRENT_TIMESTAMP WHERE id=?',
      [username, email, userId]
    );

    res.json({ success: true, message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
