const express = require('express');
const cors = require('cors')
require('./src/db/mongoose.js')
const companyRouter = require('./src/routes/company.js')
const studentRouter = require('./src/routes/student.js')

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())
app.use('/company', companyRouter)
app.use('/student', studentRouter)

app.get('/', (req, res) => {
    res.send("Hello this is Anurag")
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})