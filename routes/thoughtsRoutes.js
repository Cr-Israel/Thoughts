const express = require('express');
const router = express.Router();
const ThoughtController = require('../controllers/ThoughtController');
const checkAuth = require('../helpers/auth').checkAuth;

router.get('/add', checkAuth, ThoughtController.addThought);
router.post('/add', checkAuth, ThoughtController.addThoughtSave);
router.get('/dashboard', checkAuth, ThoughtController.dashboard);
router.get('/edit/:id', checkAuth, ThoughtController.updateThought);
router.post('/edit', checkAuth, ThoughtController.updateThoughtSave);
router.post('/remove', checkAuth, ThoughtController.removeThought);
router.get('/', ThoughtController.showThoughts);

module.exports = router;