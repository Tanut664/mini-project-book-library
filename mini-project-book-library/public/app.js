const $ = id => document.getElementById(id);
let books = [];

async function api(url, options) {
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'เกิดข้อผิดพลาด');
  return data;
}

function showToast(message) {
  const t = $('toast'); t.textContent = message; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

function renderStats() {
  const total = books.length;
  const available = books.filter(b => b.status === 'Available').length;
  const borrowed = books.filter(b => b.status === 'Borrowed').length;
  $('stats').innerHTML = `
    <div class="stat"><div class="label">หนังสือทั้งหมด</div><div class="value">${total}</div></div>
    <div class="stat"><div class="label">พร้อมยืม</div><div class="value">${available}</div></div>
    <div class="stat"><div class="label">ถูกยืม</div><div class="value">${borrowed}</div></div>`;
}

function renderTable() {
  const rows = $('bookRows');
  if (!books.length) { rows.innerHTML = '<tr><td colspan="6" class="empty">ไม่พบข้อมูลหนังสือ</td></tr>'; return; }
  rows.innerHTML = books.map(b => `
    <tr>
      <td><div class="book-title">${escapeHtml(b.title)}</div></td>
      <td>${escapeHtml(b.author)}</td>
      <td><span class="muted">${escapeHtml(b.category)}</span></td>
      <td>${b.year || '-'}</td>
      <td><span class="badge ${b.status === 'Available' ? 'available' : 'borrowed'}">${b.status === 'Available' ? 'พร้อมยืม' : 'ถูกยืม'}</span></td>
      <td><div class="actions"><button class="icon-btn" onclick="editBook(${b.id})">แก้ไข</button><button class="icon-btn delete" onclick="deleteBook(${b.id})">ลบ</button></div></td>
    </tr>`).join('');
}

function escapeHtml(v) { return String(v ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

async function loadCategories() {
  const categories = await api('/api/categories');
  $('category').innerHTML = '<option value="">ทุกหมวดหมู่</option>' + categories.map(c => `<option>${escapeHtml(c)}</option>`).join('');
}

async function loadBooks() {
  const p = new URLSearchParams({ search: $('search').value, category: $('category').value, status: $('status').value });
  books = await api('/api/books?' + p.toString());
  renderStats(); renderTable();
}

function openModal(book) {
  $('modal').classList.remove('hidden');
  $('modalTitle').textContent = book ? 'แก้ไขข้อมูลหนังสือ' : 'เพิ่มหนังสือ';
  $('bookId').value = book?.id || '';
  $('title').value = book?.title || '';
  $('author').value = book?.author || '';
  $('bookCategory').value = book?.category || '';
  $('year').value = book?.year || '';
  $('bookStatus').value = book?.status || 'Available';
  $('title').focus();
}
function closeModal() { $('modal').classList.add('hidden'); $('bookForm').reset(); }

window.editBook = id => openModal(books.find(b => b.id === id));
window.deleteBook = async id => {
  const book = books.find(b => b.id === id);
  if (!confirm(`ต้องการลบ “${book.title}” ใช่หรือไม่?`)) return;
  try { await api('/api/books/' + id, { method:'DELETE' }); showToast('ลบหนังสือเรียบร้อยแล้ว'); await loadCategories(); await loadBooks(); }
  catch (e) { showToast(e.message); }
};

$('addBtn').onclick = () => openModal();
$('closeBtn').onclick = closeModal;
$('cancelBtn').onclick = closeModal;
$('modal').onclick = e => { if (e.target === $('modal')) closeModal(); };
$('bookForm').onsubmit = async e => {
  e.preventDefault();
  const id = $('bookId').value;
  const body = { title:$('title').value, author:$('author').value, category:$('bookCategory').value, year:$('year').value, status:$('bookStatus').value };
  try {
    await api(id ? '/api/books/' + id : '/api/books', { method:id ? 'PUT' : 'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
    closeModal(); showToast(id ? 'แก้ไขข้อมูลเรียบร้อยแล้ว' : 'เพิ่มหนังสือเรียบร้อยแล้ว');
    await loadCategories(); await loadBooks();
  } catch(e) { showToast(e.message); }
};

let timer;
$('search').oninput = () => { clearTimeout(timer); timer = setTimeout(loadBooks, 250); };
$('category').onchange = loadBooks;
$('status').onchange = loadBooks;

(async function init(){
  try { await api('/api/health'); $('apiStatus').textContent = '● API Connected'; await loadCategories(); await loadBooks(); }
  catch(e) { $('apiStatus').textContent = '● API Offline'; showToast(e.message); }
})();
