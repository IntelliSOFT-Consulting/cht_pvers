import express from "express";

import { findPossibleMatches, linkRecords, mergeRecords } from "../lib/patientMatching";
import { FhirApi } from '../lib/utils';
import { parseFhirPatient } from "../lib/resources";



const router = express.Router()
router.use(express.json());


// get patient information by crossborder ID
router.post('/', async (req, res) => {
    try {
        let { operation } = req.query;
        console.log(req.body);
        let { goldenRecord, sourceRecord, from, to } = req.body;
        switch (operation) {
            case "findPossibleMatches":
                let possibleMatches = await findPossibleMatches(50);
                console.log(possibleMatches);
                res.json({ status: "success", possibleMatches });
                return;
            case "createLink":
                let links = await linkRecords(goldenRecord, sourceRecord);
                // console.log(possibleMatches);
                res.json({ status: "success", response: links });
                return;
            case "mergeRecords":
                let merged = await mergeRecords(from, to);
                // console.log(possibleMatches);
                res.json({ status: "success", response: merged });
                return;
            default:
                res.statusCode = 400;
                res.json({ status: "error", "error": "parameter *operation* is required" });
                return;
        }
    } catch (error) {
        res.statusCode = 400;
        console.log(error);
        res.json({ status: "error", error });
        return;
    }
})



export default router