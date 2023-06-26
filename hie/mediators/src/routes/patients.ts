import express from 'express';
import { FhirApi } from '../lib/utils';
import { parseFhirPatient, Patient } from '../lib/resources';
import { ParsedQs } from 'qs'

export const router = express.Router();

router.use(express.json());

// get patient information by crossborder ID
router.get('/', async (req, res) => {
    try {
        let _queryParams: ParsedQs = req.query;
        let queryParams: Record<string, any> = { ..._queryParams }
        let { id, crossBorderId, identifier } = req.query;
        let params = []
        for (const k of Object.keys(queryParams)) {
            params.push(`${encodeURIComponent(k)}=${encodeURIComponent(queryParams[k])}`);
        }

        let patient = (await FhirApi({ url: `/Patient?${params.join("&")}` })).data;
        if (patient) {
            res.statusCode = 200;
            if (identifier) {
                patient = patient.total > 0 ? patient.entry[0].resource : patient;
                res.json(patient);
                return;
            }
            res.json(patient);
            return;
        }
        res.statusCode = 404;
        res.json({
            "resourceType": "OperationOutcome",
            "id": "exception",
            "issue": [{
                "severity": "error",
                "code": "exception",
                "details": {
                    "text": "Failed to register patient. CrossBorder patient not found"
                }
            }]
        });
        return;
    } catch (error) {
        res.statusCode = 400;
        console.log(error);
        res.json({
            "resourceType": "OperationOutcome",
            "id": "exception",
            "issue": [{
                "severity": "error",
                "code": "exception",
                "details": {
                    "text": `Failed to register patient. ${JSON.stringify(error)}`
                }
            }]
        });
        return;
    }
})


// create or register a new patient
router.post('/', async (req, res) => {
    try {
        let data = req.body;
        console.log(data);
        let patient = (await FhirApi({
            url: `/Patient`,
            data: JSON.stringify(data),
            method: 'POST'
        })).data;
        if (patient.id) {
            res.statusCode = 200;
            res.json(patient);
            return;
        }
        res.statusCode = 400;
        res.json(patient);
        return;
    } catch (error) {
        res.statusCode = 400;
        console.log(error);
        res.json({
            "resourceType": "OperationOutcome",
            "id": "exception",
            "issue": [{
                "severity": "error",
                "code": "exception",
                "details": {
                    "text": "Failed to find patient. Check the resource and try again"
                }
            }]
        });
        return;
    }
});


//update patient details
router.put('/', async (req, res) => {
    try {
        let data = req.body;
        let crossBorderId = req.query.identifier || null;
        if (!crossBorderId) {
            let error = "crossBorderId is a required parameter"
            res.statusCode = 400;
            res.json({
                "resourceType": "OperationOutcome",
                "id": "exception",
                "issue": [{
                    "severity": "error",
                    "code": "exception",
                    "details": {
                        "text": `Failed to update patient. ${JSON.stringify(error)}`
                    }
                }]
            });
            return;
        }

        let patient = data;
        let fhirId = patient.id;
        let updatedPatient = (await FhirApi({
            url: `/Patient/${fhirId}`,
            method: "PUT",
            data: JSON.stringify({ ...data, id: fhirId })
        }))
        console.log(updatedPatient)
        res.statusCode = 200;
        res.json(updatedPatient.data);
        return;
    } catch (error) {
        console.error(error);
        res.statusCode = 400;
        res.json({
            "resourceType": "OperationOutcome",
            "id": "exception",
            "issue": [{
                "severity": "error",
                "code": "exception",
                "details": {
                    "text": `Failed to update patient- ${JSON.stringify(error)}`
                }
            }]
        });
        return;
    }
});

export default router;