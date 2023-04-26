const express = require('express')
const Student = require('../models/student.js')
const Company = require('../models/company.js')

const router = express.Router()

router.get('/', (req, res) => {
    res.send('This is the student route')
})

// Create Student
router.post('/create', async (req, res) => {
    try {
        const body = req.body;

        const student = await Student.create(body)

        res.status(201).json({
            success: true,
            message: "Successfully created student profile"
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
})

// Add Student to company
router.post('/apply', async (req, res) => {
    try {
        const student = await Student.findOne({ email: req.body.studentEmail})
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student does not exist'
            })
        }

        const company = await Company.findOneAndUpdate(
            { email: req.body.companyEmail },
            { $push: { studentsApplied: { 
                studentEmail: req.body.studentEmail, 
                status: 'Applied' 
            } } },
            { new: true } // to return the updated document
        );

        res.status(201).json({
            success: true,
            message: 'Student applied successfully', 
            company
        })
    } catch (err) {
        res.status(501).json({
            success: false,
            message: error.message
        })
    }
});

module.exports = router