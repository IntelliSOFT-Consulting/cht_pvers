import utils from 'openhim-mediator-utils';
import shrMediatorConfig from '../config/shrMediatorConfig.json';
import mpiMediatorConfig from '../config/mpiMediatorConfig.json';
import padrMediators from '../config/padrConfig.json'


import { Agent } from 'https';
import * as crypto from 'crypto';

// ✅ Do this if using TYPESCRIPT
import { RequestInfo, RequestInit } from 'node-fetch';
import { uuid } from 'uuidv4';

// mediators to be registered
const mediators = [
    shrMediatorConfig,
    mpiMediatorConfig,
    padrMediators
];

const fetch = (url: RequestInfo, init?: RequestInit) =>
    import('node-fetch').then(({ default: fetch }) => fetch(url, init));

const openhimApiUrl = process.env.OPENHIM_API_URL;
const openhimUsername = process.env.OPENHIM_USERNAME;
const openhimPassword = process.env.OPENHIM_PASSWORD;

const openhimConfig = {
    username: openhimUsername,
    password: openhimPassword,
    apiURL: openhimApiUrl,
    trustSelfSigned: true
}

utils.authenticate(openhimConfig, (e: any) => {
    console.log(e ? e : "✅ OpenHIM authenticated successfully");
    importMediators();
    installChannels();
})

export const importMediators = () => {
    try {
        mediators.map((mediator: any) => {
            utils.registerMediator(openhimConfig, mediator, (e: any) => {
                console.log(e ? e : "");
            });
        })
    } catch (error) {
        console.log(error);
    }
    return;
}

export const postPadrToPvers = async (payload: any) => {
    try {
        let _response = (await fetch(`${process.env['PVERS_HOST']}/api/users/auth`, {
            headers: { "Content-Type": 'application/json' }, method: "POST",
            body: JSON.stringify({
                username: process.env['PVERS_USERNAME'],
                password: process.env['PVERS_PASSWORD'],
            })
        }))
        let token = (await _response.json()).token;

        let response = (await fetch(`${process.env['PVERS_HOST']}/api/padrs/submit`, {
            headers: {
                "Content-Type": 'application/json',
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            },
            body: JSON.stringify(payload),
            method: "POST"
        }));
        let data = await response.json();
        if (data.status === "failed") {
            return { error: data.message, data }
        }
        return data;
    } catch (error) {
        console.log(error);
        return { error: error }
    }

}

export const getOpenHIMToken = async () => {
    try {
        // console.log("Auth", auth)
        let token = await utils.genAuthHeaders(openhimConfig);
        return token
    } catch (error) {
        console.log(error);
        return { error, status: "error" }
    }
}

export const installChannels = async () => {
    let headers = await getOpenHIMToken();
    mediators.map(async (mediator: any) => {
        let response = await (await fetch(`${openhimApiUrl}/channels`, {
            headers: { ...headers, "Content-Type": "application/json" }, method: 'POST', body: JSON.stringify(mediator.defaultChannelConfig[0]), agent: new Agent({
                rejectUnauthorized: false
            })
        })).text();
        console.log(response);
    })
}

export let apiHost = process.env.FHIR_BASE_URL
console.log(apiHost)


// a fetch wrapper for HAPI FHIR server.
export const FhirApi = async (params: any) => {
    let _defaultHeaders = { "Content-Type": 'application/json' }
    if (!params.method) {
        params.method = 'GET';
    }
    try {
        let response = await fetch(String(`${apiHost}${params.url}`), {
            headers: _defaultHeaders,
            method: params.method ? String(params.method) : 'GET',
            ...(params.method !== 'GET' && params.method !== 'DELETE') && { body: String(params.data) }
        });
        let responseJSON = await response.json();
        let res = {
            status: "success",
            statusText: response.statusText,
            data: responseJSON
        };
        return res;
    } catch (error) {
        console.error(error);
        let res = {
            statusText: "FHIRFetch: server error",
            status: "error",
            data: error
        };
        console.error(error);
        return res;
    }
}


export const parseIdentifiers = async (patientId: string) => {
    let patient: any = (await FhirApi({ url: `/Patient?identifier=${patientId}`, })).data
    if (!(patient?.total > 0 || patient?.entry.length > 0)) {
        return null;
    }
    let identifiers = patient.entry[0].resource.identifier;
    return identifiers.map((id: any) => {
        return {
            [id.id]: id
        }
    })
}

export const sendRequest = async () => {
    let headers = await getOpenHIMToken();
    [shrMediatorConfig.urn, mpiMediatorConfig.urn].map(async (urn: string) => {
        let response = await (await fetch(`${openhimApiUrl}/patients`, {
            headers: { ...headers, "Content-Type": "application/json" }, method: 'POST', body: JSON.stringify({ a: "y" }), agent: new Agent({
                rejectUnauthorized: false
            })
        })).text();
        console.log(response);
    });
}


export const createClient = async (name: string, password: string) => {
    let headers = await getOpenHIMToken();
    const clientPassword = password
    const clientPasswordDetails: any = await genClientPassword(clientPassword)
    let response = await (await fetch(`${openhimApiUrl}/clients`, {
        headers: { ...headers, "Content-Type": "application/json" }, method: 'POST',
        body: JSON.stringify({
            passwordAlgorithm: "sha512",
            passwordHash: clientPasswordDetails.passwordHash,
            passwordSalt: clientPasswordDetails.passwordSalt,
            clientID: name, name: name, "roles": [
                "*"
            ],
        }), agent: new Agent({
            rejectUnauthorized: false
        })
    })).text();
    console.log("create client: ", response)
    return response
}

const genClientPassword = async (password: string) => {
    return new Promise((resolve) => {
        const passwordSalt = crypto.randomBytes(16);
        // create passhash
        let shasum = crypto.createHash('sha512');
        shasum.update(password);
        shasum.update(passwordSalt.toString('hex'));
        const passwordHash = shasum.digest('hex');
        resolve({
            "passwordSalt": passwordSalt.toString('hex'),
            "passwordHash": passwordHash
        })
    })
}


// 1. Create Subscription.....
// 