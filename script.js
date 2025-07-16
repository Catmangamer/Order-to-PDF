var accessToken = "";
var merchantId = "";
var refreshToken = "";
// Client ID: J1G5HH7DNR95M
const clientID = "J1G5HH7DNR95M";
const clientSecret = "";
//Sandbox Client ID: CG0MRHP5TP8QE
//Sandbox Client Secret: 720c8ac5-22be-02f9-fb42-3a4a0a621fab

//Sandbox Merchant ID: B3MRAVHXRY7C1
//Sandbox 
merchantId = "";

const cloverAPIURL = "https://api.clover.com";
const cloverOAuthURL = "https://www.clover.com";

async function Auth() {
    // Finds Code in URL
    const code = new URLSearchParams(window.location.search).get("code");
    const code_verifier = sessionStorage.getItem("code_verifier");

    //Sandbox Access Token
    accessToken = window.location.hash.substring(14);
    console.log("Access Token: " + accessToken);
    if (clientSecret) {
        fetch(cloverOAuthURL + "/oauth/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: 'https://catmangamer.github.io/Order-to-PDF/',
                client_id: clientID,
                client_secret: clientSecret
            })
        })
            .then(res => res.json())
            .then(data => {
                var { access_token, merchant_id, refresh_token } = data;
                accessToken = access_token;
                merchantId = merchant_id;
                refreshToken = refresh_token;
                console.log("✅ Token:", accessToken);
                sessionStorage.setItem("access_token", accessToken);
                sessionStorage.setItem("merchant_id", merchantId);
                sessionStorage.setItem("refresh_token", refreshToken);
            })
            .catch(err => console.error("Token exchange failed", err));
    }
    else if (code && code_verifier) {
        fetch(cloverOAuthURL + "/oauth/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: 'https://catmangamer.github.io/Order-to-PDF/',
                client_id: clientID,
                code_verifier: code_verifier
            })
        })
            .then(res => res.json())
            .then(data => {
                var { access_token, merchant_id, refresh_token } = data;
                accessToken = access_token;
                merchantId = merchant_id;
                refreshToken = refresh_token;
                console.log("✅ Token:", accessToken);
                sessionStorage.setItem("access_token", accessToken);
                sessionStorage.setItem("merchant_id", merchantId);
                sessionStorage.setItem("refresh_token", refreshToken);
            })
            .catch(err => console.error("Token exchange failed", err));
    }
    else if (code) {
        fetch(cloverOAuthURL + "/oauth/token", {
            method: "POST",
            body: {
                client_id: clientID,
                client_secret: '720c8ac5-22be-02f9-fb42-3a4a0a621fab',
                code: code
            }
        })
    }
    else if (!accessToken) {
        document.getElementById("status").textContent = "Redirecting to Clover for OAuth...";
        generatePKCECodes().then(({ code_verifier, code_challenge }) => {
            sessionStorage.setItem("code_verifier", code_verifier);
            const authUrl = cloverOAuthURL + '/oauth/authorize?client_id=' + clientID + '&response_type=token&redirect_uri=https://catmangamer.github.io/Order-to-PDF/' + `&code_challenge=${code_challenge}` + '&code_challenge_method=S256';
            window.location.href = authUrl;
        });
    } else {
        document.getElementById("status").textContent = "Authenticated!";
    }
}

function base64urlencode(str) {
    return btoa(String.fromCharCode(...new Uint8Array(str)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function generatePKCECodes() {
    const code_verifier = base64urlencode(crypto.getRandomValues(new Uint8Array(32)));
    const encoder = new TextEncoder();
    const data = encoder.encode(code_verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    const code_challenge = base64urlencode(digest);
    return { code_verifier, code_challenge };
}



async function getOrders() {
    console.log("Access Token: "+accessToken)
    const orderDat = {
        method: 'GET',
        headers: { accept: 'application/json', authorization: 'Bearer ' + accessToken }
    };
    fetch(cloverAPIURL+'/v3/merchants/' + merchantId + '/orders', orderDat)
        .then(res => res.json())
        .then(res => document.getElementById("orders").innerHTML = res)
        .then(res => console.log("Order Data: " + JSON.stringify(res)))
        .catch(err => console.error(err));
    try {
        const res = await fetch(cloverAPIURL+'/v3/merchants/'+merchantId+'/orders', orderDat);
        const json = await res.json();
        console.log(json);
        document.getElementById("orderList").textContent = JSON.stringify(json);
    } catch (err) {
        console.error("Failed to fetch orders:", err);
    }
}

async function makeOrder(typeOrder) {
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: 'Bearer c1071db9-1643-8c9b-73f6-8ee20c733c18'
        },
        body: JSON.stringify({
            orderCart: {
                orderType: {
                    taxable: 'false',
                    isDefault: 'false',
                    filterCategories: 'false',
                    isHidden: 'false',
                    isDeleted: 'false'
                },
                groupLineItems: 'false'
            }
        })
    };

    fetch('https://sandbox.dev.clover.com/v3/merchants/B3MRAVHXRY7C1/atomic_order/orders', options)
        .then(res => res.json())
        .then(res => console.log(res))
        .catch(err => console.error(err));
}

async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({});
    doc.output('dataurlnewwindow');
    doc.save("order.pdf");
}