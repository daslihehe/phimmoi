/**
 * ==============================================================================
 * DỰ ÁN CỔNG THÔNG TIN ĐIỆN ẢNH - PHIMMOI.NET
 * File: js/search-filter.js
 * Mô tả: Xử lý tìm kiếm thời gian thực, lọc phim đa tiêu chí và sắp xếp
 *        trên trang Danh sách phim (danh-sach-phim.html):
 *        1. Tìm kiếm theo tên phim / đạo diễn / diễn viên
 *        2. Lọc kết hợp: Thể loại, Năm phát hành, Quốc gia
 *        3. Sắp xếp: Mới nhất, Đánh giá cao nhất, Thứ tự A-Z
 *        4. Đếm số lượng kết quả & hiển thị giao diện rỗng (Empty State)
 *        5. Đọc tham số URL (ví dụ ?genre=Hành động từ trang chủ)
 *        6. Chuyển tab giữa "Tất cả phim" và "Phim đã lưu (Xem sau)"
 * ==============================================================================
 */

// Trạng thái bộ lọc hiện tại
const currentFilterState = {
  keyword: "",
  genre: "Tất cả",
  year: "all",
  country: "Tất cả",
  sortBy: "newest",
  viewTab: "all" // 'all' hoặc 'watchlist'
};

/**
 * Lấy tham số từ URL khi người dùng chuyển trang
 * @param {string} param - Tên tham số query (ví dụ: 'genre', 'search')
 * @returns {string|null}
 */
function getUrlQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/**
 * Hàm lọc và sắp xếp danh sách phim dựa trên currentFilterState
 * @returns {object[]} Mảng các bộ phim thỏa mãn tất cả tiêu chí
 */
function getFilteredAndSortedMovies() {
  if (!window.MOVIES_DATABASE) return [];

  let result = [...window.MOVIES_DATABASE];

  // Nếu đang ở Tab "Xem sau", chỉ lấy các phim người dùng đã lưu
  if (currentFilterState.viewTab === "watchlist") {
    const watchlistIds = getWatchlist();
    result = result.filter(m => watchlistIds.includes(m.id));
  }

  // 1. Lọc theo từ khóa tìm kiếm (Tên phim, Tên gốc, Đạo diễn, Diễn viên)
  if (currentFilterState.keyword.trim() !== "") {
    const kw = currentFilterState.keyword.trim().toLowerCase();
    result = result.filter(m => {
      const matchTitle = m.title.toLowerCase().includes(kw);
      const matchOriginal = m.originalTitle && m.originalTitle.toLowerCase().includes(kw);
      const matchDirector = m.director.toLowerCase().includes(kw);
      const matchCast = m.cast.some(actor => actor.toLowerCase().includes(kw));
      return matchTitle || matchOriginal || matchDirector || matchCast;
    });
  }

  // 2. Lọc theo thể loại
  if (currentFilterState.genre !== "Tất cả") {
    result = result.filter(m => m.genres.includes(currentFilterState.genre));
  }

  // 3. Lọc theo năm phát hành
  if (currentFilterState.year !== "all") {
    if (currentFilterState.year === "2024") {
      result = result.filter(m => m.year === 2024);
    } else if (currentFilterState.year === "2023") {
      result = result.filter(m => m.year === 2023);
    } else if (currentFilterState.year === "2020-2022") {
      result = result.filter(m => m.year >= 2020 && m.year <= 2022);
    } else if (currentFilterState.year === "2010-2019") {
      result = result.filter(m => m.year >= 2010 && m.year <= 2019);
    } else if (currentFilterState.year === "before-2010") {
      result = result.filter(m => m.year < 2010);
    }
  }

  // 4. Lọc theo quốc gia
  if (currentFilterState.country !== "Tất cả") {
    result = result.filter(m => m.country === currentFilterState.country);
  }

  // 5. Sắp xếp kết quả
  if (currentFilterState.sortBy === "newest") {
    result.sort((a, b) => b.year - a.year || b.rating - a.rating);
  } else if (currentFilterState.sortBy === "rating-desc") {
    result.sort((a, b) => b.rating - a.rating);
  } else if (currentFilterState.sortBy === "title-asc") {
    result.sort((a, b) => a.title.localeCompare(b.title, "vi"));
  }

  return result;
}

/**
 * Hiển thị danh sách phim ra giao diện
 */
