const express = require('express')
const bcrypt = require('bcryptjs')

const Student = require('../models/student.js')
const Company = require('../models/company.js')

const router = express.Router()
const saltRounds = 5;


router.get('/', (req, res) => {
    res.send('This is the student route')
})

// Create Student
router.post('/create', async (req, res) => {
    try {
        const student = await Student.findOne({ email: req.body.email })
        if (student) {
            return res.status(404).json({
                success: false,
                message: 'User with same email exists'
            })
        }

        bcrypt.hash(req.body.password, saltRounds, async (hashError, hash)=>{
            if (hashError) {
                return res.status(404).json({
                    success: false,
                    message: hashError.message
                })
            }

            const student = await Student.create({...req.body, password: hash})

            res.status(201).json({
                success: true,
                message: "Successfully created student profile"
            })
        });        
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
})

// Login Student
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

        const student = await Student.findOne({ email })

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'No such student exists'
            })
        }

        bcrypt.compare(password, student.password, (error, result) => {
            if (result === true) {
                return res.status(201).json({
                    success: true,
                    message: 'Login successfully',
                    student
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