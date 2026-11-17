/**
 * ==============================================================================
 * DỰ ÁN CỔNG THÔNG TIN ĐIỆN ẢNH - PHIMMOI.NET
 * File: js/main.js
 * Mô tả: Xử lý tương tác dùng chung cho toàn bộ 6 trang web:
 *        1. Menu Hamburger trên thiết bị di động
 *        2. Chế độ Sáng / Tối (Dark / Light Mode) lưu trong localStorage
 *        3. Nút cuộn lên đầu trang (Back to top)
 *        4. Quản lý danh sách "Xem sau" (Watchlist) dùng chung
 *        5. Quản lý danh sách "Phim vừa xem" (Recently Viewed)
 *        6. Hàm tiện ích render thẻ phim theo chuẩn BEM
 *        7. Quản lý đóng / mở cửa sổ Modal dùng chung
 * ==============================================================================
 */

// Key lưu trữ localStorage
const STORAGE_KEYS = {
  THEME: "phimmoi_theme",
  WATCHLIST: "phimmoi_watchlist",
  RECENTLY_VIEWED: "phimmoi_recently_viewed",
  USER_RATINGS: "phimmoi_ratings"
};

/**
 * Hàm đọc dữ liệu từ localStorage an toàn (bọc try/catch chống lỗi khi bị chặn cookie/file://)
 * @param {string} key - Tên khóa lưu trữ
 * @param {any} defaultValue - Giá trị mặc định trả về nếu rỗng hoặc lỗi
 * @returns {any} Dữ liệu đã parse từ JSON hoặc giá trị mặc định
 */
function safeGetStorage(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn("Không thể truy cập localStorage:", error);
    return defaultValue;
  }
}

/**
 * Hàm ghi dữ liệu vào localStorage an toàn
 * @param {string} key - Tên khóa lưu trữ
 * @param {any} value - Dữ liệu cần lưu
 */
function safeSetStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Không thể ghi vào localStorage:", error);
  }
}

/* ==========================================================================
   1. MENU MOBILE (HAMBURGER)
   ========================================================================== */
function initMobileMenu() {
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const navMenu = document.querySelector(".navbar__menu");

  if (!hamburgerBtn || !navMenu) return;

  hamburgerBtn.addEventListener("click", function () {
    const isExpanded = navMenu.classList.toggle("is-active");
    hamburgerBtn.setAttribute("aria-expanded", isExpanded);
    hamburgerBtn.innerHTML = isExpanded ? "&#10005;" : "&#9776;";
  });

  // Đóng menu khi bấm vào link bất kỳ
  navMenu.querySelectorAll(".navbar__link").forEach(function (link) {
    link.addEventListener("click", function () {
      navMenu.classList.remove("is-active");
      hamburgerBtn.innerHTML = "&#9776;";
    });
  });

  // Đóng menu khi click ra ngoài thanh điều hướng
  document.addEventListener("click", function (event) {
    if (!hamburgerBtn.contains(event.target) && !navMenu.contains(event.target)) {
      navMenu.classList.remove("is-active");
      hamburgerBtn.innerHTML = "&#9776;";
    }
  });
}

/* ==========================================================================
   2. DARK / LIGHT THEME TOGGLE
   ========================================================================== */
function initThemeToggle() {
  const themeBtn = document.querySelector(".theme-toggle-btn");
  if (!themeBtn) return;

  // Đọc theme đã lưu từ trước (mặc định dark mode)
  const savedTheme = safeGetStorage(STORAGE_KEYS.THEME, "dark");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    themeBtn.innerHTML = "&#9790;"; // Biểu tượng mặt trăng
    themeBtn.setAttribute("title", "Chuyển sang giao diện Tối");
  } else {
    document.body.classList.remove("light-mode");
    themeBtn.innerHTML = "&#9728;"; // Biểu tượng mặt trời
    themeBtn.setAttribute("title", "Chuyển sang giao diện Sáng");
  }

  themeBtn.addEventListener("click", function () {
    const isLight = document.body.classList.toggle("light-mode");
    const currentTheme = isLight ? "light" : "dark";
    safeSetStorage(STORAGE_KEYS.THEME, currentTheme);

    themeBtn.innerHTML = isLight ? "&#9790;" : "&#9728;";
    themeBtn.setAttribute("title", isLight ? "Chuyển sang giao diện Tối" : "Chuyển sang giao diện Sáng");
  });
}

