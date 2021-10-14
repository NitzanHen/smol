import {region} from "firebase-functions";
import {initializeApp} from "firebase/app";
import {collection, doc, getDoc, getFirestore} from "firebase/firestore";
import firebaseConfig from "./firebase-config.json";

initializeApp(firebaseConfig);
const db = getFirestore();

const urls = collection(db, "urls");

export const redirect = region("europe-west1")
    .https.onRequest(async (req, res) => {
      try {
        const urlId = req.params[0];
        if (!urlId || urlId === "/") {
          res.status(400).send("Specify a url");
          return;
        }

        const docRef = doc(urls, urlId);
        const docSnap = await getDoc(docRef);

        const url = docSnap.get("url");

        if (!url) {
          res.sendStatus(404);
          return;
        } else if (typeof url !== "string") {
          throw new Error("unexpected non-string url");
        }

        res.redirect(301, url);
      } catch (e) {
        console.error(e);
        res.sendStatus(500);
      }
    });
