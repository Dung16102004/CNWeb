// BÀI TẬP REACT CRUD: App, SearchForm, AddUser, ResultTable
// Các thao tác thêm/sửa/xóa cập nhật state phía trình duyệt, không ghi lên API.

const { useState, useEffect, useCallback } = React;

const EMPTY_USER = {
  name: "",
  username: "",
  email: "",
  address: { street: "", suite: "", city: "" },
  phone: "",
  website: ""
};

const FORM_FIELDS = [
  { id: "name", label: "Họ và tên", required: true },
  { id: "username", label: "Username", required: true },
  { id: "email", label: "Email", type: "email" },
  { id: "phone", label: "Số điện thoại" },
  { id: "street", label: "Đường" },
  { id: "suite", label: "Số nhà / Căn hộ" },
  { id: "city", label: "Thành phố" },
  { id: "website", label: "Website" }
];

// Icon SVG nét mảnh (không cần cài thêm thư viện).
function Icon({ name, size = 18 }) {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  if (name === "users") return <svg {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
  if (name === "search") return <svg {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
  if (name === "plus") return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
  if (name === "edit") return <svg {...props}><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L9 17l-4 1 1-4Z"/></svg>;
  if (name === "trash") return <svg {...props}><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 10v6M14 10v6"/></svg>;
  return null;
}

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.length ? (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase() : "?";
}

function cloneUser(user) {
  return { ...user, address: { ...EMPTY_USER.address, ...(user.address || {}) } };
}

// Cập nhật state bất biến, kể cả trường lồng nhau trong address.
function updateFormField(currentUser, id, value) {
  if (["street", "suite", "city"].includes(id)) {
    return {
      ...currentUser,
      address: { ...currentUser.address, [id]: value }
    };
  }
  return { ...currentUser, [id]: value };
}

// Form tái sử dụng cho cả Thêm và Sửa.
function UserFields({ value, onFieldChange }) {
  return (
    <div className="form-grid">
      {FORM_FIELDS.map((field) => {
        const isAddress = ["street", "suite", "city"].includes(field.id);
        const fieldValue = isAddress ? value.address[field.id] : value[field.id];
        return (
          <label className="field" key={field.id}>
            <span>{field.label}{field.required && <b className="required"> *</b>}</span>
            <input
              id={field.id}
              type={field.type || "text"}
              value={fieldValue || ""}
              onChange={(event) => onFieldChange(field.id, event.target.value)}
              required={Boolean(field.required)}
              placeholder={`Nhập ${field.label.toLowerCase()}`}
            />
          </label>
        );
      })}
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="modal-overlay" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="modal-content" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button type="button" className="icon-button" aria-label="Đóng" onClick={onClose}>×</button>
        </div>
        {children}
      </section>
    </div>
  );
}

// Component 1: tìm kiếm; gửi từ khóa từ SearchForm lên App.
function SearchForm({ onChangeValue }) {
  const [inputValue, setInputValue] = useState("");
  function handleChange(event) {
    const next = event.target.value;
    setInputValue(next);
    onChangeValue(next);
  }
  return (
    <label className="search-field">
      <span className="visually-hidden">Tìm người dùng</span>
      <span aria-hidden="true" className="search-icon"><Icon name="search" size={20} /></span>
      <input type="search" value={inputValue} onChange={handleChange}
        placeholder="Tìm theo tên hoặc username..." />
    </label>
  );
}

// Component 2: form thêm người dùng; gửi đối tượng mới về App qua onAdd.
function AddUser({ onAdd }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(cloneUser(EMPTY_USER));
  const [message, setMessage] = useState("");

  function changeField(id, value) {
    setForm((prev) => updateFormField(prev, id, value));
  }

  function handleAdd(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.username.trim()) {
      setMessage("Vui lòng nhập Họ và tên và Username.");
      return;
    }
    onAdd(cloneUser({ ...form, name: form.name.trim(), username: form.username.trim() }));
    setForm(cloneUser(EMPTY_USER));
    setMessage("");
    setAdding(false);
  }

  return (
    <>
      <button className="btn btn-primary" onClick={() => setAdding(true)} type="button">
        <Icon name="plus" size={21} /> Thêm người dùng
      </button>
      {adding && (
        <Modal title="Thêm người dùng" onClose={() => { setAdding(false); setMessage(""); }}>
          <form onSubmit={handleAdd}>
            <UserFields value={form} onFieldChange={changeField} />
            {message && <p role="alert" className="error-message">{message}</p>}
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => { setAdding(false); setMessage(""); }}>Hủy</button>
              <button type="submit" className="btn btn-primary">Lưu người dùng</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

// Component 3: lấy dữ liệu API, hiển thị, lọc, sửa và xóa.
function ResultTable({ keyword, user, onAdded, onCountChange }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [editing, setEditing] = useState(null);

  // Báo số người dùng lên App để hiển thị trên banner thống kê.
  useEffect(() => {
    if (!loading) onCountChange(users.length);
  }, [users.length, loading, onCountChange]);

  // useEffect chạy khi mount: đọc dữ liệu mẫu từ JSONPlaceholder.
  useEffect(() => {
    const controller = new AbortController();
    fetch("https://jsonplaceholder.typicode.com/users", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setLoadError("Không thể tải dữ liệu từ API. Hãy kiểm tra kết nối Internet và tải lại trang.");
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  // Sau khi App gửi người dùng mới, ResultTable thêm vào mảng users.
  useEffect(() => {
    if (!user) return;
    setUsers((prev) => {
      const newId = Math.max(0, ...prev.map((u) => Number(u.id) || 0)) + 1;
      return [...prev, { ...cloneUser(user), id: newId }];
    });
    onAdded(); // Thông báo App đã nhận, tránh thêm lặp lại.
  }, [user, onAdded]);

  const filteredUsers = users.filter((u) => {
    const key = keyword.trim().toLowerCase();
    return String(u.name || "").toLowerCase().includes(key)
      || String(u.username || "").toLowerCase().includes(key);
  });

  function editUser(selected) {
    setEditing(cloneUser(selected)); // Sao chép cả address, không sửa trực tiếp dữ liệu gốc.
  }

  function changeEditField(id, value) {
    setEditing((prev) => updateFormField(prev, id, value));
  }

  function saveUser(event) {
    event.preventDefault();
    if (!editing.name.trim() || !editing.username.trim()) return;
    setUsers((prev) => prev.map((u) => u.id === editing.id ? cloneUser(editing) : u));
    setEditing(null);
  }

  function removeUser(id) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  function formatAddress(address) {
    if (!address) return "—";
    return [address.street, address.suite, address.city].filter(Boolean).join(", ") || "—";
  }

  return (
    <section className="table-section">
      {loadError && <p role="alert" className="error-banner">{loadError}</p>}
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Họ tên</th><th>Username</th><th>Email</th>
              <th>Địa chỉ</th><th>Số điện thoại</th><th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="empty-cell">Đang tải người dùng...</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan="7" className="empty-cell">Không tìm thấy người dùng nào.</td></tr>
            ) : filteredUsers.map((u) => (
              <tr key={u.id}>
                <td className="id-cell">#{u.id}</td>
                <td>
                  <div className="user-name">
                    <span className={`avatar avatar-${Number(u.id) % 6}`} aria-hidden="true">{getInitials(u.name)}</span>
                    <span className="name-cell">{u.name}</span>
                  </div>
                </td>
                <td className="username-cell">{u.username}</td>
                <td className="email-cell">{u.email || "—"}</td>
                <td className="address-cell">{formatAddress(u.address)}</td>
                <td className="phone-cell">{u.phone || "—"}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-edit" type="button" onClick={() => editUser(u)}><Icon name="edit" size={16}/> Sửa</button>
                    <button className="btn btn-delete" type="button" onClick={() => removeUser(u.id)}><Icon name="trash" size={16}/> Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-bottom">
        <span>Hiển thị <strong>{filteredUsers.length}</strong> / {users.length} người dùng</span>
        <span className="table-bottom-tip">Dữ liệu mẫu từ JSONPlaceholder</span>
      </div>
      {editing && (
        <Modal title={`Sửa người dùng #${editing.id}`} onClose={() => setEditing(null)}>
          <form onSubmit={saveUser}>
            <UserFields value={editing} onFieldChange={changeEditField} />
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setEditing(null)}>Hủy</button>
              <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}

// Component gốc: chứa 2 state cần chia sẻ theo yêu cầu của bài tập.
function App() {
  const [kw, setKeyword] = useState("");
  const [newUser, setNewUser] = useState(null);
  const [totalCount, setTotalCount] = useState(null);
  const handleAdded = useCallback(() => setNewUser(null), []);

  return (
    <main className="container">
      <header className="hero">
        <div className="hero-decor hero-decor-top" aria-hidden="true"></div>
        <div className="hero-decor hero-decor-bottom" aria-hidden="true"></div>
        <div className="hero-copy">
          <span className="hero-eyebrow"><Icon name="users" size={16} /> Bài tập React CRUD</span>
          <h1>Quản lý người dùng</h1>
          <p>Tìm kiếm, thêm mới, cập nhật và xóa người dùng – xây dựng với React<br className="desktop-break" /> Hooks và State Lifting.</p>
        </div>
        <div className="hero-stat" aria-live="polite">
          <span className="hero-stat-icon"><Icon name="users" size={27} /></span>
          <span className="hero-stat-copy"><span className="hero-stat-label">Tổng người dùng</span><strong>{totalCount === null ? "…" : totalCount}</strong></span>
        </div>
      </header>

      <section className="workspace" aria-label="Danh sách quản lý người dùng">
        <div className="toolbar">
          <SearchForm onChangeValue={setKeyword} />
          <AddUser onAdd={setNewUser} />
        </div>
        <ResultTable keyword={kw} user={newUser} onAdded={handleAdded} onCountChange={setTotalCount} />
      </section>
      <footer className="footer">Các thao tác Thêm, Sửa và Xóa chỉ được lưu trong phiên sử dụng trên trình duyệt.</footer>
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
