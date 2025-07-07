// Cart functionality
let cart = []
let currentSection = "inicio"

// DOM Elements
const cartBtn = document.getElementById("cart-btn")
const cartBtnMobile = document.getElementById("cart-btn-mobile")
const cartModal = document.getElementById("cart-modal")
const closeCartBtn = document.getElementById("close-cart")
const cartItems = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const cartCount = document.getElementById("cart-count")
const cartCountMobile = document.getElementById("cart-count-mobile")
const clearCartBtn = document.getElementById("clear-cart")
const checkoutBtn = document.getElementById("checkout")
const productsGrid = document.getElementById("products-grid")
const mobileMenuBtn = document.getElementById("mobile-menu-btn")
const mobileMenu = document.getElementById("mobile-menu")
const navLinks = document.querySelectorAll(".nav-link")
const navLinksMobile = document.querySelectorAll(".nav-link-mobile")

// Products data with icons
const products = [
  { id: 1, name: "Brainrot 1", price: 1.0, icon: "fas fa-star" },
  { id: 2, name: "Brainrot 2", price: 1.0, icon: "fas fa-bolt" },
  { id: 3, name: "Brainrot 3", price: 1.0, icon: "fas fa-fire" },
  { id: 4, name: "Brainrot 4", price: 1.0, icon: "fas fa-gem" },
  { id: 5, name: "Brainrot 5", price: 1.0, icon: "fas fa-star" },
  { id: 6, name: "Brainrot 6", price: 1.0, icon: "fas fa-crown" },
  { id: 7, name: "Brainrot 7", price: 1.0, icon: "fas fa-rocket" },
  { id: 8, name: "Brainrot 8", price: 1.0, icon: "fas fa-star" },
  { id: 9, name: "Brainrot 9", price: 1.0, icon: "fas fa-sparkles" },
  { id: 10, name: "Brainrot 10", price: 1.0, icon: "fas fa-bullseye" },
  { id: 11, name: "Brainrot 11", price: 1.0, icon: "fas fa-gamepad" },
  { id: 12, name: "Brainrot 12", price: 1.0, icon: "fas fa-trophy" },
  { id: 13, name: "Brainrot 13", price: 1.0, icon: "fas fa-dollar-sign" },
  { id: 14, name: "Brainrot 14", price: 1.0, icon: "fas fa-magic" },
  { id: 15, name: "Brainrot 15", price: 1.0, icon: "fas fa-rainbow" },
]

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  generateProducts()
  setupEventListeners()
  updateCartDisplay()
  setupScrollEffects()
})

// Generate product cards
function generateProducts() {
  productsGrid.innerHTML = ""

  products.forEach((product) => {
    const productCard = document.createElement("div")
    productCard.className = "product-card"
    productCard.innerHTML = `
            <div class="product-image">
                <i class="${product.icon}"></i>
            </div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">R$ ${product.price.toFixed(2)}</p>
            <button class="btn btn-primary btn-add-cart" data-id="${product.id}">
                <i class="fas fa-plus"></i>
                Adicionar ao Carrinho
            </button>
        `
    productsGrid.appendChild(productCard)
  })

  // Add event listeners to add-to-cart buttons
  document.querySelectorAll(".btn-add-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = Number.parseInt(this.getAttribute("data-id"))
      addToCart(productId)

      // Visual feedback
      this.style.transform = "scale(0.95)"
      this.innerHTML = '<i class="fas fa-check"></i> Adicionado!'
      setTimeout(() => {
        this.style.transform = "scale(1)"
        this.innerHTML = '<i class="fas fa-plus"></i> Adicionar ao Carrinho'
      }, 1000)
    })
  })
}

// Setup event listeners
function setupEventListeners() {
  // Mobile menu toggle
  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("active")
    mobileMenuBtn.classList.toggle("active")
  })

  // Navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      const section = this.getAttribute("data-section")
      scrollToSection(section)
      updateActiveNavLink(section)
    })
  })

  navLinksMobile.forEach((link) => {
    link.addEventListener("click", function () {
      const section = this.getAttribute("data-section")
      scrollToSection(section)
      updateActiveNavLink(section)
      mobileMenu.classList.remove("active")
      mobileMenuBtn.classList.remove("active")
    })
  })

  // Cart modal
  cartBtn.addEventListener("click", openCartModal)
  cartBtnMobile.addEventListener("click", () => {
    openCartModal()
    mobileMenu.classList.remove("active")
    mobileMenuBtn.classList.remove("active")
  })
  closeCartBtn.addEventListener("click", closeCartModal)

  // Close modal when clicking outside
  cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) {
      closeCartModal()
    }
  })

  // Cart actions
  clearCartBtn.addEventListener("click", clearCart)
  checkoutBtn.addEventListener("click", handlePurchase)
}

