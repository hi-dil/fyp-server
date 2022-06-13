const { admin, firestore } = require("../db/connect");
const db = admin;
const storage = "SfbClQ6PRR9UKREP5BwO";

const getAllStorageData = async (req, res) => {
  db.database()
    .ref(`/${storage}`)
    .once("value", (snapshot) => {
      var value = snapshot.val();
      res.send(value);
    });
};

const updatePinNumbers = async (req, res) => {
  let storageID = "SfbClQ6PRR9UKREP5BwO";
  db.database()
    .ref(`/${storageID}/PIN`)
    .once("value", (snapshot) => {
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

      var test = {};
      test = snapshot.val();

      res.status(200).send(test);
    });
};

const validatePIN = async (req, res) => {
  const { retrievedPin, storageID } = req.body;
  const { authorization } = req.headers;

  if (authorization === "haidil272") {
    db.database()
      .ref(`/${storageID}`)
      .once("value", (snapshot) => {
        test = snapshot.val();
        const { PIN, storageName, isUnlock, depth } = test;

        if (PIN[retrievedPin] !== undefined) {
          const { dayCreated } = PIN[retrievedPin];
          const now = Date.now();
          const dayInMilli = 86400000;

          if (now - dayCreated < dayInMilli) {
            // db.database().ref(`/${storageID}`).set({
            //     PIN: PIN,
            //     storageName: storageName,
            //     isUnlock: true,
            //     depth: depth
            // }, (error) => {
            //     if (error) {
            //         res.send(false)
            //     } else {
            //         res.send(true)
            //     }
            // })
            res.status(200).send(true);
          } else {
            res.status(500).send(false);
          }
        } else {
          res.status(500).send(false);
        }
      });
  } else {
    res.status(403).send("Forbidden");
  }
};

const motionDetected = async (req, res) => {
  const { retrievedPin, storageID } = req.body;
  const { authorization } = req.headers;

  if (authorization === "haidil272") {
    db.database()
      .ref(`/${storageID}`)
      .once("value", (snapshot) => {
        var value = snapshot.val();
        const { PIN, storageName, isUnlock, depth } = value;

        if (PIN[retrievedPin] !== undefined) {
          const { dayCreated } = PIN[retrievedPin];
          const now = Date.now();
          const dayInMilli = 86400000;

          const { requestID, requestType } = PIN[retrievedPin];
          delete PIN[retrievedPin];

          if (now - dayCreated < dayInMilli) {
            db.database()
              .ref(`/${storageID}`)
              .set(
                {
                  PIN: PIN,
                  storageName: storageName,
                  isUnlock: false,
                  depth: depth,
                },
                (error) => {
                  if (error) {
                    res.send(false);
                  }
                }
              );

            if (requestType == "claim") {
              updateClaim(storageID, requestID);
            } else if (requestType == "donation") {
              updateDonation(storageID, requestID);
            }

            res.status(200).send(true);
          } else {
            res.status(500).send("time");
          }
        } else {
          res.status(500).send(false);
        }
      });
  } else {
    res.status(403).send("Forbidden");
  }
};

const getcurrentpin = async (req, res) => {
  const { storageID } = req.body;

  await db
    .database(storageID)
    .ref()
    .child("/currentPIN")
    .once("value", (snapshot) => {
      var value = snapshot.val();
      res.status(200).send(value.toString());
    });
};

const putPIN = async (req, res) => {
  let storageID = "SfbClQ6PRR9UKREP5BwO";
  const now = Date.now();
  let pin = {
    234523: {
      dayCreated: now,
      requestID: "z7KxSBjxA4GSf9dfv8YI",
      requestType: "donation",
    },
    230504: {
      dayCreated: now,
      requestID: "z7KxSBjxA4GSf9dfv8YI",
      requestType: "donation",
    },
    985294: {
      dayCreated: now,
      requestID: "z7KxSBjxA4GSf9dfv8YI",
      requestType: "donation",
    },
    235921: {
      dayCreated: now,
      requestID: "TJIueJyl4ZiinFtgpliQ",
      requestType: "claim",
    },
    925382: {
      dayCreated: now,
      requestID: "TJIueJyl4ZiinFtgpliQ",
      requestType: "claim",
    },
    523895: {
      dayCreated: now,
      requestID: "TJIueJyl4ZiinFtgpliQ",
      requestType: "claim",
    },
  };

  db.database()
    .ref("/" + storageID)
    .set(
      {
        PIN: pin,
        storageName: "STORAGE 3",
        isUnlock: false,
        depth: 23.34,
      },
      (error) => {
        if (error) {
          res.status(500).send(`error while uploading the data ${error}`);
        } else {
          res.status(200).send("success adding the data");
        }
      }
    );
};

