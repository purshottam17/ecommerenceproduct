document.addEventListener("DOMContentLoaded", () => {
  // === Product Data ===
  const products = [
    {
      id: 1,
      name: "Sony WH-1000XM5",
      category: "Premium",
      price: 29999,
      image: "https://m.media-amazon.com/images/I/51aXvjzcukL._AC_UF1000,1000_QL80_.jpg",
    },
    {
      id: 2,
      name: "JBL Tune 760NC",
      category: "Wireless",
      price: 7999,
      image: "https://m.media-amazon.com/images/I/71x1ljuwF8L.jpg",
    },
    {
      id: 3,
      name: "boAt Rockerz 550",
      category: "Budget",
      price: 1999,
      image: "https://m.media-amazon.com/images/I/61F5SXdi9jL._AC_UF1000,1000_QL80_.jpg",
    },
    {
      id: 4,
      name: "Apple AirPods Max",
      category: "Premium",
      price: 59900,
      image: "https://images.unsplash.com/photo-1606813902779-3b1d9c0e22d0",
    },
    {
      id: 5,
      name: "Zebronics Zeb-Duke 2",
      category: "Budget",
      price: 2499,
      image: "https://zebronics.com/cdn/shop/files/Zeb-Duke2-blue-pic1_72e88a28-cd23-4974-94ab-06e6b1bac3a2.jpg?v=1742367408&width=1920",
    },
  ];

  // === DOM Elements ===
  const productGrid = document.getElementById("productGrid");
  const categoryFilter = document.getElementById("categoryFilter");
  const priceFilter = document.getElementById("priceFilter");
  const cartItems = document.getElementById("cartItems");
  const subtotalEl = document.getElementById("subtotal");
  const taxEl = document.getElementById("tax");
  const totalEl = document.getElementById("total");
  const clearCartBtn = document.getElementById("clearCart");

  // === Local Storage Cart ===
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // === Render Products ===
  function displayProducts(items) {
    if (!productGrid) return;
    productGrid.innerHTML = "";
    items.forEach((product) => {
      const card = document.createElement("div");
      card.classList.add("product-card");
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>Category: ${product.category}</p>
        <p>Price: ₹${product.price.toLocaleString()}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      `;
      productGrid.appendChild(card);
    });
  }

  // === Filtering ===
  function filterProducts() {
    if (!categoryFilter || !priceFilter) return;

    const category = categoryFilter.value;
    const price = priceFilter.value;

    const filtered = products.filter((p) => {
      const matchCategory = category === "all" || p.category === category;
      const matchPrice =
        price === "all" ||
        (price === "low" && p.price < 5000) ||
        (price === "mid" && p.price >= 5000 && p.price <= 20000) ||
        (price === "high" && p.price > 20000);

      return matchCategory && matchPrice;
    });

    displayProducts(filtered);
  }

  if (categoryFilter) categoryFilter.addEventListener("change", filterProducts);
  if (priceFilter) priceFilter.addEventListener("change", filterProducts);

  // === Add to Cart ===
  window.addToCart = function (id) {
    const product = products.find((p) => p.id === id);
    if (product) {
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }
  };

  // === Render Cart ===
  function renderCart() {
    if (!cartItems || !subtotalEl || !taxEl || !totalEl) return;

    cartItems.innerHTML = "";
    if (cart.length === 0) {
      cartItems.innerHTML = "<li>Your cart is empty 🛒</li>";
    }

    let subtotal = 0;

    cart.forEach((item, index) => {
      subtotal += item.price;
      const li = document.createElement("li");
      li.innerHTML = `
        ${item.name} - ₹${item.price.toLocaleString()}
        <button onclick="removeItem(${index})">❌</button>
      `;
      cartItems.appendChild(li);
    });

    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    subtotalEl.textContent = subtotal.toLocaleString();
    taxEl.textContent = tax.toFixed(2);
    totalEl.textContent = total.toLocaleString();
  }

  // === Remove Item ===
  window.removeItem = function (index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  };

  // === Clear Cart ===
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      cart = [];
      localStorage.removeItem("cart");
      renderCart();
    });
  }

  // === Initialize ===
  displayProducts(products);
  renderCart();
});