/* ==========================================================================
   3. NÚT CUỘN LÊN ĐẦU TRANG (BACK TO TOP)
   ========================================================================== */
function initScrollToTop() {
  const scrollBtn = document.querySelector(".scroll-top-btn");
  if (!scrollBtn) return;

  window.addEventListener("scroll", function () {
    if (window.scrollY > 350) {
      scrollBtn.classList.add("is-visible");
    } else {
      scrollBtn.classList.remove("is-visible");
    }
  });

  scrollBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/* ==========================================================================
   4. QUẢN LÝ DANH SÁCH "XEM SAU" (WATCHLIST)
   ========================================================================== */
/**
 * Lấy danh sách ID các phim đã lưu vào Xem sau
 * @returns {number[]} Mảng chứa ID các phim
 */
function getWatchlist() {
  return safeGetStorage(STORAGE_KEYS.WATCHLIST, []);
}

/**
 * Kiểm tra một phim có nằm trong danh sách Xem sau không
 * @param {number} movieId - ID của phim
 * @returns {boolean}
 */
function isInWatchlist(movieId) {
  const list = getWatchlist();
  return list.includes(Number(movieId));
}

/**
 * Thêm hoặc xóa một phim khỏi danh sách Xem sau (Toggle)
 * @param {number} movieId - ID của phim
 * @returns {boolean} Trả về true nếu vừa thêm, false nếu vừa gỡ
 */
function toggleWatchlist(movieId) {
  const id = Number(movieId);
  let list = getWatchlist();
  let isAdded = false;

  if (list.includes(id)) {
    list = list.filter(item => item !== id);
    isAdded = false;
  } else {
    list.push(id);
    isAdded = true;
  }

  safeSetStorage(STORAGE_KEYS.WATCHLIST, list);
  updateWatchlistBadge();
  return isAdded;
}

/**
 * Cập nhật số lượng phim hiển thị trên huy hiệu Xem sau ở Header
 */
function updateWatchlistBadge() {
  const badges = document.querySelectorAll(".watchlist-count-badge");
  const count = getWatchlist().length;
  badges.forEach(b => {
    b.textContent = count;
  });
}

/**
 * Mở modal danh sách Xem sau dạng pop-up nhanh
 */
function openWatchlistModal() {
  const modal = document.getElementById("watchlistModal");
  if (!modal) return;

  const bodyEl = modal.querySelector(".modal-body");
  const list = getWatchlist();

  if (!window.MOVIES_DATABASE || list.length === 0) {
    bodyEl.innerHTML = `
      <div style="text-align: center; padding: 30px 10px;">
        <p style="font-size: 2.5rem; margin-bottom: 10px;">📋</p>
        <p style="font-size: 1.1rem; font-weight: 600; color: var(--text-main);">Danh sách Xem sau đang trống!</p>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 6px;">Hãy duyệt các phim và nhấn biểu tượng lưu để xem lại sau nhé.</p>
        <a href="danh-sach-phim.html" class="btn btn--primary btn--sm" style="margin-top: 18px;">Khám phá phim ngay</a>
      </div>
    `;
  } else {
    const savedMovies = window.MOVIES_DATABASE.filter(m => list.includes(m.id));
    let html = `<ul style="display: flex; flex-direction: column; gap: 12px;">`;
    savedMovies.forEach(movie => {
      html += `
        <li style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-secondary); padding: 10px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="${movie.poster}" alt="${movie.title}" style="width: 44px; height: 62px; object-fit: cover; border-radius: 4px;">
            <div>
              <a href="chi-tiet-phim.html?id=${movie.id}" style="font-weight: 700; color: var(--text-main); font-size: 0.95rem;">${movie.title}</a>
              <p style="font-size: 0.8rem; color: var(--text-muted);">${movie.year} • ★ ${movie.rating}</p>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <a href="chi-tiet-phim.html?id=${movie.id}" class="btn btn--outline-primary btn--sm">Chi tiết</a>
            <button type="button" class="btn btn--outline btn--sm remove-watchlist-btn" data-id="${movie.id}" title="Gỡ bỏ" style="color: var(--primary);">✕</button>
          </div>
        </li>
      `;
    });
    html += `</ul>`;
    bodyEl.innerHTML = html;

    // Gắn sự kiện gỡ bỏ phim
    bodyEl.querySelectorAll(".remove-watchlist-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        toggleWatchlist(id);
        openWatchlistModal(); // Re-render modal
      });
    });
  }

  modal.classList.add("is-open");
}

