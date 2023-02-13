const express = require("express")
const router = express.Router()
const db = require("./db")
const multer = require("multer") //upload file
const path = require("path") //memanggil path diktori
const fs = require("fs") //untuk manajemen file

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

// ------------------------ CRUD PELANGGARAN  ------------------------ //

router.get("/pelanggaran", (req,res) => {
    let sql = "select * from pelanggaran" 

    db.query(sql, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message 
            }
        } else {
            response = {
                count: result.length, 
                pelanggaran: result 
            }
        }
        res.json(response) 
    })
})

// end-point akses data siswa berdasarkan id_siswa tertentu
router.get("/pelanggaran/:id_pelanggaran", (req, res) => {
    let data = {
        id_pelanggaran: req.params.id_pelanggaran
    }
    // create sql query
    let sql = "select * from pelanggaran where id_pelanggaran" // mengambil data dari tabel pelanggaran berdasarkan id_pelanggaran

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message //pesan error
            }
        } else { 
            response = {
                count: result.length, //jumlah data
                pelanggaran: result //isi data
            }
        }
        res.json(response) //send response
    })
})

// end-point menyimpan data siswa
router.post("/pelanggaran", upload.single("image"), (req,res) => { 
    // prepare data
    let data = {
        nama_pelanggaran: req.body.nama_pelanggaran,
        poin: Number(req.body.poin),
        image: req.file.filename
    }

    if(!req.file){
        // jika tidak ada file yang diupload
        res.json({
            message: "tidak ada file yang dikirim"
        })
    } else {
        // create sql query insert
        let sql = "insert into pelanggaran set ?"
    
        // run query
        db.query(sql, data, (error,result) => {
            if (error) throw error
            res.json({
                message: result.affectedRows + " data inserted"
            })
        })
    }
})

// end-point mengubah data siswa
router.put("/pelanggaran", upload.single("image"), (req,res) => {
    let data = null, sql = null
    let param = { id_pelanggaran: req.body.id_pelanggaran }

    if(!req.file){
        data = {
            nama_pelanggaran: req.body.nama_pelanggaran,
            poin: Number(req.body.poin)
            // image: req.file.filename
        }
    } else {
        data = {
            nama_pelanggaran: req.body.nama_pelanggaran,
            poin: Number(req.body.poin),
            image: req.file.filename
        }

        sql = "select * from pelanggaran where ?"

        db.query(sql, param, (err, result) => {
            if(err) throw err
            let filename = result[0].image

            let dir = path.join(__dirname, "image", filename)
            fs.unlink(dir, (error) => {})
        })
    }

    sql = "update pelanggaran set ? where ?"

    db.query(sql, [data,param], (error, result) => {
        if(error){
            res.json({
                message: error.message
            })
        } else {
            res.json({
                message: result.affectedRows + " data updated"
            })
        }
    })
})

// end-point menghapus data siswa berdasarkan id_siswa
router.delete("/pelanggaran/:id_pelanggaran", (req, res) => {
    // prepare data
    let data = {
        id_pelanggaran: req.params.id_pelanggaran
    }

    // create query sql delete
    let sql = "delete from pelanggaran where ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if(error){
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data deleted"
            }
        }
        res.json(response)
    })
})

module.exports = router