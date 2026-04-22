const express = require('express');
const router = express.Router();
const { dbRun, dbGet, dbAll } = require('../database');

// Create new user (email only, auto-generate username)
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'email is required' });
    }

    // Auto-generate username from email (part before @)
    const username = email.split('@')[0] + '_' + Date.now();

    const result = await dbRun(
      'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id',
      [username, email]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      userId: result.rows[0].id,
      email: email
    });
  } catch (err) {
    if (err.message.includes('duplicate key value violates unique constraint')) {
      res.status(400).json({ success: false, error: 'Email already exists' });
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
       WHERE p.user_id = $1
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
    const user = await dbGet('SELECT * FROM users WHERE id = $1', [userId]);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Get user's plants count
    const plantsCount = await dbGet(
      'SELECT COUNT(*) as count FROM plants WHERE user_id = $1',
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
      'UPDATE users SET username=$1, email=$2, updated_at=CURRENT_TIMESTAMP WHERE id=$3',
      [username, email, userId]
    );

    res.json({ success: true, message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
