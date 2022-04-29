const db = require('../db/connect')

const getAllStorageData = async (req, res) => {
    db.database().ref('/StorageData').once('value', (snapshot) => {
        res.status(200).send(snapshot.val())
    })
}

const updatePinNumbers = async (req, res) => {
    let storageID = "sdfajhsglk"
    let pin = []
    db.database().ref(`/${storageID}/PIN`).once('value', (snapshot) => {
        // let storagePIN = 2345
        // pin = snapshot.val()
        // console.log(snapshot.val())
        // let status = pin.includes(storagePIN)

        // if (status) {
        //     const index = pin.indexOf(storagePIN)
        //     if (index > -1) {
        //         pin.splice(index, 1)
        //     }
        // }
        // res.status(200).send(pin)

        var test = {}
        test = snapshot.val()

        res.status(200).send(snapshot.val())
    })
}

const putPIN = async (req, res) => {
    let storageID = "sdfajhsglk"
    let pin = {
        "234523": { "dayCreated": 243298098, "requestID": 22355 },
        "230504": {"dayCreated": 23985908, "requestID": 250925}}

    db.database().ref('/' + storageID).set({
        PIN: pin,
        storageName: "STORAGE 3",
        isUnlock: false,
        depth: 23.34
    }, (error) => {
        if (error) {
            res.status(500).send(`error while uploading the data ${error}`)
        } else {
            res.status(200).send('success adding the data')
        }
    })
}

module.exports = {
    getAllStorageData,
    updatePinNumbers,
    putPIN
}