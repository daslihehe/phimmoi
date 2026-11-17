# DỰ ÁN WEBSITE: PHIMMOI.NET - CỔNG THÔNG TIN ĐIỆN ẢNH CHUẨN XÁC

> **Bài tập lớn / Đồ án nhóm học phần:** Thiết kế & Lập trình Web Căn Bản  
> **Công nghệ sử dụng:** HTML5, CSS3, JavaScript Thuần (Vanilla JS)  
> **Tương thích:** 100% chạy không cần server (mở trực tiếp qua giao thức `file://` trên Google Chrome, Microsoft Edge, Mozilla Firefox, Safari)

---

## 1. GIỚI THIỆU ĐỀ TÀI

**PHIMMOI.net** là Cổng thông tin điện ảnh chuyên biệt:
- Giới thiệu, phân loại, tìm kiếm và đánh giá các tác phẩm điện ảnh xuất sắc của Việt Nam và Quốc tế.
- **TUYÊN BỐ QUAN TRỌNG:** Đây là website **THÔNG TIN & ĐÁNH GIÁ**, **HOÀN TOÀN KHÔNG** phát trực tiếp/streaming phim, **KHÔNG** chứa link tải lậu hay bất kỳ nội dung vi phạm bản quyền nào. Toàn bộ hình ảnh poster là đồ họa Vector (SVG) tự sinh, điểm đánh giá và lượt bình chọn là số liệu minh họa phục vụ học tập.

---

## 2. HƯỚNG DẪN MỞ & CHẠY WEBSITE

Website được xây dựng hoàn toàn bằng công nghệ Web tĩnh tiêu chuẩn, không sử dụng ES Modules, không dùng `fetch()` gọi API nội bộ, do đó **không bị chặn bởi chính sách CORS** khi mở cục bộ:

1. Giải nén hoặc mở thư mục dự án `phimmoi/`.
2. Nhấp đúp chuột trực tiếp vào file **`index.html`** để mở trên trình duyệt (hoặc click chuột phải chọn **Open with** > **Google Chrome** / **Microsoft Edge**).
3. Người dùng có thể trải nghiệm toàn bộ 6 trang web cùng các chức năng tìm kiếm, lọc, chấm sao, xem sau và làm trắc nghiệm một cách mượt mà.

---

## 3. CẤU TRÚC THƯ MỤC DỰ ÁN

```text
phimmoi/
├── index.html                  # 1. Trang chủ (Hero Slider, Phim mới, Thể loại, Top 5, Gợi ý ngẫu nhiên)
├── danh-sach-phim.html         # 2. Danh sách phim (Tìm kiếm realtime, Bộ lọc đa tiêu chí, Tab Xem sau)
├── chi-tiet-phim.html          # 3. Chi tiết phim (Đọc ?id=, Tóm tắt, Bảng Cast, Chấm sao, Trailer info)
├── top-phim.html               # 4. Bảng xếp hạng (Bảng Top 10, Sắp xếp cột, Tab Việt Nam/Quốc tế)
├── trac-nghiem.html            # 5. Trắc nghiệm (7 câu hỏi, tự động chấm điểm thể loại, gợi ý 3 phim)
├── lien-he.html                # 6. Đề xuất phim (Biểu mẫu kèm validation đầy đủ 7 tiêu chí)
├── css/
│   ├── style.css               # CSS dùng chung: CSS Variables, Reset, Header/Footer, BEM Card, Modals
│   ├── home.css                # CSS riêng Trang chủ: Hero Carousel, Gợi ý phim, Top tuần
│   ├── movies.css              # CSS Danh sách & Chi tiết phim: Bảng điều khiển bộ lọc, Hero chi tiết, Star rating
│   └── quiz.css                # CSS Trắc nghiệm: Question Card, Progress bar, Option button, Result card
├── js/
│   ├── movies-data.js          # Cơ sở dữ liệu 20 phim chuẩn xác (Nạp qua thẻ <script> thường)
│   ├── main.js                 # Xử lý dùng chung: Menu di động, Dark/Light mode, Back to top, Watchlist
│   ├── slider.js               # Điều khiển Carousel Trang chủ (Autoplay, Pause on hover, Phím mũi tên)
│   ├── search-filter.js        # Tìm kiếm realtime, Lọc thể loại/năm/quốc gia, Sắp xếp, Đọc query URL
│   ├── movie-detail.js         # Đọc query ?id=, render chi tiết, tương tác sao, lưu phim vừa xem
│   ├── quiz.js                 # Xử lý câu hỏi trắc nghiệm, thuật toán cộng điểm, gợi ý phim theo gu
│   └── form-validate.js        # Kiểm tra dữ liệu Form (Tên, Email RFC, SĐT Việt Nam, Độ dài, Checkbox)
├── images/
│   ├── logo.svg                # Logo thương hiệu PHIMMOI.net
│   ├── favicon.svg             # Biểu tượng Favicon cuộn phim
│   ├── banners/                # Banner khổ rộng 1200x500 cho Slider trang chủ (banner-1.svg -> 5)
│   └── posters/                # 20 poster phim SVG chuẩn tỷ lệ 2:3 (poster-1.svg -> 20)
├── README.md                   # Hướng dẫn sử dụng & Checklist tùy biến
└── GIAI_THICH.md               # Tài liệu chi tiết chuẩn bị cho buổi vấn đáp bảo vệ đồ án
```

