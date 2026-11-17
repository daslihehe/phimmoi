/**
 * ==============================================================================
 * DỰ ÁN CỔNG THÔNG TIN ĐIỆN ẢNH - PHIMMOI.NET
 * File: js/movie-detail.js
 * Mô tả: Xử lý hiển thị thông tin chi tiết phim:
 *        1. Đọc tham số ?id=... từ URL và tìm phim trong cơ sở dữ liệu
 *        2. Xử lý trường hợp ID không hợp lệ hoặc thiếu (Hiển thị trang 404 thân thiện)
 *        3. Bơm nội dung chi tiết: Poster, Thông tin, Tóm tắt, Dàn diễn viên
 *        4. Tự động lưu vào danh sách "Phim vừa xem" (Recently viewed)
 *        5. Đánh giá sao tương tác (Hover, Click lưu vào localStorage, tính lại điểm TB)
 *        6. Nút "Xem sau" (Thêm / Gỡ khỏi Watchlist với cập nhật trạng thái tức thì)
 *        7. Modal thông tin Trailer (không nhúng iframe / video ngoài)
 *        8. Gợi ý "Phim cùng thể loại" (Related Movies)
 * ==============================================================================
 */

// Biến lưu trữ phim hiện tại
let currentMovie = null;

/**
 * Đọc tham số id từ query string của URL
 * @returns {number|null}
 */
function getMovieIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const idStr = urlParams.get("id");
  if (!idStr) return null;
  const id = parseInt(idStr, 10);
  return isNaN(id) ? null : id;
}

/**
 * Hiển thị giao diện thông báo lỗi thân thiện khi ID phim không tồn tại
 */
function renderMovieNotFound() {
  const container = document.getElementById("movieDetailContainer");
  if (!container) return;

  document.title = "Không tìm thấy phim | PHIMMOI.net";

  container.innerHTML = `
    <div style="text-align: center; padding: 80px 20px; background-color: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-color); max-width: 650px; margin: 40px auto;">
      <span style="font-size: 4rem; display: block; margin-bottom: 16px;">🎬❌</span>
      <h1 style="font-size: 2rem; color: var(--text-main); margin-bottom: 12px;">Không Tìm Thấy Thông Tin Phim</h1>
      <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 24px;">
        Đường dẫn phim không tồn tại, mã ID không hợp lệ hoặc bộ phim này đã bị gỡ khỏi danh mục lưu trữ.
      </p>
      <div style="display: flex; gap: 12px; justify-content: center;">
        <a href="danh-sach-phim.html" class="btn btn--primary btn--lg">Quay lại Kho Phim</a>
        <a href="index.html" class="btn btn--outline btn--lg">Về Trang Chủ</a>
      </div>
    </div>
  `;
}

/**
 * Hiển thị toàn bộ thông tin chi tiết của bộ phim
 * @param {object} movie - Đối tượng phim từ MOVIES_DATABASE
 */
