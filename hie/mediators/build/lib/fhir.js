"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Patient = exports.FhirApi = exports.apiHost = void 0;
exports.apiHost = process.env.FHIR_BASE_URL;
// a fetch wrapper for HAPI FHIR server.
const FhirApi = (params) => __awaiter(void 0, void 0, void 0, function* () {
    let _defaultHeaders = { "Content-Type": 'application/json' };
    if (!params.method) {
        params.method = 'GET';
    }
    try {
        let response = yield fetch(String(`${exports.apiHost}${params.url}`), Object.assign({ headers: _defaultHeaders, method: params.method ? String(params.method) : 'GET' }, (params.method !== 'GET' && params.method !== 'DELETE') && { body: String(params.data) }));
        let responseJSON = yield response.json();
        let res = {
            status: "success",
            statusText: response.statusText,
            data: responseJSON
        };
        return res;
    }
    catch (error) {
        console.error(error);
        let res = {
            statusText: "FHIRFetch: server error",
            status: "error",
            data: error
        };
        console.error(error);
        return res;
    }
});
exports.FhirApi = FhirApi;
// Sample Patient Object.
// Create Patient in the MPI
// required
// patient id, patient name
let Patient = (patient) => {
    return Object.assign(Object.assign({ resourceType: 'Patient' }, (patient.id && { id: patient.id })), { identifier: [
            {
                "value": patient.pointOfCareId,
                "id": "POINT_OF_CARE_ID"
            },
            {
                "value": patient.crossBorderId,
                "id": "CROSS_BORDER_ID"
            }
        ], name: [
            {
                family: patient.surname,
                given: [patient.otherNames,],
            },
        ], telecom: [
            {
                value: patient.phone,
            },
        ], birthDate: new Date(patient.dob).toISOString().slice(0, 10), address: [
            {
                state: patient.county,
                district: patient.subCounty,
                city: patient.ward,
                village: patient.village
            },
        ], contact: [
            {
                telecom: [
                    {
                        value: patient.nextOfKinPhone,
                    },
                ],
                name: {
                    family: patient.nextOfKinName,
                },
                relationship: [{
                        text: patient.nextOfKinRelationship
                    }]
            },
        ] });
};
exports.Patient = Patient;
// Sample Observation Object For Dynamic Building
// Sample Encounter Object For Dynamic Building
