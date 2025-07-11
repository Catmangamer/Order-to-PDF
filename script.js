
// Client ID: J1G5HH7DNR95M
// Merchant ID: EMFVG7E4J3GN1

const orderDat = {
    method: 'GET',
    headers: {accept: 'application/json', authorization: 'Bearer '+accessToken}
};

async function Auth() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const search = new URLSearchParams(window.location.search);
    const merchantId = search.get("merchant_id");
    console.log("Hash: " + hash + "\nParams: " + params + "\nToken: " + accessToken + "\nSearch: " + search + "\nMerchantID: " + merchantId);
    if (accessToken && merchantId) {

    }
    else {
        document.getElementById("status").textContent = "Redirecting to Clover for OAuth...";
        const authUrl = `https://www.clover.com/oauth/authorize?client_id=J1G5HH7DNR95M&response_type=token&redirect_uri=https://catmangamer.github.io/Order-to-PDF/`;
        window.location.href = authUrl;
    }
}

async function getOrders() {
    fetch('https://api.clover.com/v3/merchants/' + merchantId + '/orders', orderDat)
        .then(res => res.json())
        .then(res => console.log(res))
        .catch(err => console.error(err));
    document.getElementById("orders").innerHTML = orderDat;
    console.log(orderDat);
    const data = await orderDat.json();
}



async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.save("order.pdf");
}