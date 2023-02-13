// inisiasi library
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const moment = require("moment")
const multer = require("multer") //upload file
const path = require("path") //memanggil path diktori
const fs = require("fs") //untuk manajemen file
const app = express()
const siswaroute = require("./siswa")
const userroute = require ("./user")
const pelanggaranroute = require("./pelanggaran")
const transaksiroute = require("./transaksi")

// implementation
app.use(cors())
app.use(express.static(__dirname))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(siswaroute)
app.use(userroute)
app.use(pelanggaranroute)
app.use(transaksiroute)

// membuat variabel untuk konfigurasi proses upload file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // set file storage
        cb(null, './image')
    },
    fileName: (req, file, cb) => {
        // generate file name
        cb(null, "image-"+ Date.now() + path.extname(file.originalname))
    }
})

let upload = multer({storage: storage})

app.listen(18000, () => {
    console.log("Run on port 8000")
})
