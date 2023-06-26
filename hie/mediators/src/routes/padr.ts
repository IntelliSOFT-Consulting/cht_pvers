import express from 'express';
import { FhirApi, postPadrToPvers } from '../lib/utils';
import { parseFhirPatient, Patient } from '../lib/resources';
import { ParsedQs } from 'qs'
import fetch from 'node-fetch';
import counties from '../lib/code_to_counties_map.json'

export const router = express.Router();

router.use(express.json());

// create or register a new patient
router.post('/', async (req, res) => {
    try {
        let data = req.body.Padr.doc;
        // let formatted = data

        let county: string = String(data.fields.reporter.group_report.county).toLowerCase();
        let _counties: { [index: string]: any } = Object.entries(counties).reduce((acc, [key, value]) => ({ ...acc, [value.toLowerCase()]: key }), {});

        let quality = data.fields?.quality?.group_quality?.signs
        let medicines = data.fields.medicines;
        // let medicines = data.fields.

        let outcome = data.fields?.outcome_details?.group_outcome_details?.outcome
        outcome = String(outcome).toLowerCase()


        let padr = {
            "Padr": {
                "reporter_name": data.fields.reporter.group_report.person_name,
                "reporter_email": null,
                "reporter_phone": data.fields.reporter.group_report.person_phone,
                "county_id": String(_counties[county]),
                "relation": data.fields.reporter.group_report.relation,
                "patient_name": data.fields.patient_name,
                "gender": data.fields.patient_sex,
                "dob": data.fields.inputs.contact?.date_of_birth,
                "age_group": null,
                "report_sadr": outcome ? "Adverse Reaction" : "Poor Quality Medicine",
                "description_of_reaction": "None",
                "reaction_on": "Yes",
                "any_other_comment": null,
                "consent": "Yes",
                "sadr_vomiting": outcome.includes("vomiting") ? 1 : null,
                "sadr_dizziness": outcome.includes("dizziness") ? 1 : null,
                "sadr_headache": outcome.includes("headache") ? 1 : null,
                "sadr_joints": outcome.includes("joints") ? 1 : null,
                "sadr_rash": outcome.includes("rash") ? 1 : null,
                "sadr_mouth": outcome.includes("mouth") ? 1 : null,
                "sadr_stomach": outcome.includes("stomach") ? 1 : null,
                "sadr_urination": outcome.includes("urination") ? 1 : null,
                "sadr_eyes": outcome.includes("eyes") ? 1 : null,
                "sadr_died": outcome.includes("died") ? 1 : null,
                "pqmp_label": quality?.includes("label") ? 1 : null,
                "pqmp_material": quality?.includes("material") ? 1 : null,
                "pqmp_color": quality?.includes("color") ? 1 : null,
                "pqmp_smell": quality?.includes("smell") ? 1 : null,
                "pqmp_working": quality?.includes("working") ? 1 : null,
                "pqmp_bottle": quality?.includes("bottle") ? 1 : null,
                "date_of_onset_of_reaction": {
                    "day": "01",
                    "month": "01",
                    "year": "2023"
                },
                "report_title": "Ussd Test Integration",
                "outcome": outcome,
                "date_of_end_of_reaction": "2023-01-01"
            },
            "PadrListOfMedicine": [
                {
                    "product_name": "Sample",
                    "manufacturer": "Manufacturer",
                    "start_date": "2022-12-12",
                    "end_date": "2022-12-28",
                    "expiry_date": "2022-12-31",
                    "medicine_source": "Source"
                }
            ]
        }

        // console.log(padr);
        let response = await postPadrToPvers(padr);
        res.statusCode = Object.keys(response).indexOf("error") > -1 ? 400 : 200;
        res.json(response);
        return;
    } catch (error) {
        res.statusCode = 400;
        console.log(error);
        res.json({ error });
        return;
    }
});



export default router;