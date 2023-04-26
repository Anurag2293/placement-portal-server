const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    jobProfile : {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    compensation: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    minCGPA: {
        type: Number,
        default: 0
    },
    studentsApplied: [{
        studentEmail: String,
        status: String
    }]
})

const Company = mongoose.model('Company', companySchema)

module.exports = Company