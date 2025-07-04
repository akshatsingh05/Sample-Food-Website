function increment(btn) {
  const span = btn.parentNode.querySelector(".quantity");
  span.textContent = parseInt(span.textContent) + 1;
}

function decrement(btn) {
  const span = btn.parentNode.querySelector(".quantity");
  const current = parseInt(span.textContent);
  if (current > 0) {
    span.textContent = current - 1;
  }
}

function addToCart(btn) {
  const card = btn.parentNode;
  const name = card.getAttribute("data-name");
  const price = parseInt(card.getAttribute("data-price"));
  const quantity = parseInt(card.querySelector(".quantity").textContent);

  if (quantity === 0) {
    alert("Please select at least 1 item to add to cart.");
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ name, price, quantity });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  card.querySelector(".quantity").textContent = "0";
  alert(`${quantity} ${name}(s) added to cart!`);
}
