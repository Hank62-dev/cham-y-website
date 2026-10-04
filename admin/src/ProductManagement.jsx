import { useEffect, useMemo, useRef, useState } from 'react';
import { Boxes, ChevronDown, ImagePlus, LogOut, Pencil, Plus, RefreshCw, Search, Trash2, X, ZoomIn } from 'lucide-react';
import { adjustProductStock, createProduct, deleteProduct, editProduct, getProducts, toggleProduct } from './api';

const emptyForm = { productCode: '', name: '', slug: '', description: '', imageUrl: '', charmCount: 1, stock: 0, lowStockThreshold: 3, stockManaged: false, active: true, sortOrder: 0 };

function ProductManagement({ token, onLogout }) {
  const handleLogout = onLogout || (() => { localStorage.removeItem('cham-y-admin-token'); localStorage.removeItem('cham-y-admin-refresh-token'); window.location.reload(); });
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [confirm, setConfirm] = useState(null);
  const [confirmSaving, setConfirmSaving] = useState(false);
  const [stockEditor, setStockEditor] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [stockSaving, setStockSaving] = useState(false);

  async function load() {
    setLoading(true);
    try { const result = await getProducts(token, query, statusFilter); setProducts(result.data || []); setError(''); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [statusFilter]);
  useEffect(() => { document.body.dataset.adminView = 'products'; return () => { delete document.body.dataset.adminView; }; }, []);
  useEffect(() => { const openImage = (event) => { const imageBox = event.target.closest('.product-table-image'); if (!imageBox) return; const image = imageBox.querySelector('img'); if (!image) return; event.preventDefault(); event.stopPropagation(); setLightbox({ src: image.currentSrc || image.src, title: image.alt }); }; document.addEventListener('click', openImage, true); return () => document.removeEventListener('click', openImage, true); }, []);
  const pageCount = Math.max(1, Math.ceil(products.length / limit));
  const visibleProducts = useMemo(() => products.slice((page - 1) * limit, page * limit), [products, page, limit]);
  const lowStockCount = products.filter((product) => product.stockManaged && product.stock <= product.lowStockThreshold).length;
  useEffect(() => { if (page > pageCount) setPage(pageCount); }, [page, pageCount]);

  function openProduct(product = null) {
    setModal({ product, form: product ? { ...emptyForm, ...product, imageUrl: product.image || '' } : { ...emptyForm }, file: null });
  }

  function updateForm(name, value) { setModal((current) => ({ ...current, form: { ...current.form, [name]: value } })); }

  async function saveProduct(event) {
    event.preventDefault(); setSaving(true);
    const data = new FormData();
    Object.entries(modal.form).forEach(([key, value]) => data.append(key, String(value)));
    if (modal.file) data.append('image', modal.file);
    try { if (modal.product) await editProduct(token, modal.product._id, data); else await createProduct(token, data); setModal(null); await load(); }
    catch (e) { setError(e.message); }
    finally { setSaving(false); }
  }

  async function confirmAction() {
    if (!confirm) return;
    setConfirmSaving(true);
    try { if (confirm.type === 'delete') await deleteProduct(token, confirm.product._id); else await toggleProduct(token, confirm.product._id, confirm.type === 'show'); setConfirm(null); await load(); }
    catch (e) { setError(e.message); }
    finally { setConfirmSaving(false); }
  }

  async function saveStock() {
    if (!stockEditor) return;
    const next = Math.max(0, Math.floor(Number(stockEditor.value) || 0));
    setStockSaving(true);
    try { await adjustProductStock(token, stockEditor.product._id, next - (stockEditor.product.stock || 0)); setStockEditor(null); await load(); }
    catch (e) { setError(e.message); }
    finally { setStockSaving(false); }
  }

  return <div className="admin-shell">
    <header className="admin-top"><div className="brand">CHẠM Ý <small>PRODUCTS & INVENTORY</small></div><button className="logout" onClick={handleLogout}><LogOut size={14} /> Đăng xuất</button></header>
    <main className="admin-main products-page">
      <div className="admin-heading"><div><p className="eyebrow">KHO SẢN PHẨM</p><h1>Sản phẩm Chạm Ý</h1></div><button className="export" onClick={() => openProduct()}><Plus size={16} /> Thêm sản phẩm</button></div>
      <div className="product-stats"><article><span>Tổng sản phẩm</span><strong>{products.length}</strong></article><article><span>Đang bán</span><strong>{products.filter((product) => product.active).length}</strong></article><article><span>Sắp hết hàng</span><strong>{lowStockCount}</strong></article></div>
      <form className="product-toolbar" onSubmit={(event) => { event.preventDefault(); setPage(1); load(); }}><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tên hoặc mã sản phẩm" /><button type="submit">Tìm kiếm</button><StatusDropdown value={statusFilter} onChange={(value) => { setStatusFilter(value); setPage(1); }} /><button type="button" onClick={load}><RefreshCw size={15} /> Làm mới</button></form>
      {error && <div className="error">{error}</div>}
      <div className="product-table-wrap">
        <div className="product-table-head"><span>Ảnh</span><span>Sản phẩm</span><span>Charm</span><span>Tồn kho</span><span>Trạng thái</span><span>Thao tác</span></div>
        {loading ? <div className="product-table-loading"><span className="admin-spinner" /> Đang tải sản phẩm...</div> : visibleProducts.length ? visibleProducts.map((product) => <ProductRow key={product._id} product={product} onOpen={() => openProduct(product)} onImage={() => setLightbox({ src: product.image, title: product.name })} onStock={() => setStockEditor({ product, value: product.stock || 0 })} onToggle={() => setConfirm({ type: product.active ? 'hide' : 'show', product })} onDelete={() => setConfirm({ type: 'delete', product })} />) : <div className="product-empty">Chưa có sản phẩm.</div>}
      </div>
      <ProductPagination page={page} pageCount={pageCount} limit={limit} total={products.length} onPage={setPage} onLimit={(value) => { setLimit(Number(value)); setPage(1); }} />
    </main>
    {modal && <ProductForm modal={modal} setModal={setModal} update={updateForm} save={saveProduct} saving={saving} close={() => setModal(null)} />}
    {stockEditor && <StockModal editor={stockEditor} setEditor={setStockEditor} save={saveStock} saving={stockSaving} close={() => setStockEditor(null)} />}
    {confirm && <ConfirmModal confirm={confirm} close={() => setConfirmSaving(false) || setConfirm(null)} submit={confirmAction} saving={confirmSaving} />}
    {lightbox && <ProductLightbox lightbox={lightbox} close={() => setLightbox(null)} />}
  </div>;
}

function ProductRow({ product, onOpen, onImage, onStock, onToggle, onDelete }) {
  const [open, setOpen] = useState(false); const [position, setPosition] = useState({ top: 0, right: 0 }); const triggerRef = useRef(null);
  useEffect(() => { if (!open) return undefined; const closeOnOutside = (event) => { if (event.target !== triggerRef.current && !event.target.closest('.product-action-menu')) setOpen(false); }; document.addEventListener('mousedown', closeOnOutside); return () => document.removeEventListener('mousedown', closeOnOutside); }, [open]);
  const stop = (event) => event.stopPropagation();
  function toggleMenu(event) { event.stopPropagation(); const rect = event.currentTarget.getBoundingClientRect(); setPosition({ top: rect.bottom + 6, right: Math.max(10, window.innerWidth - rect.right) }); setOpen((value) => !value); }
  function choose(action) { setOpen(false); action(); }
  return <div className={`product-table-row ${!product.stockManaged ? 'stock-not-managed' : ''}`} onClick={onOpen} role="button" tabIndex="0" onKeyDown={(event) => { if (event.key === 'Enter') onOpen(); }}>
    <div className="product-table-image"><img src={product.image} alt={product.name} /></div><div className="product-table-name"><small>{product.productCode}</small><strong>{product.name}</strong><span>{product.description || 'Chưa có mô tả sản phẩm.'}</span></div><div className="product-table-charm"><span className="charm-count-badge">{product.charmCount} charm</span></div>
    <div className={`product-table-stock ${product.stockManaged && product.stock <= product.lowStockThreshold ? 'stock-low' : ''}`}>{product.stockManaged ? <><strong>{product.stock}</strong><small>sản phẩm</small></> : <span className="stock-warning-badge">Chưa bật tồn kho</span>}</div>
    <div><span className={`product-status ${product.active ? 'is-active' : ''}`}>{product.active ? 'Đang bán' : 'Ngừng bán'}</span></div>
    <div className="product-table-actions" onClick={stop}><button ref={triggerRef} className="product-action-menu-trigger" type="button" aria-label="Mở thao tác" onClick={toggleMenu}>•••</button>{open && <div className="product-action-menu" style={{ top: position.top, right: position.right }}><button type="button" onClick={() => choose(onOpen)}><Pencil size={14} /> Sửa</button><button type="button" onClick={() => choose(onStock)}><Boxes size={14} /> Tồn kho</button><button type="button" className="hide-product" onClick={() => choose(onToggle)}>{product.active ? 'Ngừng bán' : 'Đăng bán'}</button><button type="button" className="delete-product" onClick={() => choose(onDelete)}><Trash2 size={14} /> Xóa</button></div>}</div>
  </div>;
}

function ProductLightbox({ lightbox, close }) { const [zoom, setZoom] = useState(1); return <div className="image-lightbox" role="dialog" aria-modal="true" onClick={(event) => { event.stopPropagation(); close(); }}><button className="lightbox-close" type="button" onClick={close}><X size={22} /></button><div className="lightbox-content" onClick={(event) => event.stopPropagation()}><p>{lightbox.title}</p><div className="lightbox-toolbar"><button type="button" onClick={() => setZoom((value) => Math.max(.5, value - .25))}>−</button><button type="button" onClick={() => setZoom(1)}>100%</button><button type="button" onClick={() => setZoom((value) => Math.min(3, value + .25))}>+</button></div><img src={lightbox.src} alt={lightbox.title} style={{ transform: `scale(${zoom})` }} /></div></div>; }

function StatusDropdown({ value, onChange }) { const [open, setOpen] = useState(false); const ref = useRef(null); const options = [{ value: '', label: 'Tất cả trạng thái' }, { value: 'true', label: 'Đang bán' }, { value: 'false', label: 'Ngừng bán' }]; const selected = options.find((option) => option.value === value) || options[0]; useEffect(() => { if (!open) return undefined; const close = (event) => { if (!ref.current?.contains(event.target)) setOpen(false); }; document.addEventListener('mousedown', close); return () => document.removeEventListener('mousedown', close); }, [open]); return <div className="status-filter-dropdown" ref={ref}><button type="button" className="status-filter-trigger" onClick={() => setOpen((current) => !current)}>{selected.label}<ChevronDown size={16} strokeWidth={2.5} /></button>{open && <div className="status-filter-menu">{options.map((option) => <button type="button" key={option.value} className={option.value === value ? 'selected' : ''} onClick={() => { onChange(option.value); setOpen(false); }}>{option.label}</button>)}</div>}</div>; }

function PageSizeDropdown({ value, onChange }) { const [open, setOpen] = useState(false); const ref = useRef(null); useEffect(() => { if (!open) return undefined; const close = (event) => { if (!ref.current?.contains(event.target)) setOpen(false); }; document.addEventListener('mousedown', close); return () => document.removeEventListener('mousedown', close); }, [open]); return <div className="page-size-dropdown" ref={ref}><button type="button" className="page-size-trigger" onClick={() => setOpen((current) => !current)}>{value}<span>⌄</span></button>{open && <div className="page-size-menu">{[5, 10, 20].map((item) => <button type="button" key={item} className={Number(value) === item ? 'selected' : ''} onClick={() => { onChange(String(item)); setOpen(false); }}>{item}</button>)}</div>}</div>; }

function ProductPagination({ page, pageCount, limit, total, onPage, onLimit }) { return <div className="product-pagination"><span>{total} sản phẩm · Trang {page}/{pageCount}</span><div className="product-page-size">Hiện <PageSizeDropdown value={limit} onChange={onLimit} /> sản phẩm</div><div className="product-pagination-controls"><button disabled={page <= 1} onClick={() => onPage(page - 1)}>Trước</button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button key={number} className={number === page ? 'active-page' : ''} onClick={() => onPage(number)}>{number}</button>)}<button disabled={page >= pageCount} onClick={() => onPage(page + 1)}>Sau</button></div></div>; }

