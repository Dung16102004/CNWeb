/* BÀI B — VIẾT CODE: Lọc tin và đăng tin nhanh (news.html)
   Viết code theo đặc tả.
   Không sửa news.html, không sửa css; chỉ viết JavaScript trong file này. */

// ---------- ĐÃ CHO SẴN (không sửa) ----------
// Chặn việc gửi form tìm kiếm khi nhấn Enter, để trang không bị tải lại.
document.querySelector("#searchbar form").addEventListener("submit", (e) => e.preventDefault());

// ---------- PHẦN BẠN VIẾT ----------
const danhSachTin = document.getElementById("list");
const oTimTin = document.getElementById("o-tim-kiem");
const boDemTin = document.getElementById("bo-dem");
const thongBaoKhongThay = document.getElementById("khong-thay");
const oTieuDeTin = document.getElementById("tin-tieu-de");
const oNoiDungTin = document.getElementById("tin-noi-dung");
const nutDangTin = document.getElementById("nut-dang");
const baoLoiTin = document.getElementById("bao-loi");

// F1, F2, F3: lọc theo tiêu đề hoặc nội dung, cập nhật bộ đếm và thông báo.
function locTin() {
    const tuKhoa = oTimTin.value.toLowerCase();
    const cacTin = danhSachTin.querySelectorAll("li");
    let soTinHien = 0;

    for (const tin of cacTin) {
        const tieuDe = tin.querySelector("h3").textContent;
        const noiDung = tin.querySelector("p").textContent;
        const khop = (tieuDe + " " + noiDung).toLowerCase().includes(tuKhoa);
        tin.classList.toggle("an", !khop);
        if (khop) soTinHien++;
    }

    boDemTin.textContent = `Đang hiển thị ${soTinHien}/${cacTin.length} tin`;
    thongBaoKhongThay.classList.toggle("an", soTinHien > 0);
    if (soTinHien === 0) {
        // Dùng textContent để từ khóa có thẻ HTML vẫn hiển thị nguyên văn.
        thongBaoKhongThay.textContent = `Không tìm thấy tin nào cho "${oTimTin.value}"`;
    }
}

oTimTin.addEventListener("keyup", locTin);
locTin();

// F4: event delegation – chỉ một trình lắng nghe cho toàn danh sách.
danhSachTin.addEventListener("click", (e) => {
    if (!e.target.matches("button.more")) return;
    const nut = e.target;
    const doan = nut.closest("li").querySelector("p");
    const daMo = doan.classList.toggle("day-du");
    nut.textContent = daMo ? "Thu gọn <<" : "Read more >>";
});

// F5: thêm một tin mới ở đầu danh sách, không dùng innerHTML với dữ liệu người dùng.
nutDangTin.addEventListener("click", () => {
    const tieuDe = oTieuDeTin.value;
    const noiDung = oNoiDungTin.value;
    if (!tieuDe.trim() || !noiDung.trim()) {
        baoLoiTin.textContent = "Vui lòng nhập đủ tiêu đề và nội dung.";
        return;
    }

    const tinMoi = document.createElement("li");
    const thoiGian = document.createElement("span");
    thoiGian.className = "time";
    thoiGian.textContent = homNay();

    const h3 = document.createElement("h3");
    h3.textContent = tieuDe;
    const p = document.createElement("p");
    p.textContent = noiDung;
    const nut = document.createElement("button");
    nut.type = "button";
    nut.className = "more";
    nut.textContent = "Read more >>";

    tinMoi.append(thoiGian, h3, p, nut);
    danhSachTin.prepend(tinMoi);
    oTieuDeTin.value = "";
    oNoiDungTin.value = "";
    baoLoiTin.textContent = "";
    locTin();
});
