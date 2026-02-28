document.addEventListener('DOMContentLoaded', function () {
  // ===== State =====
  let menuItems = [];
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  let activeCategory = 'all';

  // ===== DOM Elements =====
  const menuContainer = document.getElementById('menuContainer');
  const searchInput = document.getElementById('searchInput');
  const cartCount = document.getElementById('cartCount');
  const sidebarCartCount = document.getElementById('sidebarCartCount');
  const wishlistCount = document.getElementById('wishlistCount');
  const cartBody = document.getElementById('cartBody');
  const cartTotal = document.getElementById('cartTotal');
  const categoryNav = document.getElementById('categoryNav');
  const activeFilterText = document.getElementById('activeFilter');
  const clearFilterBtn = document.getElementById('clearFilterBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const visitorCountEl = document.getElementById('visitorCount');
  const ordersBody = document.getElementById('ordersBody');
  const ordersCount = document.getElementById('ordersCount');
  const clearOrdersBtn = document.getElementById('clearOrdersBtn');

  // ===== Visitor Counter =====
  let visitCount = parseInt(localStorage.getItem('visitCount')) || 0;
  visitCount++;
  localStorage.setItem('visitCount', visitCount);
  visitorCountEl.textContent = visitCount;

  // ===== Fallback Menu Data (used when fetch fails on file:// protocol) =====
  var fallbackMenu = [
    { id: 1, name: "Classic Burger", price: 8.99, rating: 4.5, category: "Burger", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop" },
    { id: 2, name: "Cheese Burger", price: 9.99, rating: 4.7, category: "Burger", image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300&h=200&fit=crop" },
    { id: 3, name: "Double Patty Burger", price: 12.99, rating: 4.8, category: "Burger", image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=300&h=200&fit=crop" },
    { id: 4, name: "Chicken Burrito", price: 10.49, rating: 4.3, category: "Burrito", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300&h=200&fit=crop" },
    { id: 5, name: "Beef Burrito", price: 11.49, rating: 4.6, category: "Burrito", image: "https://images.unsplash.com/photo-1584208632869-05fa2b2a5934?w=300&h=200&fit=crop" },
    { id: 6, name: "Veggie Burrito", price: 9.49, rating: 4.2, category: "Burrito", image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=300&h=200&fit=crop" },
    { id: 7, name: "Chocolate Cake", price: 6.99, rating: 4.9, category: "Desserts", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop" },
    { id: 8, name: "Ice Cream Sundae", price: 5.49, rating: 4.4, category: "Desserts", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop" },
    { id: 9, name: "Cheesecake", price: 7.49, rating: 4.7, category: "Desserts", image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=300&h=200&fit=crop" },
    { id: 10, name: "Glazed Donut", price: 3.49, rating: 4.1, category: "Donuts", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&h=200&fit=crop" },
    { id: 11, name: "Chocolate Donut", price: 3.99, rating: 4.5, category: "Donuts", image: "https://images.unsplash.com/photo-1612240498936-65f5101365d2?w=300&h=200&fit=crop" },
    { id: 12, name: "Strawberry Donut", price: 3.99, rating: 4.3, category: "Donuts", image: "https://images.unsplash.com/photo-1527515545081-5db817172677?w=300&h=200&fit=crop" },
    { id: 13, name: "Margherita Pizza", price: 13.99, rating: 4.6, category: "Pizza", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop" },
    { id: 14, name: "Pepperoni Pizza", price: 14.99, rating: 4.8, category: "Pizza", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop" },
    { id: 15, name: "BBQ Chicken Pizza", price: 15.99, rating: 4.7, category: "Pizza", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop" }
  ];

  function initDashboard(data) {
    menuItems = data;
    renderMenu(menuItems);
    renderQuickAddItems();
    updateCartUI();
    updateWishlistUI();
  }

  // ===== Load Menu via AJAX (Fetch API), fallback to embedded data =====
  fetch('data/menu.json')
    .then(function (response) {
      if (!response.ok) throw new Error('Failed to load menu');
      return response.json();
    })
    .then(function (data) {
      initDashboard(data);
    })
    .catch(function () {
      // Fallback: use embedded menu data (works on file:// protocol)
      initDashboard(fallbackMenu);
    });

  // ===== Render Quick Add Items (Right Sidebar) =====
  function renderQuickAddItems() {
    var quickAddList = document.getElementById('quickAddList');
    // Pick top-rated items (one per category) for the sidebar
    var categories = ['Burger', 'Burrito', 'Desserts', 'Donuts', 'Pizza'];
    var picks = [];
    categories.forEach(function (cat) {
      var catItems = menuItems.filter(function (m) { return m.category === cat; });
      catItems.sort(function (a, b) { return b.rating - a.rating; });
      if (catItems.length > 0) picks.push(catItems[0]);
    });

    var html = '';
    picks.forEach(function (item) {
      html +=
        '<div class="quick-add-item">' +
        '  <img src="' + item.image + '" alt="' + item.name + '">' +
        '  <div class="quick-add-info">' +
        '    <h6>' + item.name + '</h6>' +
        '    <span>$' + item.price.toFixed(2) + '</span>' +
        '  </div>' +
        '  <button class="quick-add-btn" data-id="' + item.id + '" title="Add to cart">' +
        '    <i class="fas fa-plus"></i>' +
        '  </button>' +
        '</div>';
    });
    quickAddList.innerHTML = html;

    // Attach click handlers
    quickAddList.querySelectorAll('.quick-add-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        addToCart(parseInt(this.dataset.id));
        // Quick feedback
        var icon = this.querySelector('i');
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-check');
        var self = this;
        setTimeout(function () {
          icon.classList.remove('fa-check');
          icon.classList.add('fa-plus');
        }, 800);
      });
    });
  }

  // ===== Render Menu Cards =====
  function renderMenu(items) {
    if (items.length === 0) {
      menuContainer.innerHTML =
        '<div class="col-12 no-items">' +
        '<i class="fas fa-search"></i>' +
        '<p>No items found.</p>' +
        '</div>';
      return;
    }

    var html = '';
    items.forEach(function (item) {
      var isWishlisted = wishlist.indexOf(item.id) !== -1;
      html +=
        '<div class="col-lg-4 col-md-6 col-sm-6">' +
        '  <div class="food-card">' +
        '    <div class="food-card-img-wrapper">' +
        '      <img src="' + item.image + '" alt="' + item.name + '" loading="lazy">' +
        '      <span class="rating-badge"><i class="fas fa-star"></i> ' + item.rating + '</span>' +
        '      <button class="wishlist-btn ' + (isWishlisted ? 'active' : '') + '" data-id="' + item.id + '">' +
        '        <i class="fas fa-heart"></i>' +
        '      </button>' +
        '    </div>' +
        '    <div class="food-card-body">' +
        '      <h6>' + item.name + '</h6>' +
        '      <p class="category-tag">' + item.category + '</p>' +
        '      <div class="d-flex justify-content-between align-items-center">' +
        '        <span class="price">$' + item.price.toFixed(2) + '</span>' +
        '        <button class="btn add-to-cart-btn" data-id="' + item.id + '">' +
        '          <i class="fas fa-plus me-1"></i>Add' +
        '        </button>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>';
    });
    menuContainer.innerHTML = html;

    // Attach event listeners
    document.querySelectorAll('.add-to-cart-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        addToCart(parseInt(this.dataset.id));
      });
    });

    document.querySelectorAll('.wishlist-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        toggleWishlist(parseInt(this.dataset.id));
      });
    });
  }

  // ===== Filter Menu =====
  function filterMenu() {
    var searchTerm = searchInput.value.toLowerCase().trim();
    var filtered = menuItems.filter(function (item) {
      var matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      var matchesSearch = item.name.toLowerCase().indexOf(searchTerm) !== -1;
      return matchesCategory && matchesSearch;
    });
    renderMenu(filtered);
  }

  // ===== Category Navigation =====
  categoryNav.addEventListener('click', function (e) {
    var link = e.target.closest('.category-link');
    if (!link) return;
    e.preventDefault();

    // Update active state
    categoryNav.querySelectorAll('.category-link').forEach(function (l) {
      l.classList.remove('active');
    });
    link.classList.add('active');

    activeCategory = link.dataset.category;

    if (activeCategory === 'all') {
      activeFilterText.textContent = '';
      clearFilterBtn.classList.add('d-none');
    } else {
      activeFilterText.textContent = ' — ' + activeCategory;
      clearFilterBtn.classList.remove('d-none');
    }

    filterMenu();
  });

  // Clear filter button
  clearFilterBtn.addEventListener('click', function () {
    activeCategory = 'all';
    activeFilterText.textContent = '';
    clearFilterBtn.classList.add('d-none');
    categoryNav.querySelectorAll('.category-link').forEach(function (l) {
      l.classList.remove('active');
    });
    categoryNav.querySelector('[data-category="all"]').classList.add('active');
    filterMenu();
  });

  // ===== Search =====
  searchInput.addEventListener('input', function () {
    filterMenu();
  });

  // ===== Cart Functions =====
  function addToCart(itemId) {
    var existing = cart.find(function (c) { return c.id === itemId; });
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ id: itemId, qty: 1 });
    }
    saveCart();
    updateCartUI();

    // Button feedback
    var btn = document.querySelector('.add-to-cart-btn[data-id="' + itemId + '"]');
    if (btn) {
      var original = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check me-1"></i>Added';
      btn.disabled = true;
      setTimeout(function () {
        btn.innerHTML = original;
        btn.disabled = false;
      }, 800);
    }
  }

  function removeFromCart(itemId) {
    cart = cart.filter(function (c) { return c.id !== itemId; });
    saveCart();
    updateCartUI();
    renderCartModal();
  }

  function updateCartQty(itemId, delta) {
    var item = cart.find(function (c) { return c.id === itemId; });
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    saveCart();
    updateCartUI();
    renderCartModal();
  }

  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function updateCartUI() {
    var totalItems = cart.reduce(function (sum, c) { return sum + c.qty; }, 0);
    cartCount.textContent = totalItems;
    sidebarCartCount.textContent = totalItems;
  }

  function renderCartModal() {
    if (cart.length === 0) {
      cartBody.innerHTML = '<p class="text-center text-muted py-3">Your cart is empty.</p>';
      cartTotal.textContent = '0.00';
      return;
    }

    var total = 0;
    var html = '';
    cart.forEach(function (cartItem) {
      var item = menuItems.find(function (m) { return m.id === cartItem.id; });
      if (!item) return;
      var subtotal = item.price * cartItem.qty;
      total += subtotal;
      html +=
        '<div class="cart-item">' +
        '  <img src="' + item.image + '" alt="' + item.name + '">' +
        '  <div class="cart-item-details">' +
        '    <h6>' + item.name + '</h6>' +
        '    <small>' + item.category + '</small>' +
        '  </div>' +
        '  <div class="cart-item-qty">' +
        '    <button onclick="window.dashboardUpdateQty(' + item.id + ', -1)">−</button>' +
        '    <span>' + cartItem.qty + '</span>' +
        '    <button onclick="window.dashboardUpdateQty(' + item.id + ', 1)">+</button>' +
        '  </div>' +
        '  <span class="cart-item-price">$' + subtotal.toFixed(2) + '</span>' +
        '  <button class="cart-item-remove" onclick="window.dashboardRemoveFromCart(' + item.id + ')">' +
        '    <i class="fas fa-trash"></i>' +
        '  </button>' +
        '</div>';
    });
    cartBody.innerHTML = html;
    cartTotal.textContent = total.toFixed(2);
  }

  // Expose cart functions globally for inline onclick handlers
  window.dashboardUpdateQty = updateCartQty;
  window.dashboardRemoveFromCart = removeFromCart;

  // Render cart when modal is opened
  document.getElementById('cartModal').addEventListener('show.bs.modal', function () {
    renderCartModal();
  });

  // ===== Wishlist =====
  function toggleWishlist(itemId) {
    var index = wishlist.indexOf(itemId);
    if (index === -1) {
      wishlist.push(itemId);
    } else {
      wishlist.splice(index, 1);
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
    filterMenu(); // Re-render to update heart icons
  }

  function updateWishlistUI() {
    wishlistCount.textContent = wishlist.length;
  }

  // ===== Checkout =====
  checkoutBtn.addEventListener('click', function () {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    // Build order object
    var orderItems = [];
    var total = 0;
    cart.forEach(function (c) {
      var item = menuItems.find(function (m) { return m.id === c.id; });
      if (item) {
        var subtotal = item.price * c.qty;
        total += subtotal;
        orderItems.push({
          name: item.name,
          category: item.category,
          price: item.price,
          qty: c.qty,
          subtotal: subtotal,
          image: item.image
        });
      }
    });

    var order = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      items: orderItems,
      total: total,
      status: 'Confirmed'
    };

    orders.unshift(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    updateOrdersUI();

    alert('Order placed successfully! Total: $' + total.toFixed(2));
    cart = [];
    saveCart();
    updateCartUI();
    renderCartModal();
    bootstrap.Modal.getInstance(document.getElementById('cartModal')).hide();
  });

  // ===== Orders =====
  function updateOrdersUI() {
    ordersCount.textContent = orders.length;
  }

  function renderOrdersModal() {
    if (orders.length === 0) {
      ordersBody.innerHTML = '<p class="text-center text-muted py-3">No orders yet. Start adding items to your cart!</p>';
      return;
    }

    var html = '';
    orders.forEach(function (order) {
      html +=
        '<div class="order-card mb-3">' +
        '  <div class="order-header">' +
        '    <div>' +
        '      <strong>Order #' + order.id + '</strong>' +
        '      <br><small class="text-muted">' + order.date + '</small>' +
        '    </div>' +
        '    <div class="text-end">' +
        '      <span class="order-status">' + order.status + '</span>' +
        '      <br><strong class="text-danger">$' + order.total.toFixed(2) + '</strong>' +
        '    </div>' +
        '  </div>' +
        '  <div class="order-items">';

      order.items.forEach(function (item) {
        html +=
          '<div class="order-item">' +
          '  <img src="' + item.image + '" alt="' + item.name + '">' +
          '  <div class="order-item-info">' +
          '    <span class="order-item-name">' + item.name + '</span>' +
          '    <small class="text-muted">' + item.category + '</small>' +
          '  </div>' +
          '  <span class="order-item-qty">x' + item.qty + '</span>' +
          '  <span class="order-item-price">$' + item.subtotal.toFixed(2) + '</span>' +
          '</div>';
      });

      html += '  </div></div>';
    });

    ordersBody.innerHTML = html;
  }

  // Render orders when modal opens
  document.getElementById('ordersModal').addEventListener('show.bs.modal', function () {
    renderOrdersModal();
  });

  // Clear order history
  clearOrdersBtn.addEventListener('click', function () {
    if (confirm('Clear all order history?')) {
      orders = [];
      localStorage.setItem('orders', JSON.stringify(orders));
      updateOrdersUI();
      renderOrdersModal();
    }
  });

  // Init orders count on load
  updateOrdersUI();

  // ===== Contact Form =====
  document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
    bootstrap.Modal.getInstance(document.getElementById('contactModal')).hide();
  });

  // ===== Logout =====
  logoutBtn.addEventListener('click', function () {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    window.location.href = 'index.html';
  });
});