---

## 4. CHECKLIST DÀNH CHO NHÓM KHI BÁO CÁO / TÙY BIẾN

Khi nhóm nộp bài hoặc báo cáo trực tiếp trước giảng viên, có thể thay thế một số thông tin để mang dấu ấn riêng:

1. **Thay poster phim bằng ảnh thật (nếu muốn):**
   - Lưu ảnh poster thật vào thư mục `images/posters/` với tên tương ứng (ví dụ: `poster-1.jpg`).
   - Vào `js/movies-data.js`, đổi đường dẫn trường `"poster": "images/posters/poster-1.svg"` thành `"images/posters/poster-1.jpg"`.
2. **Cập nhật thông tin thành viên nhóm:**
   - Mở phần Footer của 6 file HTML và file `lien-he.html`, cập nhật tên trường, lớp, mã số sinh viên của các thành viên trong nhóm.
3. **Điểm số đánh giá & Lượt bình chọn:**
   - Hiện tại điểm số trong `js/movies-data.js` là số liệu minh họa theo điểm số tham khảo từ IMDb và các diễn đàn điện ảnh (đã được ghi chú rõ ràng theo yêu cầu đề bài).

---

## 5. CÁC TÍNH NĂNG NỔI BẬT THEO RUBRIC CHẤM ĐIỂM

- **Chuẩn ngữ nghĩa HTML5 & SEO:** Đầy đủ thẻ `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`. Mỗi trang duy nhất 1 thẻ `<h1>`, phân cấp tiêu đề `<h2>` - `<h4>` chuẩn mực.
- **Giao diện Điện ảnh Đẳng cấp:** Thiết kế tông màu tối (Dark mode) sang trọng, điểm xuyết đỏ điện ảnh `#e50914` và vàng ánh kim `#ffb800`. Hỗ trợ chuyển đổi Sáng/Tối mượt mà và ghi nhớ vào `localStorage`.
- **CSS Grid & Flexbox:** Bố cục hiện đại, hạn chế tối đa `position: absolute` (chỉ dùng cho overlay và badge có chú thích rõ ràng). Responsive hoàn hảo trên màn hình Desktop (1366–1920px), Tablet (768–1024px) và Mobile (< 480px).
- **Bộ lọc đa tiêu chí Realtime:** Cho phép gõ tìm kiếm từ khóa, kết hợp lọc thể loại, năm, quốc gia và sắp xếp cùng lúc mà không cần tải lại trang.
- **Điểm nhấn sáng tạo:**
  1. Tính năng *"Gợi ý phim ngẫu nhiên cho tối nay"* chọn theo tâm trạng & thời lượng.
  2. Tính năng *"Phim bạn vừa xem"* lưu lại lịch sử duyệt phim của người dùng.
  3. Hệ thống chấm điểm sao tương tác kèm tính lại điểm trung bình thời gian thực.
  4. Danh sách *"Xem sau"* (Watchlist) có thể quản lý nhanh từ mọi trang web.
