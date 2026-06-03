import { Router } from 'express';
import { getTop10, insertScore } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    res.json(getTop10());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', (req, res) => {
  const { name, score } = req.body;
  if (!name || typeof score !== 'number') {
    return res.status(400).json({ error: 'name and score are required' });
  }
  try {
    const result = insertScore(name.trim().slice(0, 20), score);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
