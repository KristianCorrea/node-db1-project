const express = require("express")
const db = require("../../data/dbConfig.js");
const { where } = require("../../data/dbConfig.js");
const router = express.Router();

router.get("/", (req, res) => {
    db.select("*")
        .from("accounts")
    .then(accounts => {
        res.status(200).json(accounts)
    })
    .catch(error => {
        handleError(error, res)
    })
})

router.post("/", (req, res) => {
    const newAccount = req.body;


    db("accounts")
        .insert(newAccount, "id")
        .then(newAccountID => {
            db("accounts")
                .where({ id: newAccountID[0] })
                .first()
                .then(newAccount => {
                    res.status(200).json(newAccount)
                })
        })
        .catch(error => {
            handleError(error, res)
        })
})

router.delete("/:id", (req, res) => {
    const id = req.params.id;

    db("accounts")
        .where({id})
        .del()
        .then(count => {
            if(count > 0) {
                res.status(200).json(count)
            } else {
                res.status(404).json({ message: "There was no record to delete"})
            }
        })
        .catch(error=>{
            handleError(error, res)
        })

})

router.put("/:id", (req, res) => {
    const id = req.params.id;
    const changes = req.body;

    db("accounts")
        .where({id})
        .update(changes)
        .then(count => {
            // count is the number of records updated
            if (count > 0) {
                res.status(200).json(count)
            } else {
                res.status(404).json({ message: "there was no record to update"})
            }
        })
        .catch(error=>{
            handleError(error, res)
        })
})
function handleError(error, res) {
    console.log("error", error);
    res.status(500).json({ message: error.message })
}

module.exports = router;