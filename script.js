const accessToken = "";
const merchantId = "EMFVG7E4J3GN1";

// Client ID: J1G5HH7DNR95M
// Client Secret: a9fb8a4f-4cf6-fa02-d857-f491606dfa71
// Merchant ID: EMFVG7E4J3GN1

const orderDat = {
    method: 'GET',
    headers: headers: {accept: 'application/json', authorization: 'Bearer '+accessToken}
};

fetch('https://api.clover.com/v3/merchants/'+merchantId+'/orders', orderDat)
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(err => console.error(err));
console.log(options);

const data = await.orderDat.json();

async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.save("order.pdf");
}