function renderMovieDetail(movie) {
  const container = document.getElementById("movieDetailContainer");
  if (!container) return;

  // Cập nhật tiêu đề trang trên tab trình duyệt
  document.title = `${movie.title} (${movie.year}) - Chi Tiết Phim | PHIMMOI.net`;

  // Kiểm tra trạng thái xem sau
  const isSaved = isInWatchlist(movie.id);

  // Đọc điểm đánh giá cá nhân nếu người dùng đã từng đánh giá trước đó
  const userRatings = safeGetStorage(STORAGE_KEYS.USER_RATINGS, {});
  const personalRating = userRatings[movie.id] || 0;

  // Render HTML chi tiết
  container.innerHTML = `
    <!-- KHỐI HERO CHI TIẾT PHIM -->
    <article class="movie-detail-hero">
      <div class="detail-hero-layout">
        
        <!-- Cột trái: Poster & Nút hành động -->
        <div class="detail-poster-col">
          <img src="${movie.poster}" alt="Poster phim ${movie.title}" class="detail-poster-img">
          
          <div class="detail-action-buttons">
            <button type="button" id="btnToggleWatchlistDetail" class="btn ${isSaved ? 'btn--accent' : 'btn--outline-primary'}" style="width: 100%;">
              <span>${isSaved ? '✓ Đã Lưu Xem Sau' : '🔖 Thêm Vào Xem Sau'}</span>
            </button>
            <button type="button" id="btnOpenTrailerModal" class="btn btn--primary" style="width: 100%;">
              <span>▶ Xem Thông Tin Trailer</span>
            </button>
          </div>
        </div>

        <!-- Cột phải: Thông tin & Đánh giá -->
        <div class="detail-info-col">
          <h1 class="detail-title">${movie.title}</h1>
          <p class="detail-original-title">${movie.originalTitle || movie.title} (${movie.year})</p>

          <div class="detail-badges-row">
            <div class="detail-score-box">
              <span class="detail-score-num">★ <span id="displayedRatingNum">${movie.rating.toFixed(1)}</span></span>
              <span class="detail-vote-count">(<span id="displayedVoteCount">${movie.voteCount}</span> lượt đánh giá)</span>
            </div>
            ${movie.genres.map(g => `<span class="badge-genre">${g}</span>`).join('')}
            <span class="badge-genre" style="background: rgba(229, 9, 20, 0.12); color: var(--primary); border-color: rgba(229, 9, 20, 0.3);">
              ${movie.country}
            </span>
          </div>

          <!-- Bảng thông số kỹ thuật -->
          <table class="detail-meta-table" aria-label="Thông số kỹ thuật bộ phim">
            <tbody>
              <tr>
                <td class="label-cell">Đạo diễn:</td>
                <td class="value-cell" style="color: var(--accent); font-weight: 700;">${movie.director}</td>
              </tr>
              <tr>
                <td class="label-cell">Thời lượng:</td>
                <td class="value-cell">${movie.durationText}</td>
              </tr>
              <tr>
                <td class="label-cell">Năm sản xuất:</td>
                <td class="value-cell">${movie.year}</td>
              </tr>
              <tr>
                <td class="label-cell">Quốc gia:</td>
                <td class="value-cell">${movie.country}</td>
              </tr>
              <tr>
                <td class="label-cell">Thể loại:</td>
                <td class="value-cell">${movie.genres.join(', ')}</td>
              </tr>
            </tbody>
          </table>

          <!-- Tóm tắt nội dung kịch bản -->
          <div class="detail-synopsis-box">
            <h3>Tóm Tắt Nội Dung</h3>
            <p class="detail-synopsis-text">${movie.synopsis}</p>
          </div>

          <!-- WIDGET CHẤM SAO ĐÁNH GIÁ CỦA BẠN (1 - 10 SAO HOẶC 1 - 5 SAO) -->
          <div class="star-rating-widget" aria-label="Đánh giá phim của người dùng">
            <div class="star-rating-prompt">
              <h4>Chấm Điểm Của Bạn Cho Phim Này</h4>
              <p>${personalRating > 0 ? `Bạn đã cho phim này ${personalRating} / 5 sao.` : 'Nhấp vào sao bên cạnh để gửi đánh giá của bạn'}</p>
            </div>

            <div class="stars-interactive-wrapper" id="starsContainer">
              ${[1, 2, 3, 4, 5].map(star => `
                <button type="button" class="star-btn ${star <= personalRating ? 'is-active' : ''}" data-star="${star}" aria-label="${star} sao">★</button>
              `).join('')}
            </div>

            <div class="user-rating-feedback" id="ratingFeedbackText">
              ${personalRating > 0 ? `Đã lưu: ${personalRating} ★` : 'Chưa đánh giá'}
            </div>
          </div>

        </div>

      </div>
    </article>

    <!-- DÀN DIỄN VIÊN CHÍNH (CAST) -->
    <section class="cast-section" aria-label="Dàn diễn viên chính">
      <div class="section-title">
        <h2>Dàn Diễn Viên Chính</h2>
        <span class="section-title__sub">Những gương mặt làm nên thành công của tác phẩm</span>
      </div>

      <div class="cast-grid">
        ${movie.cast.map(actor => {
          const initials = actor.split(' ').map(n => n[0]).slice(0, 2).join('');
          return `
            <div class="cast-card">
              <div class="cast-avatar-placeholder">${initials}</div>
              <p class="cast-name">${actor}</p>
              <p class="cast-role">Diễn viên chính</p>
            </div>
          `;
        }).join('')}
      </div>
    </section>

    <!-- PHIM CÙNG THỂ LOẠI (RELATED MOVIES) -->
    <section class="related-movies-section" aria-label="Phim cùng thể loại">
      <div class="section-title">
        <h2>Phim Cùng Thể Loại Có Thể Bạn Sẽ Thích</h2>
        <a href="danh-sach-phim.html?genre=${encodeURIComponent(movie.genres[0])}" class="section-title__sub">Khám phá thêm &rarr;</a>
      </div>

      <div class="movies-grid" id="relatedMoviesGrid">
        <!-- Render các phim cùng thể loại -->
      </div>
    </section>
  `;

  // Gắn sự kiện sau khi render HTML xong
  initDetailEvents(movie);
  renderRelatedMovies(movie);
}