/* ==========================================================================
   5. QUẢN LÝ "PHIM VỪA XEM" (RECENTLY VIEWED)
   ========================================================================== */
function getRecentlyViewed() {
  return safeGetStorage(STORAGE_KEYS.RECENTLY_VIEWED, []);
}

function addRecentlyViewed(movieId) {
  const id = Number(movieId);
  let list = getRecentlyViewed();
  // Loại bỏ nếu đã có, đưa lên đầu mảng
  list = list.filter(item => item !== id);
  list.unshift(id);
  // Giới hạn tối đa 6 phim
  if (list.length > 6) {
    list = list.slice(0, 6);
  }
  safeSetStorage(STORAGE_KEYS.RECENTLY_VIEWED, list);
}

/* ==========================================================================
   6. HÀM RENDER THẺ PHIM (MOVIE CARD) CHUẨN BEM
   ========================================================================== */
/**
 * Tạo chuỗi HTML cho một thẻ phim theo chuẩn BEM
 * @param {object} movie - Đối tượng phim từ MOVIES_DATABASE
 * @returns {string} Chuỗi HTML card phim
 */
function renderMovieCardHTML(movie) {
  const genresText = movie.genres.slice(0, 2).join(", ");
  return `
    <article class="movie-card" data-id="${movie.id}" data-genres="${movie.genres.join(',')}" data-year="${movie.year}" data-country="${movie.country}">
      <div class="movie-card__poster-wrapper">
        <img class="movie-card__poster" src="${movie.poster}" alt="Poster phim ${movie.title}" loading="lazy">
        <span class="movie-card__rating-badge">★ ${movie.rating.toFixed(1)}</span>
        <span class="movie-card__year-badge">${movie.year}</span>
        <div class="movie-card__overlay">
          <p style="color: #ffffff; font-weight: 700; font-size: 0.95rem; margin-bottom: 2px;">${movie.title}</p>
          <p style="color: var(--accent); font-size: 0.8rem; margin-bottom: 8px;">${movie.director}</p>
          <p style="color: var(--text-body); font-size: 0.78rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 6px;">${movie.synopsis}</p>
          <a href="chi-tiet-phim.html?id=${movie.id}" class="movie-card__overlay-btn">Xem chi tiết</a>
        </div>
      </div>
      <div class="movie-card__body">
        <h3 class="movie-card__title" title="${movie.title}">
          <a href="chi-tiet-phim.html?id=${movie.id}">${movie.title}</a>
        </h3>
        <p class="movie-card__original-title">${movie.originalTitle || movie.title}</p>
        <div class="movie-card__meta">
          <span class="movie-card__genres" title="${movie.genres.join(', ')}">${genresText}</span>
          <span class="movie-card__country">${movie.country}</span>
        </div>
      </div>
    </article>
  `;
}

/* ==========================================================================
   7. TIỆN ÍCH MODAL DÙNG CHUNG
   ========================================================================== */
function initModals() {
  // Gắn sự kiện đóng cho tất cả các nút đóng modal
  document.querySelectorAll(".modal-close-btn, .modal-backdrop").forEach(el => {
    el.addEventListener("click", function (e) {
      if (e.target === this) {
        const modal = this.closest(".modal-backdrop") || this;
        modal.classList.remove("is-open");
      }
    });
  });

  // Đóng modal khi nhấn phím Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-backdrop.is-open").forEach(modal => {
        modal.classList.remove("is-open");
      });
    }
  });

  // Gắn sự kiện mở watchlist modal nếu có nút trên navbar
  const watchlistBtn = document.querySelector(".watchlist-nav-btn");
  if (watchlistBtn) {
    watchlistBtn.addEventListener("click", openWatchlistModal);
  }
}

/* ==========================================================================
   KHỞI TẠO TỔNG THỂ KHI TRANG TẢI XONG
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function () {
  initMobileMenu();
  initThemeToggle();
  initScrollToTop();
  initModals();
  updateWatchlistBadge();
});
