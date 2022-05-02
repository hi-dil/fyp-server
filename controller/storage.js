const db = require('../db/connect')

const getAllStorageData = async (req, res) => {
    db.database().ref('/StorageData').once('value', (snapshot) => {
        res.status(200).send(snapshot.val())
    })
}

const updatePinNumbers = async (req, res) => {
    let storageID = "SfbClQ6PRR9UKREP5BwO"
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

        res.status(200).send(test)
    })
}

const validatePIN = async (req, res) => {
    const { retrievedPin, storageID } = req.body
    const { authorization } = req.headers

    if (authorization === "haidil272") {
        db.database().ref(`/${storageID}`).once('value', (snapshot) => {
            test = snapshot.val()
            const { PIN, storageName, isUnlock, depth } = test

            if (PIN[retrievedPin] !== undefined) {
                const { dayCreated, requestID } = PIN[retrievedPin]
                const now = Date.now()
                const dayInMilli = 86400000

                if (now - dayCreated < dayInMilli) {
                    db.database().ref(`/${storageID}`).set({
                        PIN: PIN,
                        storageName: storageName,
                        isUnlock: true,
                        depth: depth
                    }, (error) => {
                        if (error) {
                            res.send(false)
                        } else {
                            res.send(true)
                        }
                    })

                } else {
                    res.send(false)
                }
            } else {
                res.send(false)
            }
        })
    } else {
        res.status(403).send("Forbidden")
    }
}

const putPIN = async (req, res) => {
    let storageID = "SfbClQ6PRR9UKREP5BwO"
    const now = Date.now()
    let pin = {
        "234523": { "dayCreated": now, "requestID": "22355" },
        "230504": { "dayCreated": 23985908, "requestID": "250925" },
        "985294": { "dayCreatd": 252452452452, "requestID": "08345430985" }
    }

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
    putPIN,
    validatePIN
}