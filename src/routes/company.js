const express = require('express')
const bcrypt = require('bcryptjs')

const Company = require('../models/company.js')
const Student = require('../models/student.js')

const router = express.Router()
const saltRounds = 5;

router.get('/', (req, res) => {
    res.send('This is the company route')
})

// Create Company
router.post('/create', async (req, res) => {
    try {
        const company = await Company.findOne({ email: req.body.email })
        if (company) {
            return res.status(404).json({
                success: false,
                message: 'Company with same email exists'
            })
        }

        bcrypt.hash(req.body.password, saltRounds, async (hashError, hash)=>{
            if (hashError) {
                return res.status(404).json({
                    success: false,
                    message: hashError.message
                })
            }

            const newCompany = await Company.create({...req.body, password: hash})

            res.status(201).json({
                success: true,
                message: "Successfully created company profile",
                company: newCompany
            })
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// Login Company
router.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (email.length === 0 || password.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Enter the details correctly'
            })
        }

        const company = await Company.findOne({ email })

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'No such company exists'
            })
        }

        bcrypt.compare(password, company.password, (error, result) => {
            if (result === true) {
                return res.status(201).json({
                    success: true,
                    message: 'Login successfully',
                    company
                })
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Password entered was incorrect'
                })
            }
        })
    } catch (error) {
        res.status(501).json({
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