// Setup scroll effects
function setupScrollEffects() {
  window.addEventListener("scroll", () => {
    updateActiveNavOnScroll()
  })
}

// Scroll to section
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: "smooth" })
  }
}

// Update active nav link
function updateActiveNavLink(activeSection) {
  currentSection = activeSection

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("data-section") === activeSection) {
      link.classList.add("active")
    }
  })
}

// Update active nav link based on scroll position
function updateActiveNavOnScroll() {
  const sections = ["inicio", "brainrots", "sobre"]
  let current = ""

  sections.forEach((sectionId) => {
    const section = document.getElementById(sectionId)
    const rect = section.getBoundingClientRect()

    if (rect.top <= 100 && rect.bottom >= 100) {
      current = sectionId
    }
  })

  if (current && current !== currentSection) {
    updateActiveNavLink(current)
  }
}

// Add product to cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      icon: product.icon,
      quantity: 1,
    })
  }

  updateCartDisplay()
  showNotification(`${product.name} adicionado ao carrinho!`)
}

// Remove item from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  updateCartDisplay()
  renderCartItems()
}

// Update quantity
function updateQuantity(productId, quantity) {
  if (quantity === 0) {
    removeFromCart(productId)
    return
  }

  cart = cart.map((item) => (item.id === productId ? { ...item, quantity } : item))

  updateCartDisplay()
  renderCartItems()
}

// Get total price
function getTotalPrice() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0)
}

// Get total items
function getTotalItems() {
  return cart.reduce((total, item) => total + item.quantity, 0)
}

// Update cart display
function updateCartDisplay() {
  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  cartCount.textContent = totalItems
  cartCountMobile.textContent = totalItems
  cartTotal.textContent = totalPrice.toFixed(2)
}

// Open cart modal
function openCartModal() {
  cartModal.style.display = "block"
  renderCartItems()
  document.body.style.overflow = "hidden"
}

// Close cart modal
function closeCartModal() {
  cartModal.style.display = "none"
  document.body.style.overflow = "auto"
}

// Render cart items
function renderCartItems() {
  if (cart.length === 0) {
    cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Seu carrinho está vazio</p>
            </div>
        `
    return
  }

  cartItems.innerHTML = ""

  cart.forEach((item) => {
    const cartItem = document.createElement("div")
    cartItem.className = "cart-item"
    cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-icon">
                    <i class="${item.icon}"></i>
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>R$ ${item.price.toFixed(2)} cada</p>
                </div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `
    cartItems.appendChild(cartItem)
  })
}

// Clear cart
function clearCart() {
  if (cart.length === 0) return

  if (confirm("Tem certeza que deseja limpar o carrinho?")) {
    cart = []
    updateCartDisplay()
    renderCartItems()
    showNotification("Carrinho limpo!")
  }
}

// Handle purchase
function handlePurchase() {
  if (cart.length === 0) {
    showNotification("Seu carrinho está vazio!", "error")
    return
  }

  // Generate WhatsApp message
  let message = "🎮 *PEDIDO DE BRAINROT* 🎮%0A%0A"
  message += "📋 *Itens selecionados:*%0A"

  cart.forEach((item) => {
    message += `• ${item.name} - Qtd: ${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}%0A`
  })

  const total = getTotalPrice()
  message += `%0A💰 *Total: R$ ${total.toFixed(2)}*%0A%0A`
  message += "✨ Obrigado por escolher nossa loja de brainrots exclusivos!"

  // WhatsApp number and URL
  const phoneNumber = "5516996361601"
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

  // Open WhatsApp
  window.open(whatsappUrl, "_blank")

  // Clear cart after sending
  cart = []
  updateCartDisplay()
  closeCartModal()

  showNotification("Pedido enviado para WhatsApp! 🎉")
}

// Show notification
function showNotification(message, type = "success") {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
        <i class="fas fa-${type === "success" ? "check-circle" : "exclamation-circle"}"></i>
        <span>${message}</span>
    `

  // Add notification styles
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === "success" ? "linear-gradient(45deg, #10b981, #059669)" : "linear-gradient(45deg, #ef4444, #dc2626)"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: bold;
        animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s forwards;
    `

  document.body.appendChild(notification)

  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification)
    }
  }, 3000)
}

// Add slide animations for notifications
const style = document.createElement("style")
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`
document.head.appendChild(style)
