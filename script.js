const monthsList = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function addRow(monthValue = '', prevDueValue = '', roomRentValue = '', electricBillValue = '') {
    const rowsDiv = document.getElementById('rows');
    const rowDiv = document.createElement('div');
    rowDiv.className = 'add-row-group';
    rowDiv.innerHTML = `
    <select class="month" required>
      <option value="">--Select Month--</option>
      ${monthsList.map(m => `<option value="${m}" ${monthValue === m ? 'selected' : ''}>${m}</option>`).join('')}
    </select>
    <input type="number" class="prevDue" min="0" placeholder="Previous Bill Dues" value="${prevDueValue}">
    <input type="number" class="roomRent" min="0" placeholder="Room Rent" value="${roomRentValue}">
    <input type="number" class="electricBill" min="0" placeholder="Electric Bill" value="${electricBillValue}" required>
    <button type="button" class="removeRowBtn">Remove</button>
  `;
    rowDiv.querySelector('.removeRowBtn').onclick = function () {
        rowDiv.remove();
    };
    rowsDiv.appendChild(rowDiv);
}
addRow();

document.getElementById('addRowBtn').onclick = function () { addRow(); };

document.getElementById('invoiceForm').onsubmit = function (e) {
    e.preventDefault();
    const name = document.getElementById('renter').value.trim();
    const date = document.getElementById('date').value;
    const rowsNodes = document.getElementById('rows').children;
    const records = [];
    let grandTotal = 0;
    for (let row of rowsNodes) {
        const month = row.querySelector('.month').value;
        const prevDue = row.querySelector('.prevDue').value ? Number(row.querySelector('.prevDue').value) : null;
        const roomRent = row.querySelector('.roomRent').value ? Number(row.querySelector('.roomRent').value) : null;
        const electricBill = row.querySelector('.electricBill').value ? Number(row.querySelector('.electricBill').value) : 0;
        let rowTotal = 0;
        if (prevDue) rowTotal += prevDue;
        if (roomRent) rowTotal += roomRent;
        rowTotal += electricBill;
        grandTotal += rowTotal;
        records.push({ month, prevDue, roomRent, electricBill, rowTotal });
    }
    function formatDate(d) {
        if (!d) return '';
        const opts = { year: 'numeric', month: 'short', day: '2-digit' };
        return new Date(d).toLocaleDateString('en-US', opts);
    }
    document.getElementById('invoice').innerHTML = `
        <h3>Rent Dues</h3>
        <div style="margin-bottom:16px;">
        <div style="display:inline-block;">
            <div><strong>Dues Amount for</strong></div>
            <div style="font-family:serif;font-size:1.17em;letter-spacing:1px;font-weight:bold;color:#23455f;">${name.toUpperCase()}</div>
        </div>
        <div style="float:right; text-align:right;">
            <strong>DATE</strong><br>
            <span style="color:#23455f;">${formatDate(date)}</span>
        </div>
        <div style="clear:both;"></div>
        </div>
        <table class="table">
        <tr>
            <th>Months</th>
            <th>Previous Bill Dues</th>
            <th>Room Rent</th>
            <th>Electric Bill</th>
            <th>Totally</th>
        </tr>
        ${records.map(rec => `
            <tr>
            <td>${rec.month}</td>
            <td>${(rec.prevDue != null) ? rec.prevDue : "→"}</td>
            <td>${(rec.roomRent != null) ? rec.roomRent : "→"}</td>
            <td>${rec.electricBill}</td>
            <td>₹ ${rec.rowTotal}</td>
            </tr>
        `).join('')}
        </table>
        <div class="summary" id="summary-total">
        Total dues amount<br>
        <span>₹${grandTotal}</span>
        </div>
    `;
    document.getElementById('printBtn').style.display = 'inline-block';
};

document.getElementById('printBtn').onclick = function () {
    window.print();
};
