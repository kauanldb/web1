const inventory = [
  { name: 'Arroz Tipo 1', category: 'mercearia', quantity: 24, price: 6.90, alert: 10 },
  { name: 'Detergente 500ml', category: 'limpeza', quantity: 8, price: 4.80, alert: 6 },
  { name: 'Cerveja Pilsen', category: 'bebidas', quantity: 42, price: 3.50, alert: 12 },
  { name: 'Sabonete Neutro', category: 'higiene', quantity: 14, price: 2.40, alert: 8 },
  { name: 'Macarrão Espaguete', category: 'mercearia', quantity: 18, price: 5.20, alert: 7 },
];

const inventoryBody = document.querySelector('#inventoryBody');
const totalProdutos = document.querySelector('#totalProdutos');
const emEstoque = document.querySelector('#emEstoque');
const alertasEstoque = document.querySelector('#alertasEstoque');
const valorEstoque = document.querySelector('#valorEstoque');
const promoCount = document.querySelector('#promoCount');
const reorderCount = document.querySelector('#reorderCount');
const expiryCount = document.querySelector('#expiryCount');
const stockLevelBar = document.querySelector('#stockLevelBar');
const alertLevelBar = document.querySelector('#alertLevelBar');
const searchInput = document.querySelector('#searchInput');
const filters = document.querySelectorAll('.filter');
const productForm = document.querySelector('#productForm');
const loginForm = document.querySelector('#loginForm');
const loginUser = document.querySelector('#loginUser');
const loginPassword = document.querySelector('#loginPassword');
const loginError = document.querySelector('#loginError');
const loginScreen = document.querySelector('#loginScreen');
const appShell = document.querySelector('#appShell');
const logoutButton = document.querySelector('#logoutButton');

let currentCategory = 'todos';
let currentSearch = '';

const credentials = {
  username: 'kauanldb',
  password: '2003',
};

function showApp() {
  loginScreen.classList.add('hidden');
  appShell.classList.remove('hidden');
}

function showLogin() {
  loginScreen.classList.remove('hidden');
  appShell.classList.add('hidden');
  loginError.textContent = '';
  loginForm.reset();
}

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function getStatus(item) {
  const ratio = item.quantity / Math.max(item.alert, 1);
  if (item.quantity <= item.alert) return { label: 'Baixo', className: 'status-pill status-low' };
  if (ratio <= 2) return { label: 'Atenção', className: 'status-pill status-medium' };
  return { label: 'Estável', className: 'status-pill status-ok' };
}

function getFilteredInventory() {
  return inventory.filter((item) => {
    const matchesCategory = currentCategory === 'todos' || item.category === currentCategory;
    const matchesSearch = item.name.toLowerCase().includes(currentSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}

function renderInventory() {
  const filtered = getFilteredInventory();
  inventoryBody.innerHTML = filtered.map((item) => {
    const status = getStatus(item);
    return `
      <tr>
        <td>${item.name}</td>
        <td>${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</td>
        <td>${item.quantity}</td>
        <td>${formatCurrency(item.price)}</td>
        <td><span class="${status.className}">${status.label}</span></td>
      </tr>
    `;
  }).join('');
}

function renderSummary() {
  const totalUnits = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = inventory.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const lowStockCount = inventory.filter((item) => item.quantity <= item.alert).length;
  const promoAmount = inventory.filter((item) => item.price <= 5).length;
  const reorderAmount = inventory.filter((item) => item.quantity <= item.alert * 2).length;
  const expiryAmount = inventory.filter((item) => item.category === 'mercearia' && item.quantity <= 12).length;
  const maxStock = inventory.length * 60 || 1;

  totalProdutos.textContent = inventory.length;
  emEstoque.textContent = totalUnits;
  alertasEstoque.textContent = lowStockCount;
  valorEstoque.textContent = formatCurrency(totalValue);
  promoCount.textContent = promoAmount;
  reorderCount.textContent = reorderAmount;
  expiryCount.textContent = expiryAmount;
  stockLevelBar.style.width = `${Math.min(100, Math.round((totalUnits / maxStock) * 100))}%`;
  alertLevelBar.style.width = `${Math.min(100, Math.round((lowStockCount / Math.max(inventory.length, 1)) * 100))}%`;
}

function refreshUI() {
  renderInventory();
  renderSummary();
}

searchInput.addEventListener('input', (event) => {
  currentSearch = event.target.value;
  refreshUI();
});

filters.forEach((button) => {
  button.addEventListener('click', () => {
    filters.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    currentCategory = button.dataset.category;
    refreshUI();
  });
});

productForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.querySelector('#productName').value.trim();
  const category = document.querySelector('#productCategory').value;
  const quantity = Number(document.querySelector('#productQuantity').value);
  const price = Number(document.querySelector('#productPrice').value);
  const alert = Number(document.querySelector('#productAlert').value);

  if (!name || quantity < 0 || price < 0 || alert < 0) return;

  inventory.unshift({ name, category, quantity, price, alert });
  productForm.reset();
  document.querySelector('#productQuantity').value = 10;
  document.querySelector('#productPrice').value = 5.0;
  document.querySelector('#productAlert').value = 5;
  currentCategory = 'todos';
  filters.forEach((btn) => btn.classList.toggle('active', btn.dataset.category === 'todos'));
  refreshUI();
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const user = loginUser.value.trim();
  const password = loginPassword.value.trim();

  if (user === credentials.username && password === credentials.password) {
    loginError.textContent = '';
    showApp();
    refreshUI();
    return;
  }

  loginError.textContent = 'Usuário ou senha incorretos.';
});

logoutButton.addEventListener('click', () => {
  showLogin();
});

showLogin();