function ConfirmModal({ confirm, close, submit, saving }) { const deleting = confirm.type === 'delete'; const showing = confirm.type === 'show'; return <div className="admin-modal-backdrop" onClick={saving ? undefined : close}><div className="confirm-modal" onClick={(event) => event.stopPropagation()}><button className="reject-modal-close" type="button" onClick={close} disabled={saving}><X size={18} /></button><div className={`confirm-icon ${deleting ? 'danger' : 'warning'}`}>{deleting ? <Trash2 size={22} /> : '!'}</div><h2>{deleting ? 'Xóa sản phẩm?' : showing ? 'Đăng bán sản phẩm?' : 'Ngừng bán sản phẩm?'}</h2><p>{deleting ? `Sản phẩm “${confirm.product.name}” sẽ bị xóa khỏi hệ thống.` : showing ? `Sản phẩm “${confirm.product.name}” sẽ được hiển thị lại ở cửa hàng.` : `Sản phẩm “${confirm.product.name}” sẽ tạm ngừng hiển thị ở cửa hàng.`}</p><div className="confirm-actions"><button type="button" onClick={close} disabled={saving}>Hủy</button><button type="button" className={deleting ? 'confirm-delete' : 'confirm-hide'} onClick={submit} disabled={saving}>{saving && <span className="admin-spinner button-spinner" />}{saving ? 'Đang xử lý...' : deleting ? 'Xóa sản phẩm' : showing ? 'Đăng bán' : 'Ngừng bán'}</button></div></div></div>; }

