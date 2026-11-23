# Bài tập React CRUD – Công nghệ Web IT4409

Ứng dụng React gồm 4 component: `App`, `SearchForm`, `AddUser`, `ResultTable`.
Cấu trúc được làm theo tài liệu **Ex. React-CRUD - 20261.pdf**.

## Tệp của dự án

- `index.html`: Tạo `div#root`, nhúng React 18, ReactDOM 18 và Babel qua CDN.
- `style.css`: Giao diện tím gradient, ô thống kê, avatar tên, bảng xen kẽ và modal; responsive theo kích thước màn hình.
- `app.jsx`: Chứa code React để tìm kiếm, hiển thị, thêm, sửa và xóa.
- `BAO_CAO_MAU.md`: Dàn ý báo cáo để tự bổ sung ảnh, lỗi thực tế và các link nộp bài.

## Chạy trong VS Code

1. Giải nén dự án và mở thư mục `react-crud-giao-dien-tim` bằng VS Code.
2. Cài extension **Live Server** nếu máy chưa cài.
3. Nhấp chuột phải `index.html` → **Open with Live Server**.
4. Browser mở địa chỉ tương tự `http://127.0.0.1:5500/index.html`.
5. Cần Internet khi mở trang: React/Babel sử dụng CDN và dữ liệu lấy từ JSONPlaceholder.

**Không cần chạy `npm install` hoặc `npm start`** với bản React CDN này.

## Nếu đã có phiên bản cũ và muốn thay giao diện

- Chỉ cần thay **3 file** `index.html`, `style.css`, `app.jsx` ở cùng thư mục đang chạy trên VS Code bằng file mới trong ZIP.
- Giữ nguyên các file cá nhân khác của bạn. Nếu trình duyệt còn CSS cũ, nhấn **Ctrl + F5**.
- Nên phóng to cửa sổ Chrome để nhìn đủ các cột của bảng; với màn hình nhỏ, bảng có thanh cuộn ngang.
- Số "Tổng người dùng" ở banner được `ResultTable` gửi lên `App` bằng prop `onCountChange` để tự cập nhật sau khi thêm/xóa.


## Kiểm thử

- Hiển thị 10 users ban đầu từ `https://jsonplaceholder.typicode.com/users`.
- Gõ tên/username vào ô tìm kiếm và xem kết quả được lọc.
- Nhấn **Thêm người dùng**, điền họ tên + username, nhấn lưu.
- Nhấn **Sửa**, đổi thông tin rồi **Lưu thay đổi**.
- Nhấn **Xóa**, kiểm tra hàng đã biến mất.
- Thử nhập thiếu họ tên và username để thấy kiểm tra hợp lệ.

**Lưu ý:** Bài học minh họa CRUD phía client theo PDF. Thêm/sửa/xóa dùng React state,
chưa lưu vĩnh viễn lên server. Refresh trang sẽ tải lại dữ liệu gốc từ JSONPlaceholder.

## Đăng GitHub Pages

1. Tạo repo GitHub mới, ví dụ `react-crud-it4409` (Public).
2. Mở Terminal tại thư mục dự án:

   ```bash
   git init
   git add .
   git commit -m "feat: react crud assignment"
   git branch -M main
   git remote add origin https://github.com/USERNAME/react-crud-it4409.git
   git push -u origin main
   ```

3. Thay `USERNAME` bằng tên GitHub của bạn và đảm bảo repo đã được tạo.
4. Vào repo → **Settings** → **Pages** → **Build and deployment**.
5. Chọn **Deploy from a branch** → branch `main` → folder `/(root)` → **Save**.
6. Khi GitHub Pages xuất bản, đường dẫn thường có dạng
   `https://USERNAME.github.io/react-crud-it4409/`.

## Lưu ý về lỗi trong tài liệu

- `onClick={setAdding(false)}` chạy ngay khi render. Cách đúng: `onClick={() => setAdding(false)}`.
- Không sửa trực tiếp `user.address.street`; tạo bản sao với spread operator `...`.
- Nếu dùng `id = users.length + 1` sau khi xóa, có thể trùng ID. Dùng `Math.max(...ids) + 1`.