/**
 * Gắn các sự kiện tương tác trên trang chi tiết
 * @param {object} movie - Bộ phim hiện tại
 */
function initDetailEvents(movie) {
  // 1. Nút thêm / gỡ khỏi Watchlist
  const btnWatchlist = document.getElementById("btnToggleWatchlistDetail");
  if (btnWatchlist) {
    btnWatchlist.addEventListener("click", function () {
      const isAdded = toggleWatchlist(movie.id);
      if (isAdded) {
        this.className = "btn btn--accent";
        this.innerHTML = "<span>✓ Đã Lưu Xem Sau</span>";
      } else {
        this.className = "btn btn--outline-primary";
        this.innerHTML = "<span>🔖 Thêm Vào Xem Sau</span>";
      }
    });
  }

  // 2. Nút mở modal thông tin Trailer
  const btnTrailer = document.getElementById("btnOpenTrailerModal");
  const trailerModal = document.getElementById("trailerModal");
  if (btnTrailer && trailerModal) {
    btnTrailer.addEventListener("click", function () {
      const body = trailerModal.querySelector(".modal-body");
      if (body) {
        body.innerHTML = `
          <div style="background-color: var(--bg-secondary); border-radius: var(--radius-md); padding: 20px; border: 1px solid var(--border-color);">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
              <span style="font-size: 1.8rem;">🎬</span>
              <div>
                <h4 style="font-size: 1.15rem; color: var(--text-main);">${movie.trailerInfo.title}</h4>
                <p style="font-size: 0.85rem; color: var(--text-muted);">Kênh chính thức: ${movie.trailerInfo.channel} • Phát hành: ${movie.trailerInfo.releaseDate}</p>
              </div>
            </div>
            
            <div style="background-color: rgba(0, 0, 0, 0.4); border-radius: var(--radius-md); padding: 18px; margin-bottom: 16px; border-left: 3px solid var(--accent);">
              <p style="font-size: 0.85rem; font-weight: 700; color: var(--accent); margin-bottom: 4px;">ĐIỂM NHẤN NỔI BẬT TRONG TRAILER:</p>
              <p style="color: var(--text-body); font-size: 0.95rem; line-height: 1.6;">${movie.trailerInfo.highlights}</p>
            </div>

            <p style="font-size: 0.85rem; color: var(--text-muted); font-style: italic;">
              ℹ️ Lưu ý: Theo tiêu chuẩn an toàn học phần và bảo vệ bản quyền, website cung cấp thông tin tóm lược trailer và không nhúng video phát trực tiếp.
            </p>
          </div>
        `;
      }
      trailerModal.classList.add("is-open");
    });
  }

  // 3. Xử lý chấm điểm sao tương tác
  const starButtons = document.querySelectorAll(".star-btn");
  const feedbackText = document.getElementById("ratingFeedbackText");
  const ratingNumDisplay = document.getElementById("displayedRatingNum");
  const voteCountDisplay = document.getElementById("displayedVoteCount");

  starButtons.forEach(btn => {
    // Hiệu ứng di chuột (Hover)
    btn.addEventListener("mouseenter", function () {
      const hoverValue = parseInt(this.getAttribute("data-star"), 10);
      starButtons.forEach(s => {
        const sVal = parseInt(s.getAttribute("data-star"), 10);
        if (sVal <= hoverValue) {
          s.classList.add("is-hovered");
        } else {
          s.classList.remove("is-hovered");
        }
      });
    });

    btn.addEventListener("mouseleave", function () {
      starButtons.forEach(s => s.classList.remove("is-hovered"));
    });

    // Khi người dùng click chọn số sao
    btn.addEventListener("click", function () {
      const selectedStars = parseInt(this.getAttribute("data-star"), 10);
      
      // Lưu vào localStorage
      const userRatings = safeGetStorage(STORAGE_KEYS.USER_RATINGS, {});
      const hadPreviousRating = Boolean(userRatings[movie.id]);
      userRatings[movie.id] = selectedStars;
      safeSetStorage(STORAGE_KEYS.USER_RATINGS, userRatings);

      // Cập nhật giao diện sao
      starButtons.forEach(s => {
        const sVal = parseInt(s.getAttribute("data-star"), 10);
        if (sVal <= selectedStars) {
          s.classList.add("is-active");
        } else {
          s.classList.remove("is-active");
        }
      });

      if (feedbackText) {
        feedbackText.innerHTML = `Đã gửi: ${selectedStars} ★ Cảm ơn bạn!`;
      }

      // Tính lại điểm trung bình mô phỏng (tăng voteCount thêm 1 nếu đánh giá lần đầu)
      if (!hadPreviousRating) {
        const newCount = movie.voteCount + 1;
        // Điểm đánh giá sao 5 quy đổi sang thang điểm 10 (selectedStars * 2)
        const newRating = ((movie.rating * movie.voteCount) + (selectedStars * 2)) / newCount;
        if (ratingNumDisplay) ratingNumDisplay.textContent = newRating.toFixed(1);
        if (voteCountDisplay) voteCountDisplay.textContent = newCount;
      }
    });
  });
}

