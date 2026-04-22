const express = require('express');
const router = express.Router();
const axios = require('axios');
const { dbRun, dbGet, dbAll } = require('../database');
require('dotenv').config();

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';
const PLANTNET_API_KEY = process.env.PLANTNET_API_KEY;

// Function to call Ollama for AI recommendations
const getOllamaRecommendations = async (plantType, symptoms) => {
  try {
    const prompt = `You are an expert plant health specialist. A user has a ${plantType} plant with the following symptoms: ${symptoms}.

    Please provide:
    1. What disease or pest problem is this likely to be?
    2. Severity level (Low/Medium/High)
    3. 3-5 specific, practical recommendations using common household items or organic methods
    4. Prevention tips for the future

    Be concise and practical.`;

    const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
      model: OLLAMA_MODEL,
      prompt: prompt,
      stream: false
    }, { timeout: 120000 }); // 120s needed — model must load on first request

    return response.data.response;
  } catch (err) {
    if (err.response) {
      console.error('Ollama HTTP error:', err.response.status, JSON.stringify(err.response.data));
    } else if (err.code === 'ECONNABORTED') {
      console.error('Ollama timeout — model too slow or not loaded. Try a smaller model via OLLAMA_MODEL env var.');
    } else {
      console.error('Ollama error:', err.message);
    }
    return null;
  }
};

// Function to identify plant from image (using PlantNet API)
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
        species: topResult.species.scientificNameWithoutAuthor,
        commonName: topResult.species.commonNames?.[0] || topResult.species.scientificNameWithoutAuthor,
        probability: (topResult.score * 100).toFixed(2),
        genus: topResult.species.genus.scientificNameWithoutAuthor
      };
    }
    return null;
  } catch (err) {
    console.error('PlantNet error:', err.message);
    return null;
  }
};

// Main analysis endpoint
router.post('/', async (req, res) => {
  try {
    const { plant_id, symptoms, image_base64 } = req.body;

    if (!plant_id || (!symptoms && !image_base64)) {
      return res.status(400).json({
        success: false,
        error: 'plant_id and either symptoms or image_base64 are required'
      });
    }

    // Get plant info
    const plant = await dbGet('SELECT * FROM plants WHERE id = ?', [plant_id]);
    if (!plant) {
      return res.status(404).json({ success: false, error: 'Plant not found' });
    }

    let plantIdentification = null;
    let imageUrl = null;

    // If image provided, try to identify plant
    if (image_base64) {
      // In production, save image to cloud storage
      imageUrl = 'image_saved_url';
      plantIdentification = await identifyPlantFromImage(image_base64);
    }

    // Get AI recommendations from Ollama
    const plantSpecies = plant.species || plantIdentification?.species || plant.type || 'unknown';
    const plantType = plant.type || 'plant';
    const symptomsText = symptoms || 'Plant health issues detected in image';

    // Run AI and knowledge base lookup in parallel
    const [aiRecommendations, matchedDiseases, careTips] = await Promise.all([
      getOllamaRecommendations(plantSpecies, symptomsText),
      dbAll(
        `SELECT name, description, organic_remedies, prevention_tips, severity_level
         FROM diseases
         WHERE lower(symptoms) LIKE lower(?) OR lower(affected_plants) LIKE lower(?)
         LIMIT 3`,
        [`%${symptomsText.split(' ').slice(0, 3).join('%')}%`, `%${plantType}%`]
      ),
      dbAll(
        `SELECT care_category, tip, frequency FROM care_tips
         WHERE lower(plant_type) = lower(?) OR lower(plant_type) = lower(?)
         ORDER BY care_category`,
        [plantType, plant.species || plantType]
      )
    ]);

    // Parse AI response to extract key information
    let detectedIssue = 'Plant health concern';
    let severity = 'Medium';
    let recommendations = aiRecommendations || 'Please consult with a local gardening expert.';

    if (aiRecommendations) {
      const lines = aiRecommendations.split('\n').filter(l => l.trim());
      if (lines.length > 0) {
        detectedIssue = lines[0].replace(/^[*#\d.\s]+/, '').trim().slice(0, 120);
      }
      if (aiRecommendations.toLowerCase().includes('high')) severity = 'High';
      else if (aiRecommendations.toLowerCase().includes('low')) severity = 'Low';
    } else if (matchedDiseases.length > 0) {
      // Fall back to knowledge base if Ollama fails
      detectedIssue = matchedDiseases[0].name;
      severity = matchedDiseases[0].severity_level;
      recommendations = matchedDiseases[0].organic_remedies;
    }

    // Save analysis to database
    const analysisResult = await dbRun(
      `INSERT INTO plant_analysis (plant_id, symptoms, detected_issue, severity, recommendations, image_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [plant_id, symptoms, detectedIssue, severity, recommendations, imageUrl]
    );

    res.status(201).json({
      success: true,
      analysisId: analysisResult.lastID,
      plantInfo: {
        name: plant.name,
        type: plant.type,
        species: plantSpecies,
        plantIdentification: plantIdentification
      },
      analysis: {
        detectedIssue,
        severity,
        symptoms: symptoms || 'Image analysis performed',
        recommendations
      },
      knowledgeBase: {
        matchedDiseases: matchedDiseases.map(d => ({
          name: d.name,
          description: d.description,
          organicRemedies: d.organic_remedies,
          preventionTips: d.prevention_tips,
          severityLevel: d.severity_level
        })),
        careTips: careTips.map(t => ({
          category: t.care_category,
          tip: t.tip,
          frequency: t.frequency
        }))
      }
    });
  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get analysis history for a plant (MUST be before generic /:analysisId route)
router.get('/plant/:plantId', async (req, res) => {
  try {
    const { plantId } = req.params;

    const history = await dbAll(
      'SELECT * FROM plant_analysis WHERE plant_id = ? ORDER BY created_at DESC',
      [plantId]
    );

    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single analysis result (MUST be LAST - generic catch-all route)
router.get('/:analysisId', async (req, res) => {
  try {
    const { analysisId } = req.params;

    const analysis = await dbGet(
      'SELECT * FROM plant_analysis WHERE id = ?',
      [analysisId]
    );

    if (!analysis) {
      return res.status(404).json({ success: false, error: 'Analysis not found' });
    }

    res.json({ success: true, data: analysis });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
