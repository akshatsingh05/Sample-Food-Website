let bag = JSON.parse(localStorage.getItem("bag")) || [];

function renderBag() {
  const bagItems = document.getElementById("bagItems");
  const bagTotal = document.getElementById("bagTotal");
  bagItems.innerHTML = "";

  if (bag.length === 0) {
    bagItems.innerHTML = "<p class='empty-bag'>Your bag is empty.</p>";
    bagTotal.textContent = "";
    return;
  }

  let total = 0;
  bag.forEach((item, index) => {
    const subtotal = item.quantity * item.price;
    total += subtotal;

    const itemDiv = document.createElement("div");
    itemDiv.className = "bag-item";
    itemDiv.innerHTML = `
      <div class="bag-info">
        <div class="bag-name">${item.name}</div>
        <div class="bag-price">₹${item.price} x ${item.quantity} = ₹${subtotal}</div>
      </div>
      <div class="counter">
        <button onclick="changeQty(${index}, -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="changeQty(${index}, 1)">+</button>
      </div>
    `;
    bagItems.appendChild(itemDiv);
  });

  bagTotal.textContent = `Total: ₹${total}`;
}

function changeQty(index, delta) {
  bag[index].quantity += delta;
  if (bag[index].quantity <= 0) {
    bag.splice(index, 1);
  }
  localStorage.setItem("bag", JSON.stringify(bag));
  renderBag();
}

function clearBag() {
  if (confirm("Are you sure you want to clear your bag?")) {
    localStorage.removeItem("bag");
    bag = [];
    renderBag();
    alert("🗑️ Bag cleared.");
  }
}

async function checkout() {
  const bag = JSON.parse(localStorage.getItem("bag")) || [];
  if (bag.length === 0) {
    alert("Your bag is empty.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 20;

  // Header
  doc.setFontSize(18);
  doc.setTextColor(59, 127, 89);
  doc.text("Ekta's Blueberry - Dry Fruits Division", 20, y);
  y += 10;

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text("Address: Ekta Nagar, India", 20, y);
  y += 6;
  doc.text("Phone: +91-9876543210  |  www.ektablueberry.com", 20, y);
  y += 6;

  const orderId = Math.floor(100000 + Math.random() * 900000);
  doc.text(`Order ID: #${orderId}`, 20, y);
  y += 6;
  doc.text(`Date: ${new Date().toLocaleString()}`, 20, y);
  y += 10;

  // Section Heading
  doc.setFontSize(14);
  doc.setTextColor(59, 127, 89);
  doc.text("Order Summary", 20, y);
  y += 10;

  // Column Headings
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Item", 20, y);
  doc.text("Qty", 100, y);
  doc.text("Price", 130, y);
  doc.text("Total", 170, y);
  y += 6;
  doc.line(20, y, 190, y); // line below headings
  y += 6;

  // Items
  let total = 0;
  bag.forEach(item => {
    const subtotal = item.quantity * item.price;
    total += subtotal;

    doc.text(item.name, 20, y);
    doc.text(`${item.quantity}`, 105, y);
    doc.text(`₹${item.price}`, 135, y);
    doc.text(`₹${subtotal}`, 170, y);
    y += 8;
  });

  // Total
  y += 10;
  doc.setFontSize(13);
  doc.setTextColor(59, 127, 89);
  doc.text(`Grand Total: ₹${total}`, 140, y, { align: "right" });

  // Thank You
  y += 20;
  doc.setFontSize(12);
  doc.setTextColor(90, 90, 90);
  doc.text("Thank you for choosing Ekta's Blueberry for your dry fruit needs!", 20, y);

  // Save PDF
  doc.save(`DryFruits_Order_${orderId}.pdf`);

  // Confirm & Clear Bag
  setTimeout(() => {
    alert("🎉 Order placed successfully!");
  }, 300);

  localStorage.removeItem("bag");
  renderBag();
}


renderBag();
