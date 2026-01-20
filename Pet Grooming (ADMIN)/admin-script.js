// Sample Data
const bookingsData = [
    {
        id: 1,
        owner: 'Kai Sotto',
        email: 'kai@email.com',
        phone: '0917 123 4567',
        pet: 'Brownie',
        service: 'Full Groom',
        price: 800,
        date: '2025-11-15',
        time: '10:00 AM',
        status: 'pending',
        notes: 'Allergic to certain shampoos'
    },
    {
        id: 2,
        owner: 'Jessabel Ronato',
        email: 'Jessabel@email.com',
        phone: '0918 234 5678',
        pet: 'Whitey',
        service: 'Basic Bath',
        price: 500,
        date: '2025-11-16',
        time: '2:00 PM',
        status: 'approved',
        notes: 'Very calm pet'
    },
    {
        id: 3,
        owner: 'Lebron James',
        email: 'bronny@email.com',
        phone: '0919 345 6789',
        pet: 'Blacky',
        service: 'Nail Trim',
        price: 300,
        date: '2025-11-17',
        time: '11:00 AM',
        status: 'rejected',
        notes: 'Not available on that date'
    },
    {
        id: 4,
        owner: 'Ronald Llamo',
        email: 'ron@email.com',
        phone: '0920 456 7890',
        pet: 'Lucky',
        service: 'Full Groom',
        price: 800,
        date: '2025-11-18',
        time: '3:00 PM',
        status: 'pending',
        notes: 'First time grooming'
    }
];

const usersData = [
    { id: 1, name: 'Kai Sotto', email: 'kai@email.com', totalBookings: 5 },
    { id: 2, name: 'Jessabel Ronato', email: 'jessabel@email.com', totalBookings: 3 },
    { id: 3, name: 'Lebron James', email: 'bronny@email.com', totalBookings: 7 },
    { id: 4, name: 'Ronald Llamo', email: 'ron@email.com', totalBookings: 2 }
];

// Navigation
function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    document.getElementById(sectionId).classList.add('active');
    event.target.closest('.nav-item').classList.add('active');
}

// Load Bookings
function loadBookings() {
    const tbody = document.getElementById('bookingsTableBody');
    tbody.innerHTML = '';

    bookingsData.forEach(booking => {
        const row = document.createElement('tr');
        const actionsHTML = booking.status === 'approved'
            ? `
                <button class="action-btn download-btn" onclick="downloadReceipt(${booking.id})">Download Receipt</button>
                <button class="action-btn view-btn" onclick="viewBookingDetails(${booking.id})">View</button>
              `
            : `
                <button class="action-btn approve-btn" onclick="approveBooking(${booking.id})">Approve</button>
                <button class="action-btn reject-btn" onclick="rejectBooking(${booking.id})">Reject</button>
                <button class="action-btn view-btn" onclick="viewBookingDetails(${booking.id})">View</button>
              `;

        row.innerHTML = `
            <td>${booking.owner}</td>
            <td>${booking.pet}</td>
            <td>${booking.service}</td>
            <td>${booking.date}</td>
            <td><span class="status-badge status-${booking.status}">${booking.status.toUpperCase()}</span></td>
            <td>${actionsHTML}</td>
        `;
        tbody.appendChild(row);
    });
}

