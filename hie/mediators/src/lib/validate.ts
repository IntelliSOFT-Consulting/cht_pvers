
import fetch from "node-fetch"
import { parseCondition, parseFhirPatient } from "./resources";



// ?q=145262&limit=25&exact_match=on&
//   -H 'accept: application/json' \
export const getConceptCode = async (code: string) => {

    let response = await (await fetch(`${process.env.OCL_HOST}/concepts?` + new URLSearchParams({ q: code, exact_match: "on" }),
        { headers: { "Content-Type": "application/json", "Authorization": process.env.OCL_API_KEY || '' } })).json()
    console.log("API", response);

}


// getMappings
export const getMappings =async (code:string) => {
    
}



// 1. Validates concepts
export const validateResource = async (data: any) => {
    let parsed;

    switch (data.resourceType) {
        case "Condition":
            parsed = parseCondition(data)
        case "Observation":
            break;
        default:
            return false;
    }

    let codes = parsed?.codes
    for(let code of codes){
        getConceptCode(code)
    }

    return;
}