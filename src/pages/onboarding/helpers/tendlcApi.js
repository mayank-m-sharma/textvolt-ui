import { TEN_DLC_API_BASE_URL, TEN_DLC_API_HEADERS } from "../../../constants/tenDlc"

const { 
    XVOLT_API_VERSION, 
    ACCEPT
} = TEN_DLC_API_HEADERS

// TODO: Replace this with a valid AUTH_TOKEN
const AUTH_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjQyOTQ5NjcyOTUsImlhdCI6MCwib3JnIjoxMzk5MywicGVyIjoiIn0.-V5yHzMwpFYKViDPCxTAODNzUIybPtmrb2-Iw6-zLfI";

export const LIST_COUNTRIES = async () => {
    try {
        const response = await fetch(`${TEN_DLC_API_BASE_URL}/countries`, {
            headers: {
                'x-volt-api-version': XVOLT_API_VERSION,
                'accept': ACCEPT,
                'authorization': `Bearer ${AUTH_TOKEN}`
            }
        })
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error(`Error fetching countries List ${error}`);
    }
}

export const LIST_VERTICALS = async () => {
    try {
        const response = await fetch(`${TEN_DLC_API_BASE_URL}/verticals`, {
            headers: {
                'x-volt-api-version': XVOLT_API_VERSION,
                'accept': ACCEPT,
                'authorization': `Bearer ${AUTH_TOKEN}`
            }
        })
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error(`Error fetching verticals List ${error}`);
    }
}

export const LIST_STATES = async () => {
    try {
        const response = await fetch(`${TEN_DLC_API_BASE_URL}/us_states`, {
            headers: {
                'x-volt-api-version': XVOLT_API_VERSION,
                'accept': ACCEPT,
                'authorization': `Bearer ${AUTH_TOKEN}`
            }
        })
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error(`Error fetching states List ${error}`);
    }
}

export const LIST_ENTITY_TYPES = async () => {
    try {
        const response = await fetch(`${TEN_DLC_API_BASE_URL}/entity_types`, {
            headers: {
                'x-volt-api-version': XVOLT_API_VERSION,
                'accept': ACCEPT,
                'authorization': `Bearer ${AUTH_TOKEN}`
            }
        })
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error(`Error fetching entity types List ${error}`);
    }
}

export const LIST_STOCK_EXCHANGES = async () => {
    try {
        const response = await fetch(`${TEN_DLC_API_BASE_URL}/stock_exchanges`, {
            headers: {
                'x-volt-api-version': XVOLT_API_VERSION,
                'accept': ACCEPT,
                'authorization': `Bearer ${AUTH_TOKEN}`
            }
        })
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error(`Error fetching stock exchanges List ${error}`);
    }
}

export const LIST_USE_CASES = async () => {
    try {
        const response = await fetch(`${TEN_DLC_API_BASE_URL}/use_cases`, {
            headers: {
                'x-volt-api-version': XVOLT_API_VERSION,
                'accept': ACCEPT,
                'authorization': `Bearer ${AUTH_TOKEN}`
            }
        })
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error(`Error fetching use cases List ${error}`);
    }
}