const express = require('express');
const router = express.Router();
// Individual Routes Import
const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');
const organizationRoutes = require('./organizationRoutes');
const aboutRoutes = require('./aboutRoutes');
const serviceRoutes = require('./serviceRoutes');
const teamRoutes = require('./teamMemberRoutes');
const projectRoutes = require('./projectRoutes');
const contactMessageRoutes = require('./contactMessageRoutes');
const attendanceRoutes = require('./attendanceRoutes');

// Base Paths
router.use('/auth', authRoutes);
router.use('/user', adminRoutes);              
router.use('/organization', organizationRoutes); 
router.use('/about', aboutRoutes);  
router.use('/service', serviceRoutes);
router.use('/team', teamRoutes);
router.use('/project', projectRoutes);
router.use('/contact', contactMessageRoutes);
router.use('/attendance', attendanceRoutes);

module.exports = router;