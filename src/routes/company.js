const express = require('express')
const Company = require('../models/company.js')
const Student = require('../models/student.js')

const router = express.Router()

router.get('/', (req, res) => {
    res.send('This is the company route')
})

// Create Company
router.post('/create', async (req, res) => {
    try {
        const body = req.body
        const company = await Company.create(body)

        res.status(201).json({
            success: true,
            message: "Successfully created a company"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// Accept/Reject the Student
router.put('/application', async (req, res) => {
    try {
        const companyEmail = req.body.companyEmail;
        const studentEmail = req.body.studentEmail;
        const status = req.body.status;

        // Find the company by email
        // const company = await Company.findOne({ email: companyEmail });
        const updatedCompany = await Company.findOneAndUpdate(
            { email: companyEmail, "studentsApplied.studentEmail": studentEmail },
            { $set: { "studentsApplied.$.status": status } },
            { new: true }
        )
        if (!updatedCompany) {
            return res.status(404).json({ success: false, message: "Company not found." });
        }

        // Find the student by email and update the status for the given company
        const updatedStudent = await Student.findOneAndUpdate(
            { email: studentEmail, "companiesApplied.companyEmail": companyEmail },
            { $set: { "companiesApplied.$.status": status } },
            { new: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ success: false, message: "Student not found." });
        }

        return res.json({
            success: true,
            message: "Application status successfully updated",
            updatedStudent
        });
    } catch (error) {
        res.status(505).json({
            success: false,
            message: error.message
        })
    }
});


module.exports = router