function renderMoviesList() {
  const container = document.getElementById("moviesListGrid");
  const countDisplay = document.getElementById("resultsCountDisplay");

  if (!container) return;

  const filteredMovies = getFilteredAndSortedMovies();

  // Cập nhật số lượng đếm kết quả
  if (countDisplay) {
    const totalCount = currentFilterState.viewTab === "watchlist" ? getWatchlist().length : window.MOVIES_DATABASE.length;
    countDisplay.innerHTML = `Hiển thị <span class="results-count-number">${filteredMovies.length}</span> / ${totalCount} bộ phim`;
  }

  // Trường hợp không tìm thấy kết quả nào (Empty State)
  if (filteredMovies.length === 0) {
    const isWatchlistTab = currentFilterState.viewTab === "watchlist";
    container.innerHTML = `
      <div class="empty-state-card">
        <span class="empty-state__icon">${isWatchlistTab ? "📋" : "🔍"}</span>
        <h3 class="empty-state__title">${isWatchlistTab ? "Danh sách Xem sau đang trống" : "Không tìm thấy bộ phim phù hợp"}</h3>
        <p class="empty-state__desc">
          ${isWatchlistTab 
            ? "Bạn chưa lưu bộ phim nào vào danh sách xem sau. Hãy chuyển sang tab 'Tất cả phim' và chọn những phim yêu thích nhé." 
            : "Không có phim nào khớp với các tiêu chí tìm kiếm hoặc bộ lọc hiện tại của bạn. Hãy thử thay đổi từ khóa hoặc đặt lại bộ lọc."}
        </p>
        <button type="button" id="btnResetFiltersEmpty" class="btn btn--primary">
          ${isWatchlistTab ? "Xem Tất Cả Phim" : "Đặt Lại Bộ Lọc"}
        </button>
      </div>
    `;

    const btnResetEmpty = document.getElementById("btnResetFiltersEmpty");
    if (btnResetEmpty) {
      btnResetEmpty.addEventListener("click", () => {
        if (isWatchlistTab) {
          switchTab("all");
        } else {
          resetAllFilters();
        }
      });
    }
    return;
  }

  // Render danh sách các thẻ phim
  container.innerHTML = filteredMovies.map(movie => renderMovieCardHTML(movie)).join("");
}

/**
 * Đặt lại toàn bộ bộ lọc về trạng thái ban đầu
 */
function resetAllFilters() {
  currentFilterState.keyword = "";
  currentFilterState.genre = "Tất cả";
  currentFilterState.year = "all";
  currentFilterState.country = "Tất cả";
  currentFilterState.sortBy = "newest";

  const searchInput = document.getElementById("movieSearchInput");
  const genreSelect = document.getElementById("filterGenreSelect");
  const yearSelect = document.getElementById("filterYearSelect");
  const countrySelect = document.getElementById("filterCountrySelect");
  const sortSelect = document.getElementById("filterSortSelect");

  if (searchInput) searchInput.value = "";
  if (genreSelect) genreSelect.value = "Tất cả";
  if (yearSelect) yearSelect.value = "all";
  if (countrySelect) countrySelect.value = "Tất cả";
  if (sortSelect) sortSelect.value = "newest";

  renderMoviesList();
}

/**
 * Chuyển đổi giữa tab "Tất cả phim" và "Xem sau"
 * @param {string} tabName - 'all' hoặc 'watchlist'
 */
function switchTab(tabName) {
  currentFilterState.viewTab = tabName;

  document.querySelectorAll(".view-tab-btn").forEach(btn => {
    if (btn.getAttribute("data-tab") === tabName) {
      btn.classList.add("is-active");
    } else {
      btn.classList.remove("is-active");
    }
  });

  renderMoviesList();
}

/**
 * Khởi tạo toàn bộ sự kiện cho trang danh sách phim
 */
function initSearchAndFilterPage() {
  const searchInput = document.getElementById("movieSearchInput");
  const genreSelect = document.getElementById("filterGenreSelect");
  const yearSelect = document.getElementById("filterYearSelect");
  const countrySelect = document.getElementById("filterCountrySelect");
  const sortSelect = document.getElementById("filterSortSelect");
  const btnReset = document.getElementById("btnResetFilters");

  // Kiểm tra tham số URL khi chuyển từ trang chủ hoặc link khác tới
  const queryGenre = getUrlQueryParam("genre");
  if (queryGenre && genreSelect) {
    currentFilterState.genre = queryGenre;
    genreSelect.value = queryGenre;
  }

  const querySearch = getUrlQueryParam("search");
  if (querySearch && searchInput) {
    currentFilterState.keyword = querySearch;
    searchInput.value = querySearch;
  }

  // Sự kiện tìm kiếm Realtime
  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      currentFilterState.keyword = e.target.value;
      renderMoviesList();
    });
  }

  // Sự kiện chọn thể loại
  if (genreSelect) {
    genreSelect.addEventListener("change", function (e) {
      currentFilterState.genre = e.target.value;
      renderMoviesList();
    });
  }

  // Sự kiện chọn năm
  if (yearSelect) {
    yearSelect.addEventListener("change", function (e) {
      currentFilterState.year = e.target.value;
      renderMoviesList();
    });
  }

  // Sự kiện chọn quốc gia
  if (countrySelect) {
    countrySelect.addEventListener("change", function (e) {
      currentFilterState.country = e.target.value;
      renderMoviesList();
    });
  }

  // Sự kiện sắp xếp
  if (sortSelect) {
    sortSelect.addEventListener("change", function (e) {
      currentFilterState.sortBy = e.target.value;
      renderMoviesList();
    });
  }

  // Sự kiện nút Đặt lại bộ lọc
  if (btnReset) {
    btnReset.addEventListener("click", resetAllFilters);
  }

  // Sự kiện chuyển Tab Tất cả phim / Xem sau
  document.querySelectorAll(".view-tab-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      const tab = this.getAttribute("data-tab");
      switchTab(tab);
    });
  });

  // Render lần đầu
  renderMoviesList();
}

// Khởi chạy khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  initSearchAndFilterPage();
});