const testFirestore = async (req, res) => {
  const snapshot = await firestore.collection("foodBank").get();
  var docs = [];
  snapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
    const test = doc.data();
    test["id"] = doc.id;
    docs.push(test);
  });

  const update = await firestore
    .collection("foodBank")
    .doc("9pXxjjlp6hYRqXI9IA39");
  const response = await update.update({ test: "connected..." });
  res.send(response);
};

async function updateClaim(storageID, requestID) {
  const snapshot = await firestore.collection("request").doc(requestID).get();
  const snapshotStorage = await firestore
    .collection("foodBankStorage")
    .doc(storageID)
    .get();

  const request = snapshot.data();
  const snapshotFoodBank = await firestore
    .collection("foodBank")
    .doc(request["foodBankID"])
    .get();

  const storageInfo = snapshotStorage.data();
  const foodBankInfo = snapshotFoodBank.data();

  const requestItem = request["items"];
  const foodBankStorage = foodBankInfo["storage"];
  var amountTook = 0;

  requestItem.forEach((item) => {
    if (storageID == item["storageID"]) {
      item["completed"] = true;
      amountTook = item["itemQuantity"];
      item["lastUpdate"] = Date.now();
    }
  });

  foodBankStorage.forEach((storageUpdate) => {
    if (storageID == storageUpdate["id"]) {
      storageUpdate["amountClaimed"] += amountTook;
    }
  });

  const accessHistoryUpdate = {
    userName: request["userName"],
    userID: request["userID"],
    amountTook: amountTook,
    lastVisited: Date.now(),
    userImage: request["userImage"],
    requestType: "claim",
  };

  const accessUpdate = storageInfo["accessHistory"];
  accessUpdate.push(accessHistoryUpdate);
  console.log(accessUpdate);

  await firestore
    .collection("foodBank")
    .doc(request["foodBankID"])
    .update({ storage: foodBankStorage });
  await firestore
    .collection("foodBankStorage")
    .doc(storageID)
    .update({ accessHistory: accessUpdate });
  await firestore
    .collection("request")
    .doc(requestID)
    .update({ items: requestItem });
}

async function updateDonation(storageID, requestID) {
  const snapshotRequest = await firestore
    .collection("donationRequest")
    .doc(requestID)
    .get();

  const snapshotStorage = await firestore
    .collection("foodBankStorage")
    .doc(storageID)
    .get();

  const request = snapshotRequest.data();
  const storageInfo = snapshotStorage.data();

  const foodbankID = request["foodBankID"];
  const snapshotFoodBank = await firestore
    .collection("foodBank")
    .doc(foodbankID)
    .get();

  const foodbankInfo = snapshotFoodBank.data();

  foodbankStorage = foodbankInfo["storage"];
  const requestItem = request["items"];


  request["lastUpdate"] = Date.now();
  
  var amountTook = 0;
  requestItem.forEach((item) => {
    if (storageID == item["storageID"]) {
      item["completed"] = true;
      amountTook = item["itemQuantity"];
      item["lastUpdate"] = Date.now();
    }
  });

  foodbankStorage.forEach((item) => {
    if (storageID == item["id"]) {
      item["itemQuantity"] += amountTook;
    }
  });

  const accessHistoryUpdate = {
    userName: request["userName"],
    userID: request["userID"],
    amountTook: amountTook,
    lastVisited: Date.now(),
    userImage: request["userImage"],
    requestType: "donation",
  };

  const accessUpdate = storageInfo["accessHistory"];
  accessUpdate.push(accessHistoryUpdate);

  await firestore
    .collection("foodBank")
    .doc(foodbankID)
    .update({ storage: foodbankStorage });

  await firestore
    .collection("foodBankStorage")
    .doc(storageID)
    .update({ accessHistory: accessUpdate });

  await firestore
    .collection("donationRequest")
    .doc(requestID)
    .update({ items: requestItem });
}

module.exports = {
  getAllStorageData,
  updatePinNumbers,
  putPIN,
  validatePIN,
  motionDetected,
  getcurrentpin,
  testFirestore,
};
