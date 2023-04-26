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

// Add Student to company and add company to student
router.post('/apply', async (req, res) => {
    try {
        const studentEmail = req.body.studentEmail;
        const companyEmail = req.body.companyEmail;

        const updatedStudent = await Student.findOneAndUpdate(
            { email: studentEmail },
            { $push: { companiesApplied: {
                companyEmail: companyEmail,
                status: 'Applied'
            } } },
            { new: true } // to return the updated document
        )
        if (!updatedStudent) {
            return res.status(404).json({
                success: false,
                message: 'Student does not exist'
            })
        }

        const updatedCompany = await Company.findOneAndUpdate(
            { email: companyEmail },
            { $push: { studentsApplied: { 
                studentEmail: studentEmail, 
                status: 'Applied' 
            } } },
            { new: true } // to return the updated document
        );
        if (!updatedCompany) {
            return res.status(404).json({
                success: false,
                message: 'Company does not exist'
            })
        }

        res.status(201).json({
            success: true,
            message: 'Student applied successfully', 
            updatedCompany,
            updatedStudent
        })
    } catch (err) {
        res.status(501).json({
            success: false,
            message: error.message
        })
    }
});

module.exports = router