/**
 * Hiển thị danh sách các phim liên quan (cùng thể loại)
 * @param {object} movie - Phim hiện tại
 */
function renderRelatedMovies(movie) {
  const relatedGrid = document.getElementById("relatedMoviesGrid");
  if (!relatedGrid || !window.MOVIES_DATABASE) return;

  // Lọc các phim có ít nhất 1 thể loại trùng với phim hiện tại, trừ chính nó
  const related = window.MOVIES_DATABASE
    .filter(m => m.id !== movie.id && m.genres.some(g => movie.genres.includes(g)))
    .slice(0, 4);

  if (related.length === 0) {
    relatedGrid.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1;">Không có phim liên quan nào khác.</p>`;
    return;
  }

  relatedGrid.innerHTML = related.map(m => renderMovieCardHTML(m)).join("");
}

// Khởi chạy khi trang tải xong
document.addEventListener("DOMContentLoaded", function () {
  const movieId = getMovieIdFromUrl();

  if (!movieId || !window.MOVIES_DATABASE) {
    renderMovieNotFound();
    return;
  }

  currentMovie = window.MOVIES_DATABASE.find(m => m.id === movieId);

  if (!currentMovie) {
    renderMovieNotFound();
  } else {
    // Lưu vào lịch sử Phim vừa xem
    addRecentlyViewed(currentMovie.id);
    // Render toàn bộ chi tiết
    renderMovieDetail(currentMovie);
  }
});
