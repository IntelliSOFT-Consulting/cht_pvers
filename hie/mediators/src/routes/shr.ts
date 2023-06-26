import express from 'express';
import { generatePatientReference, _supportedResources } from '../lib/resources';
import { FhirApi } from '../lib/utils';
import { validateResource } from '../lib/validate';


export const router = express.Router();

router.use(express.json());


const supportedResources = ['Observation', 'Practitioner', 'Encounter', 'Patient', 'Subscription'];


// get patient information
router.post('/:resourceType', async (req, res) => {
    try {
        let resource = req.body;
        let { resourceType } = req.params;
        if (supportedResources.indexOf(resourceType) < 0) {
            res.statusCode = 400;
            let error = `Invalid or unsupported FHIR Resource`;
            res.json({
                "resourceType": "OperationOutcome",
                "id": "exception",
                "issue": [{
                    "severity": "error", "code": "exception",
                    "details": { "text": error }
                }]
            });
            return;
        }

        let data = await FhirApi({ url: `/${resourceType}`, method: 'POST', data: JSON.stringify(resource) })
        if (["Unprocessable Entity", "Bad Request"].indexOf(data.statusText) > 0) {
            res.statusCode = 400;
            res.json(data.data);
            return;
        }

        res.json(data.data);
        return;
    } catch (error) {
        res.statusCode = 400;
        res.json({
            "resourceType": "OperationOutcome",
            "id": "exception",
            "issue": [{
                "severity": "error", "code": "exception", "details": { "text": error }
            }]
        });
        return;
    }
})


// modify patient details
router.post('/', async (req, res) => {
    try {
        let resource = req.body;
        let { crossBorderId } = req.query;
        if (!crossBorderId) {
            res.statusCode = 400;
            let error = `Patient crossBorderId is required`;
            res.json({
                "resourceType": "OperationOutcome",
                "id": "exception",
                "issue": [{
                    "severity": "error", "code": "exception",
                    "details": { "text": error }
                }]
            });
            return;
        }

        let data = await FhirApi({ url: `/`, method: 'POST', data: JSON.stringify(resource) })
        if (["Unprocessable Entity", "Bad Request"].indexOf(data.statusText) > 0) {
            res.statusCode = 400;
            res.json(data.data);
            return;
        }
        res.json(data.data);
        return;
    } catch (error) {
        console.log(error);
        res.statusCode = 400;
        res.json({
            "resourceType": "OperationOutcome",
            "id": "exception",
            "issue": [{
                "severity": "error", "code": "exception", "details": { "text": error }
            }]
        });
        return;
    }
})



export default router;