// Generate PDF Receipt
function downloadReceipt(id) {
    const booking = bookingsData.find(b => b.id === id);
    if (!booking || booking.status !== 'approved') {
        alert('Receipt can only be downloaded for approved bookings.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const primaryColor = [102, 191, 191];
    const darkText = [34, 34, 34];
    const mutedText = [107, 114, 128];

    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont(undefined, 'bold');
    doc.text('PetMalu', 20, 18);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Professional Grooming for Dogs & Cats', 20, 26);

    // Title
    doc.setTextColor(...darkText);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('BOOKING RECEIPT', 20, 48);

    // Info
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(...mutedText);
    doc.text(`Receipt #: ${String(booking.id).padStart(6, '0')}`, 20, 56);
    doc.text(`Date Issued: ${new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    })}`, 20, 62);

    // Divider
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(20, 68, 190, 68);

    // Customer Info
    doc.setTextColor(...darkText);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('CUSTOMER INFORMATION', 20, 78);

    let yPos = 86;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(...mutedText);
    doc.text('Name:', 20, yPos);
    doc.setTextColor(...darkText);
    doc.text(booking.owner, 55, yPos);

    yPos += 7;
    doc.setTextColor(...mutedText);
    doc.text('Email:', 20, yPos);
    doc.setTextColor(...darkText);
    doc.text(booking.email, 55, yPos);

    yPos += 7;
    doc.setTextColor(...mutedText);
    doc.text('Phone:', 20, yPos);
    doc.setTextColor(...darkText);
    doc.text(booking.phone, 55, yPos);

    // Pet Info
    yPos += 15;
    doc.setTextColor(...darkText);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('PET INFORMATION', 20, yPos);

    yPos += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(...mutedText);
    doc.text('Pet Name:', 20, yPos);
    doc.setTextColor(...darkText);
    doc.text(booking.pet, 55, yPos);

    // Booking Info
    yPos += 15;
    doc.setTextColor(...darkText);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('BOOKING DETAILS', 20, yPos);

    yPos += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(...mutedText);
    doc.text('Service:', 20, yPos);
    doc.setTextColor(...darkText);
    doc.text(booking.service, 55, yPos);

    yPos += 7;
    doc.setTextColor(...mutedText);
    doc.text('Date:', 20, yPos);
    doc.setTextColor(...darkText);
    doc.text(booking.date, 55, yPos);

    yPos += 7;
    doc.setTextColor(...mutedText);
    doc.text('Time:', 20, yPos);
    doc.setTextColor(...darkText);
    doc.text(booking.time, 55, yPos);

    yPos += 7;
    doc.setTextColor(...mutedText);
    doc.text('Status:', 20, yPos);
    doc.setTextColor(22, 163, 74);
    doc.setFont(undefined, 'bold');
    doc.text('APPROVED', 55, yPos);

    if (booking.notes) {
        yPos += 15;
        doc.setTextColor(...darkText);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('NOTES', 20, yPos);

        yPos += 8;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(...mutedText);
        const splitNotes = doc.splitTextToSize(booking.notes, 170);
        doc.text(splitNotes, 20, yPos);
        yPos += splitNotes.length * 7;
    }

    // Price box
    yPos += 15;
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(20, yPos, 170, 28, 3, 3, 'F');
    yPos += 10;
    doc.setTextColor(...darkText);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Service Fee:', 25, yPos);
    doc.text(`PHP ${booking.price.toFixed(2)}`, 185, yPos, { align: 'right' });
    yPos += 10;
    doc.setFontSize(13);
    doc.text('TOTAL AMOUNT:', 25, yPos);
    doc.text(`PHP ${booking.price.toFixed(2)}`, 185, yPos, { align: 'right' });

    // Footer
    yPos = 270;
    doc.setDrawColor(...primaryColor);
    doc.line(20, yPos, 190, yPos);
    yPos += 8;
    doc.setFontSize(9);
    doc.setTextColor(...mutedText);
    doc.text('Thank you for choosing PetMalu!', 105, yPos, { align: 'center' });
    yPos += 5;
    doc.text('For inquiries, please contact us at info@petmalu.com', 105, yPos, { align: 'center' });

    doc.save(`PetMalu_Receipt_${String(booking.id).padStart(6, '0')}_${booking.owner.replace(/\s/g, '_')}.pdf`);
}

// View Booking Details
function viewBookingDetails(id) {
    const booking = bookingsData.find(b => b.id === id);
    const modal = document.getElementById('bookingModal');
    const detailsDiv = document.getElementById('bookingDetails');

    const modalActionsHTML = booking.status === 'approved'
        ? `
            <button class="action-btn download-btn" onclick="downloadReceipt(${booking.id})">Download Receipt</button>
            <button class="action-btn view-btn" onclick="deleteBooking(${booking.id})">Delete</button>
          `
        : `
            <button class="action-btn approve-btn" onclick="approveBooking(${booking.id}); closeModal();">Approve</button>
            <button class="action-btn reject-btn" onclick="rejectBooking(${booking.id}); closeModal();">Reject</button>
            <button class="action-btn view-btn" onclick="deleteBooking(${booking.id})">Delete</button>
          `;

    detailsDiv.innerHTML = `
        <div class="detail-group">
            <h3>Owner Information</h3>
            <div class="detail-item"><span class="detail-label">Name:</span><span class="detail-value">${booking.owner}</span></div>
            <div class="detail-item"><span class="detail-label">Email:</span><span class="detail-value">${booking.email}</span></div>
            <div class="detail-item"><span class="detail-label">Phone:</span><span class="detail-value">${booking.phone}</span></div>
        </div>

        <div class="detail-group">
            <h3>Pet Information</h3>
            <div class="detail-item"><span class="detail-label">Pet Name:</span><span class="detail-value">${booking.pet}</span></div>
        </div>

        <div class="detail-group">
            <h3>Booking Information</h3>
            <div class="detail-item"><span class="detail-label">Service:</span><span class="detail-value">${booking.service}</span></div>
            <div class="detail-item"><span class="detail-label">Date:</span><span class="detail-value">${booking.date}</span></div>
            <div class="detail-item"><span class="detail-label">Time:</span><span class="detail-value">${booking.time}</span></div>
            <div class="detail-item"><span class="detail-label">Price:</span><span class="detail-value">₱${booking.price.toFixed(2)}</span></div>
            <div class="detail-item"><span class="detail-label">Status:</span><span class="detail-value"><span class="status-badge status-${booking.status}">${booking.status.toUpperCase()}</span></span></div>
            <div class="detail-item"><span class="detail-label">Notes:</span><span class="detail-value">${booking.notes || 'None'}</span></div>
        </div>

        <div class="modal-actions">${modalActionsHTML}</div>
    `;

    modal.classList.add('show');
}

// Close Modal
function closeModal() { document.getElementById('bookingModal').classList.remove('show'); }

// Approve / Reject / Delete
function approveBooking(id) {
    const booking = bookingsData.find(b => b.id === id);
    booking.status = 'approved';
    loadBookings();
    alert(`Booking #${id} has been approved!`);
}
function rejectBooking(id) {
    const booking = bookingsData.find(b => b.id === id);
    booking.status = 'rejected';
    loadBookings();
    alert(`Booking #${id} has been rejected!`);
}
function deleteBooking(id) {
    if (confirm('Are you sure you want to delete this booking?')) {
        const index = bookingsData.findIndex(b => b.id === id);
        bookingsData.splice(index, 1);
        loadBookings();
        closeModal();
        alert(`Booking #${id} has been deleted!`);
    }
}

// Load Users
function loadUsers() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';
    usersData.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.totalBookings}</td>
            <td>
                <button class="action-btn view-btn" onclick="viewUserHistory(${user.id})">View History</button>
                <button class="action-btn deactivate-btn" onclick="deactivateUser(${user.id})">Deactivate</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// User History
function viewUserHistory(userId) {
    const user = usersData.find(u => u.id === userId);
    const userBookings = bookingsData.filter(b => b.owner === user.name);
    const modal = document.getElementById('userModal');
    const detailsDiv = document.getElementById('userDetails');

    let bookingsHTML = '<div class="table-container"><table class="data-table"><thead><tr><th>Pet</th><th>Service</th><th>Date</th><th>Status</th></tr></thead><tbody>';
    userBookings.forEach(booking => {
        bookingsHTML += `<tr><td>${booking.pet}</td><td>${booking.service}</td><td>${booking.date}</td><td><span class="status-badge status-${booking.status}">${booking.status.toUpperCase()}</span></td></tr>`;
    });
    bookingsHTML += '</tbody></table></div>';

    detailsDiv.innerHTML = `
        <h3>${user.name}</h3>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Total Bookings:</strong> ${user.totalBookings}</p>
        <hr style="margin: 1.5rem 0;">
        <h4>Booking History</h4>${bookingsHTML}
    `;

    modal.classList.add('show');
}

// Close User Modal
function closeUserModal() { document.getElementById('userModal').classList.remove('show'); }

// Deactivate
function deactivateUser(id) {
    const user = usersData.find(u => u.id === id);
    if (confirm(`Are you sure you want to deactivate ${user.name}?`)) {
        alert(`User ${user.name} has been deactivated!`);
    }
}

// Change Password
function changePassword(event) {
    event.preventDefault();
    const newPass = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
    if (newPass !== confirm) {
        alert('New passwords do not match!');
        return;
    }
    alert('Password changed successfully!');
    event.target.reset();
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        alert('Logged out successfully!');
        window.location.href = 'login.html';
    }
}

// Close modals when clicking outside
window.onclick = function (event) {
    const bookingModal = document.getElementById('bookingModal');
    const userModal = document.getElementById('userModal');
    if (event.target === bookingModal) bookingModal.classList.remove('show');
    if (event.target === userModal) userModal.classList.remove('show');
};

// Init
document.addEventListener('DOMContentLoaded', function () {
    loadBookings();
    loadUsers();
});
