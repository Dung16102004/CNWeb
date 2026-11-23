# BÁO CÁO BÀI TẬP REACT CRUD

**Môn học:** Công nghệ Web và Dịch vụ trực tuyến (IT4409)  
**Họ và tên:** [Điền]  
**MSSV:** [Điền]  
**Link website:** [Điền link GitHub Pages]  
**Link mã nguồn (nếu cần):** [Điền link GitHub]

## 1. Giới thiệu

Ứng dụng Quản lý người dùng được xây dựng bằng React. Ứng dụng đọc danh sách người dùng từ JSONPlaceholder và hỗ trợ tìm kiếm, thêm, sửa, xóa trong state phía trình duyệt.

## 2. Sơ đồ Component (Component Tree)

```text
App
├── SearchForm
├── AddUser
└── ResultTable
```

- App: quản lý hai state chung `kw`, `newUser` và `totalCount` để hiển thị thống kê.
- SearchForm: xử lý từ khóa tìm kiếm.
- AddUser: thu thập thông tin và gửi dữ liệu người dùng mới cho App.
- ResultTable: quản lý state `users`, lấy API, lọc, hiển thị, sửa, xóa.

[Chèn ảnh chụp trang web hoàn thiện]

## 3. Sơ đồ luồng dữ liệu (State Lifting)

```text
SearchForm -- onChangeValue(keyword) --> App (kw)
App (kw) -- keyword --> ResultTable

AddUser -- onAdd(user) --> App (newUser)
App (newUser) -- user --> ResultTable
ResultTable -- onAdded() --> App (đặt newUser về null)
ResultTable -- onCountChange(users.length) --> App (totalCount trên banner)
```

### Vì sao đặt kw và newUser ở App?

Vì từ khóa do SearchForm nhập cần được ResultTable sử dụng, và dữ liệu AddUser tạo cũng cần được ResultTable thêm vào danh sách. Trong React, hai component ngang cấp không trực tiếp chia sẻ state. Do đó, dữ liệu chung được nâng lên App (component cha gần nhất) và truyền xuống component con qua props theo nguyên tắc luồng dữ liệu một chiều.

## 4. Bảng Props

| Component nhận | Prop | Nguồn truyền | Ý nghĩa |
|---|---|---|---|
| SearchForm | `onChangeValue` | `App.setKeyword` | Cập nhật từ khóa ở App |
| AddUser | `onAdd` | `App.setNewUser` | Gửi thông tin người dùng mới lên App |
| ResultTable | `keyword` | `App.kw` | Từ khóa để lọc tên/username |
| ResultTable | `user` | `App.newUser` | Người dùng mới cần thêm |
| ResultTable | `onAdded` | `App.handleAdded` | Xóa dữ liệu newUser sau khi đã thêm |
| ResultTable | `onCountChange` | `App.setTotalCount` | Cập nhật thống kê số người dùng trên banner |

Ngoài ra, trong mã nguồn có hai component trình bày phụ: `Modal` và `UserFields` để tái sử dụng giao diện form. Chúng không thay đổi sơ đồ bốn component chức năng chính.

## 5. Kiểm thử các chức năng

| Chức năng | Các bước thực hiện | Kết quả mong đợi | Kết quả thực tế |
|---|---|---|---|
| Hiển thị | Mở trang | Hiện 10 user từ API | [Điền] |
| Tìm kiếm | Gõ `Leanne` | Hiện user phù hợp | [Điền] |
| Thêm | Nhập Name, Username, nhấn Lưu | Thêm 1 dòng mới | [Điền] |
| Sửa | Nhấn Sửa, cập nhật tên, Lưu | Dòng tương ứng đổi tên | [Điền] |
| Xóa | Nhấn Xóa | Dòng bị xóa khỏi bảng | [Điền] |

[Chèn ảnh minh chứng từng chức năng]

## 6. Lỗi/Warning/Error thực tế gặp phải và cách sửa

**Lưu ý:** Chỉ ghi một lỗi bạn **thực sự gặp** trong quá trình làm. Phần dưới đây là *ví dụ để đối chiếu*, không phải nhật ký lỗi đã xảy ra.

**Ví dụ lỗi:** Nhấn nút “Hủy” nhưng modal luôn đóng ngay khi vừa hiển thị.  
**Nguyên nhân:** Viết `onClick={setAdding(false)}` khiến hàm được gọi ngay lúc React render, thay vì đợi click.  
**Cách sửa:** Viết `onClick={() => setAdding(false)}`.  
**Kết quả:** Modal chỉ đóng khi bấm nút Hủy.

[Thay ví dụ bằng lỗi của bản thân; thêm ảnh Console hoặc ảnh giao diện trước/sau khi sửa]

## 7. Kết luận

Ứng dụng đã áp dụng Functional Components, `useState`, `useEffect`, props, State Lifting và các phép toán mảng `filter`/`map` để hoàn thành chức năng CRUD cơ bản. Các thao tác tạo/sửa/xóa hiện chỉ thay đổi trạng thái trong trình duyệt và không lưu vĩnh viễn lên API.
