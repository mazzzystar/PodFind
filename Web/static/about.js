function calculateServerCost() {
    const startDate = new Date("2023-03-15");
    const dailyCost = 3.03;
    const now = new Date();
    const differenceInTime = now.getTime() - startDate.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    const totalCost = (differenceInDays * dailyCost).toFixed(2);
    document.getElementById("server-cost").innerHTML = "$"+totalCost;
}

function showDonationOptions() {
const donationMethods = document.getElementById("donation-methods");
donationMethods.style.display = "block";
}

function showQRCode(id) {
    const qrCodeElements = document.querySelectorAll(".qr-code");
    qrCodeElements.forEach((element) => {
        element.style.display = "none";
    });

    const qrCodeToShow = document.getElementById(id);
    qrCodeToShow.style.display = "block";
}

function showQRCode(id) {
    const qrCodeElements = document.querySelectorAll(".qr-code");
    qrCodeElements.forEach((element) => {
        element.style.display = "none";
    });

    const qrCodeToShow = document.getElementById(id);
    qrCodeToShow.style.display = "block";

    // Add a slight delay before scrolling
    setTimeout(() => {
        // Calculate the position to scroll to
        const scrollToPosition = qrCodeToShow.getBoundingClientRect().top + window.pageYOffset - (window.innerHeight / 2);

        // Scroll to the displayed QR code
        window.scrollTo({ top: scrollToPosition, behavior: 'smooth' });
    }, 100); // 100ms delay
}

function showDonationOptions() {
    const donationMethods = document.getElementById("donation-methods");
    donationMethods.style.display = "block";

    // Add a slight delay before scrolling
    setTimeout(() => {
        // Calculate the position to scroll to
        const scrollToPosition = donationMethods.getBoundingClientRect().top + window.pageYOffset - (window.innerHeight / 2);

        // Scroll to the donation methods
        window.scrollTo({ top: scrollToPosition, behavior: 'smooth' });
    }, 100); // 100ms delay
}

// Call the function when the page loads
window.addEventListener("load", calculateServerCost);