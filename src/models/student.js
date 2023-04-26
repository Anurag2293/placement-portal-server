const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    rollNo: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    cgpa: {
        type: Number,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    resumeLink: {
        type: String,
        required: true
    },
    companiesApplied: [{
        companyEmail: String,
        status: String
    }]
})

const Student = mongoose.model('Student', studentSchema)

module.exports = Student