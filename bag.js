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
  if (bag.length === 0) {
    alert("Your bag is empty.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 20;
  doc.setFontSize(16);
  doc.text("Ekta's Blueberry - Dry Fruits Receipt", 20, y);
  y += 10;
  doc.setFontSize(12);
  doc.text(`Date: ${new Date().toLocaleString()}`, 20, y);
  y += 10;

  let total = 0;
  doc.text("Items:", 20, y);
  y += 10;

  bag.forEach(item => {
    const subtotal = item.quantity * item.price;
    total += subtotal;
    doc.text(`${item.name} - Qty: ${item.quantity} x ₹${item.price} = ₹${subtotal}`, 20, y);
    y += 10;
  });

  y += 5;
  doc.setFontSize(14);
  doc.text(`Total: ₹${total}`, 20, y);

  doc.save("Dry_Fruits_Receipt.pdf");

  setTimeout(() => {
    alert("🎉 Order placed successfully!");
  }, 200);

  localStorage.removeItem("bag");
  bag = [];
  renderBag();
}

renderBag();
