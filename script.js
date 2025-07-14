var accessToken = "";
var merchantId = "";
var refreshToken = "";
// Client ID: J1G5HH7DNR95M
const clientID = "CG0MRHP5TP8QE";
//Sandbox Client ID: CG0MRHP5TP8QE
//Sandbox Client Secret: 720c8ac5-22be-02f9-fb42-3a4a0a621fab

//Sandbox Merchant ID: B3MRAVHXRY7C1
//Sandbox 
merchantId = "B3MRAVHXRY7C1";

const cloverAPIURL = "https://sandbox.dev.clover.com";
const cloverOAuthURL = "https://sandbox.dev.clover.com";

async function Auth() {
    // Finds Code in URL
    const code = new URLSearchParams(window.location.search).get("code");
    const code_verifier = sessionStorage.getItem("code_verifier");

    //Sandbox Access Token
    const myUrl = new URL(window.location.href.replace(/#/g, "?"));
    const accessToken = myUrl.searchParams.get("access_token");

    if (code && code_verifier) {
        fetch(cloverOAuthURL + "/oauth/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: 'https://catmangamer.github.io/Order-to-PDF/',
                client_id: "J1G5HH7DNR95M",
                code_verifier: code_verifier
            })
        })
            .then(res => res.json())
            .then(data => {
                const { access_token, merchant_id, refresh_token } = data;
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
    else if (!accessToken){
        document.getElementById("status").textContent = "Redirecting to Clover for OAuth...";
        generatePKCECodes().then(({ code_verifier, code_challenge }) => {
            sessionStorage.setItem("code_verifier", code_verifier); 
            const authUrl = cloverOAuthURL+'/oauth/authorize?client_id='+clientID+'&response_type=token&redirect_uri=https://catmangamer.github.io/Order-to-PDF/' + `&code_challenge=${code_challenge}` + '&code_challenge_method=S256';
            window.location.href = authUrl;
        });
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
    const orderDat = {
        method: 'GET',
        headers: { accept: 'application/json', authorization: 'Bearer ' + accessToken }
    };
    fetch(cloverAPIURL+'/v3/merchants/' + merchantId + '/orders', orderDat)
        .then(res => res.json())
        .then(res => console.log(res))
        .catch(err => console.error(err));
    document.getElementById("orders").innerHTML = orderDat;
    console.log(orderDat);
    const data = await orderDat.json();
    try {
        const res = await fetch(cloverAPIURL+'/v3/merchants/'+merchantId+'/orders', orderDat);
        const json = await res.json();
        console.log(json);
        document.getElementById("orderList").textContent = JSON.stringify(json, null, 2);
    } catch (err) {
        console.error("Failed to fetch orders:", err);
    }
}



async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.save("order.pdf");
}