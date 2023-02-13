const express = require("express")
const router = express.Router()
const db = require("./db")

// ------------------------ TRANSAKSI ------------------------ //

// end-point menambahkan data pelanggaran siswa
router.post("/pelanggaran_siswa", (req, res) => {
    // prepare data to pelanggaran_siswa
    let data = {
        id_siswa: req.body.id_siswa,
        id_user: req.body.id_user,
        waktu: moment().format('YYYY-MM-DD HH:mm:ss') //get current time
    }

    // parse to JSON
    let pelanggaran =   JSON.parse(req.body.pelanggaran)

    // create query insert to pelanggaran_siswa
    let sql = "insert into pelanggaran_siswa set ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null

        if(error){
            res.json({message: error.message})
        } else {

            // get last inserted id_pelanggaran
            let lastID = result.insertID

            // prepare data to detail_pelanggaran
            let data = []
            for (let index = 0; index < pelanggaran.length; index++) {
                data.push([
                    lastID, pelanggaran[index].id_pelanggaran
                ])
            }

            // create query insert detail_pelanggaran
            let sql = "insert into detail_pelanggaran_siswa values ?"

            db.query(sql, [data], (error, result ) => {
                if(error){
                    res.json({message: error.message})
                } else {
                    res.json({message: "Data has been inserted"})
                }
            })
        }
    })
})
    
// end-point menampilkan data pelanggaran siswa
router.get("/pelanggaran_siswa", (req,res) => {
    // create sql query
    let sql = "select pelanggaran_siswa.id_pelanggaran_siswa, pelanggaran_siswa.id_siswa, pelanggaran_siswa.waktu, siswa.nis, siswa.nama_siswa, pelanggaran_siswa.id_user, user.nama_user " + 
    "from pelanggaran_siswa pelanggaran_siswa join siswa siswa on pelanggaran_siswa.id_siswa = siswa.id_siswa " +
    "join user user on pelanggaran_siswa.id_user = user.id_user"

    //run query
    db.query(sql, (error, result) => {
        if (error) {
            res.json({ message: error.message})
        }else{
            res.json({
                count:result.length,
                pelanggaran_siswa: result
            })  
        }
    })
})

// end-point untuk menghapus data pelanggaran

router.delete("/pelanggaran_siswa/:id_pelanggaran_siswa", (req,res) => {
    let param = { id_pelanggaran_siswa: req.params.id_pelanggaran_siswa }

    // create sql query delete detail_pelanggaran
    let sql = "delete from detail_pelanggaran_siswa where ?"

    db.query(sql, param, (error, result) => {
        if(error){
            res.json({message: error.message})
        }else{
            let param = { id_pelanggaran_siswa: req.params.id_pelanggaran_siswa}

            // create sql query delete detail_pelanggaran
            let sql = "delete from pelanggaran_siswa where ?"

            db.query(sql, param, (error, result) => {
                if(error){
                    res.json({message: error.message})
                }else{
                    res.json({message: "Data has been deleted"})
                }
            })
        }
    })
})

module.exports = router