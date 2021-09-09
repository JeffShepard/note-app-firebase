const functions = require("firebase-functions");
const admin = require("firebase-admin");


const express = require("express");
const app = express();

admin.initializeApp();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

app.get("/notes", (req, res) => {
  admin
      .firestore()
      .collection("Notes")
      .orderBy("createdAt", "desc")
      .get()
      .then((data) => {
        const notes = [];
        data.forEach((doc) => {
          console.log(doc);
          notes.push({
            noteID: doc.id,
            body: doc.data().body,
            userHandle: doc.data().userHandle,
            createdAt: doc.data().createdAt,
            title: doc.data().title,
            id: doc.data().id,
          });
        });
        return res.json(notes);
      })
      .catch((err) => console.log(err));
});

app.get("/notes/:noteID", (req, res) => {
  // res.set("Access-Control-Allow-Origin", "*");
  admin
      .firestore()
      .collection("Notes").doc(req.params.noteID).get()
      .then((data) => {
        return res.json(data);
      })
      .catch((err) => console.log(err));
});

app.post("/note", (req, res) => {
  const newNote = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString(),
    title: new Date().toISOString(),
    id: req.body.id,
  };

  admin
      .firestore()
      .collection("Notes")
      .add(newNote)
      .then((doc) => {
        res.json({message: `document ${doc.id} created successfully`});
      })
      .catch((err) => {
        res.status(500).json("Something went wrong");
        console.error(err);
      });
});

// app.delete("/notes/:noteID", (req, res) => {
//   admin
//       .firestore()
//       .collection("Notes").doc(req.params.noteID).delete()
//       .then(()=>res.status(204).send("Document successfully deleted!"))
//       .catch(function(error) {
//         res.status(500).send(error);
//       });
// });

exports.api = functions.https.onRequest(app);
