
import AppConfig from './AppConfig.js';

import './typedef.js';


/**
 * save token to local storage
 * @param {string} token 
 */
function saveToken(token) {
    if (token) {
        localStorage.setItem('githubToken', token);
        alert('Token saved successfully!');
    } else {
        alert('Please provide a token to save.');
    }
}
/**
 * get token from local storage
 * @returns {string}  
 */
function getToken() {
    return localStorage.getItem('githubToken');
}

/**
 * fetch the JSON file from GitHub
 * @param {string} token 
 * @returns {FileData}
 */
async function fetchFile(token) {
    console.log('fetchFile token:', token);
    if (!token) {
        alert("Please provide a GitHub access token.");
        return;
    }
    let response = await fetch(AppConfig.DATA_FILE, {
        headers: {
            Authorization: `token ${token}`,
        },
    })
    let data = await response.json()
    let returnData = { sha: data.sha, data: JSON.parse(atob(data.content)) }
    console.log('fetchFile returnData:', returnData);
    return returnData
}

/**
 * 
 * @param {string} token 
 * @param {FileData} data 
 * @returns 
 */
async function updateFile(token, data, message = 'Update JSON file') {
    console.log('updateFile token:', token);
    if (!token) {
        alert("Please provide a GitHub access token.");
        return;
    }
    let response = await fetch(DATA_FILE, {
        method: 'PUT',
        headers: {
            Authorization: `token ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: message,
            content: btoa(JSON.stringify(data.data)),
            sha: data.sha,
        }),
    })
    let responseData = await response.json()
    console.log('File updated:', responseData);
}

export default { fetchFile, updateFile,getToken , saveToken}