function StockModal({ editor, setEditor, save, saving, close }) { return <div className="admin-modal-backdrop" onClick={close}><div className="stock-modal" onClick={(event) => event.stopPropagation()}><button className="reject-modal-close" type="button" onClick={close}><X size={18} /></button><p className="eyebrow">QUẢN LÝ TỒN KHO</p><h2>{editor.product.name}</h2><p className="stock-modal-note">Nhập số lượng sản phẩm hoàn chỉnh đang có trong kho.</p><label>Số lượng tồn<input type="number" min="0" autoFocus value={editor.value} onChange={(event) => setEditor((current) => ({ ...current, value: event.target.value }))} /></label><div className="confirm-actions"><button type="button" onClick={close} disabled={saving}>Hủy</button><button type="button" className="confirm-hide" onClick={save} disabled={saving}>{saving && <span className="admin-spinner button-spinner" />} {saving ? 'Đang lưu...' : 'Lưu tồn kho'}</button></div></div></div>; }

function ProductForm({ modal, setModal, update, save, saving, close }) {
  const { form, product } = modal;
  const [preview, setPreview] = useState(form.imageUrl || '');
  const [previewOpen, setPreviewOpen] = useState(false);
  useEffect(() => {
    if (!modal.file) { setPreview(form.imageUrl || ''); return undefined; }
    const objectUrl = URL.createObjectURL(modal.file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [modal.file, form.imageUrl]);
  return <><div className="admin-modal-backdrop" onClick={close}><form className="product-form-modal" onSubmit={save} onClick={(event) => event.stopPropagation()}><button className="reject-modal-close" type="button" onClick={close}><X size={18} /></button><p className="eyebrow">{product ? 'CHỈNH SỬA SẢN PHẨM' : 'SẢN PHẨM MỚI'}</p><h2>{product ? form.name : 'Thêm sản phẩm có sẵn'}</h2><div className="product-form-grid"><label>Mã sản phẩm<input required value={form.productCode} disabled={Boolean(product)} onChange={(event) => update('productCode', event.target.value)} /></label><label>Tên sản phẩm<input required value={form.name} onChange={(event) => update('name', event.target.value)} /></label><label>Slug<input required value={form.slug} onChange={(event) => update('slug', event.target.value)} /></label><label>Số charm<input type="number" min="1" max="3" value={form.charmCount} onChange={(event) => update('charmCount', event.target.value)} /></label><label>Tồn kho<input type="number" min="0" value={form.stock} onChange={(event) => update('stock', event.target.value)} /></label><label>Ngưỡng cảnh báo<input type="number" min="0" value={form.lowStockThreshold} onChange={(event) => update('lowStockThreshold', event.target.value)} /></label><label className="wide">Mô tả<textarea value={form.description} onChange={(event) => update('description', event.target.value)} /></label><label className="wide upload-product"><ImagePlus size={16} /> Ảnh sản phẩm<input type="file" accept="image/*" onChange={(event) => setModal((current) => ({ ...current, file: event.target.files?.[0] || null }))} />{modal.file?.name || (form.imageUrl ? 'Ảnh hiện tại' : 'Chọn ảnh hoặc dán URL bên dưới')}{preview && <img className="product-form-preview" src={preview} alt="Xem trước sản phẩm" onClick={(event) => { event.preventDefault(); event.stopPropagation(); setPreviewOpen(true); }} />}</label><label className="wide">URL ảnh<input value={form.imageUrl} onChange={(event) => update('imageUrl', event.target.value)} /></label><div className="checkbox-fields wide"><label className="checkbox-field"><input type="checkbox" checked={form.stockManaged} onChange={(event) => update('stockManaged', event.target.checked)} /> Bật quản lý tồn kho</label><label className="checkbox-field"><input type="checkbox" checked={form.active} onChange={(event) => update('active', event.target.checked)} /> Hiển thị trên cửa hàng</label></div></div><div className="product-form-actions"><button type="button" onClick={close} disabled={saving}>Hủy</button><button className="export" disabled={saving}>{saving && <span className="admin-spinner button-spinner" />}{saving ? 'Đang lưu...' : 'Lưu sản phẩm'}</button></div></form></div>{previewOpen && <ProductLightbox lightbox={{ src: preview, title: 'Xem trước sản phẩm' }} close={() => setPreviewOpen(false)} />}</>;
}

export default ProductManagement;
