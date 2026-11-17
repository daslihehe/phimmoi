/**
 * ==============================================================================
 * DỰ ÁN CỔNG THÔNG TIN ĐIỆN ẢNH - PHIMMOI.NET
 * File: js/quiz.js
 * Mô tả: Xử lý logic trắc nghiệm "Bạn hợp thể loại phim nào?":
 *        - Bộ 7 câu hỏi trắc nghiệm tâm lý & thói quen xem phim
 *        - Thuật toán chấm điểm tích lũy theo từng thể loại
 *        - Tự động hiển thị tiến trình (Progress bar)
 *        - Đưa ra hồ sơ tính cách điện ảnh & gợi ý chính xác 3 bộ phim phù hợp
 *        - Nút làm lại bài trắc nghiệm
 * ==============================================================================
 */

// BỘ 7 CÂU HỎI TRẮC NGHIỆM CHỌN LỌC
const QUIZ_QUESTIONS = [
  {
    id: 1,
    title: "1. Tối thứ Bảy rảnh rỗi, bạn mong muốn một bộ phim mang lại cảm giác gì nhất?",
    options: [
      { text: "Hồi hộp, tim đập thình thịch với những pha rượt đuổi nghẹt thở", genre: "Hành động" },
      { text: "Ấm áp, bay bổng và cảm động với một câu chuyện tình sâu sắc", genre: "Tình cảm" },
      { text: "Bất ngờ, xoắn não với những tầng suy nghĩ và triết lý nhân sinh", genre: "Khoa học viễn tưởng" },
      { text: "Rùng rợn, giật gân thách thức lòng can đảm trong bóng tối", genre: "Kinh dị" }
    ]
  },
  {
    id: 2,
    title: "2. Bối cảnh không gian nào dưới đây kích thích trí tò mò của bạn nhất?",
    options: [
      { text: "Vũ trụ vô tận, các chiều không gian song song và công nghệ tương lai", genre: "Khoa học viễn tưởng" },
      { text: "Những con phố cổ yên bình, làng quê mộc mạc đượm buồn hoài niệm", genre: "Tâm lý" },
      { text: "Đấu trường rực lửa, chiến trường khốc liệt hoặc sào huyệt tội phạm", genre: "Hành động" },
      { text: "Thế giới phép thuật lung linh sắc màu nơi vạn vật đều có linh hồn", genre: "Hoạt hình" }
    ]
  },
  {
    id: 3,
    title: "3. Khi xem đến đoạn kết của một bộ phim, bạn thích kết thúc thế nào?",
    options: [
      { text: "Kẻ xấu bị tiêu diệt thích đáng, công lý được thực thi trọn vẹn", genre: "Hành động" },
      { text: "Cái kết mở đầy suy ngẫm, để lại nhiều dư âm day dứt khó phai", genre: "Tâm lý" },
      { text: "Hạnh phúc viên mãn, hai nhân vật chính tìm lại được nhau", genre: "Tình cảm" },
      { text: "Cú 'plot-twist' bẻ lái bất ngờ làm đảo lộn toàn bộ suy đoán ban đầu", genre: "Khoa học viễn tưởng" }
    ]
  },
  {
    id: 4,
    title: "4. Nếu được trò chuyện với một nhân vật trong phim, bạn muốn gặp ai?",
    options: [
      { text: "Một điệp viên tài ba với kỹ năng cận chiến siêu phàm", genre: "Hành động" },
      { text: "Một nhà khoa học thiên tài đang giải mã bí mật thời gian", genre: "Khoa học viễn tưởng" },
      { text: "Một tâm hồn nghệ sĩ đa sầu đa cảm với câu chuyện tình trắc trở", genre: "Tình cảm" },
      { text: "Một chú linh vật thông minh, đáng yêu và biết nói tiếng người", genre: "Hoạt hình" }
    ]
  },
  {
    id: 5,
    title: "5. Bản nhạc nền (Soundtrack) lý tưởng cho bộ phim yêu thích của bạn là:",
    options: [
      { text: "Giai điệu piano / acoustic da diết, chạm tới từng cung bậc cảm xúc", genre: "Tình cảm" },
      { text: "Nhạc giao hưởng hùng tráng, kỳ vĩ như những bản anh hùng ca vũ trụ", genre: "Khoa học viễn tưởng" },
      { text: "Nhạc rock dồn dập, tiếng bass mạnh mẽ thôi thúc tinh thần", genre: "Hành động" },
      { text: "Giai điệu vui tươi, trong trẻo như đưa ta về thế giới tuổi thơ", genre: "Hoạt hình" }
    ]
  },
  {
    id: 6,
    title: "6. Yếu tố nào sau đây là 'điểm cộng' lớn nhất đối với bạn khi xem phim?",
    options: [
      { text: "Diễn xuất đỉnh cao, lột tả sâu sắc nội tâm và bi kịch nhân vật", genre: "Tâm lý" },
      { text: "Kỹ xảo hình ảnh đột phá, mãn nhãn từng khung hình", genre: "Khoa học viễn tưởng" },
      { text: "Âm thanh rùng rợn, tạo không khí u ám hồi hộp đến thót tim", genre: "Kinh dị" },
      { text: "Hình ảnh hoạt họa sáng tạo, nét vẽ tinh tế giàu tính thẩm mỹ", genre: "Hoạt hình" }
    ]
  },
  {
    id: 7,
    title: "7. Bạn thường xem phim cùng với ai nhiều nhất?",
    options: [
      { text: "Xem một mình lúc đêm khuya để thưởng thức trọn vẹn sự chiêm nghiệm", genre: "Tâm lý" },
      { text: "Cùng người yêu trong một buổi hẹn hò lãng mạn cuối tuần", genre: "Tình cảm" },
      { text: "Xem cùng nhóm bạn thân để cùng hò reo cổ vũ hoặc cùng giật mình", genre: "Hành động" },
      { text: "Cùng gia đình, các em nhỏ để cùng nhau cười vui sảng khoái", genre: "Hoạt hình" }
    ]
  }
];

// Mô tả chi tiết kết quả từng thể loại
const GENRE_PROFILES = {
  "Hành động": {
    badge: "💥 Bạn là Tín Đồ Phim Hành Động (Action Lover)",
    desc: "Bạn là người năng động, dứt khoát và luôn tràn đầy năng lượng! Bạn đam mê những pha rượt đuổi tốc độ cao, những màn đối đầu cận chiến mãn nhãn và tinh thần quả cảm bảo vệ chính nghĩa. Điện ảnh đối với bạn là nguồn cảm hứng giải tỏa căng thẳng tuyệt vời nhất sau những giờ làm việc mệt mỏi."
  },
  "Khoa học viễn tưởng": {
    badge: "🚀 Bạn là Nhà Thám Hiểm Không Gian (Sci-Fi Explorer)",
    desc: "Bạn sở hữu một trí tưởng tượng phong phú và tư duy logic sắc bén! Bạn luôn bị lôi cuốn bởi các câu hỏi về tương lai nhân loại, những chiều không gian bí ẩn, lỗ sâu vũ trụ và những nghịch lý thời gian xoắn não. Bạn thích những bộ phim đòi hỏi sự tập trung và chiêm nghiệm sâu sắc."
  },
  "Tâm lý": {
    badge: "🎭 Bạn là Người Chiêm Nghiệm Nghệ Thuật (Drama Connoisseur)",
    desc: "Bạn có chiều sâu tâm hồn, khả năng thấu cảm tinh tế và luôn trân trọng những câu chuyện phản ánh chân thực số phận con người. Bạn tìm kiếm ở điện ảnh những lát cắt xã hội, những góc khuất tâm lý phức tạp và những bài học nhân văn sâu lắng chạm đến trái tim."
  },
  "Tình cảm": {
    badge: "💖 Bạn là Trái Tim Lãng Mạn (Romance Romantic)",
    desc: "Bạn là người ấm áp, nhạy cảm và giàu tình cảm. Bạn tin vào sức mạnh kỳ diệu của tình yêu chân thành, sự gắn kết định mệnh và những kỷ niệm thanh xuân tươi đẹp. Những thước phim chan chứa xúc cảm, dẫu hạnh phúc viên mãn hay đượm buồn tiếc nuối, luôn để lại trong bạn những rung động khó quên."
  },
  "Kinh dị": {
    badge: "🕯️ Bạn là Kẻ Chinh Phục Nỗi Sợ (Horror Seeker)",
    desc: "Bạn có tinh thần dũng cảm, thích cảm giác mạnh và không ngại bước chân vào những vùng đất u ám, huyền bí. Cảm giác hồi hộp tột độ và sự căng thẳng nghẹt thở khi đối diện với những thế lực siêu nhiên chính là chất kích thích tuyệt vời nhất với bạn."
  },
  "Hoạt hình": {
    badge: "🎨 Bạn là Tâm Hồn Trong Sáng (Animation Dreamer)",
    desc: "Bạn mang trong mình trái tim trẻ trung, yêu đời và không ngừng mơ mộng! Bạn trân quý những thông điệp gia đình ấm áp, tính nhân văn diệu kỳ và thế giới diệu vợi mà chỉ có nghệ thuật hoạt họa đỉnh cao mới có thể vẽ nên. Với bạn, hoạt hình không chỉ dành cho trẻ em, mà là kiệt tác nghệ thuật dành cho mọi lứa tuổi."
  }
};

// Quản lý trạng thái bài trắc nghiệm
class MovieQuizApp {
  constructor() {
    this.currentStep = 0; // 0: Màn hình giới thiệu, 1..7: Câu hỏi, 8: Kết quả
    this.scores = {
      "Hành động": 0,
      "Tình cảm": 0,
      "Tâm lý": 0,
      "Khoa học viễn tưởng": 0,
      "Kinh dị": 0,
      "Hoạt hình": 0
    };

    this.container = document.getElementById("quizAppContainer");
    if (this.container) {
      this.init();
    }
  }

  init() {
    this.renderIntro();
  }

  /**
   * Màn hình mở đầu giới thiệu bài trắc nghiệm
   */
  renderIntro() {
    this.container.innerHTML = `
      <section class="quiz-intro-card" aria-label="Giới thiệu bài trắc nghiệm">
        <span class="quiz-intro-icon">🎬🎯</span>
        <h1>Bạn Thực Sự Hợp Với Thể Loại Phim Nào?</h1>
        <p>
          Bạn đang phân vân không biết tối nay nên xem thể loại phim nào? Hãy trả lời nhanh 7 câu hỏi ngắn gọn dưới đây, hệ thống sẽ phân tích gu điện ảnh bí mật của bạn và đề xuất ngay 3 tác phẩm xuất sắc nhất!
        </p>
        <button type="button" id="btnStartQuiz" class="btn btn--primary btn--lg">
          Bắt Đầu Làm Trắc Nghiệm Ngay &rarr;
        </button>
      </section>
    `;

    const btnStart = document.getElementById("btnStartQuiz");
    if (btnStart) {
      btnStart.addEventListener("click", () => {
        this.currentStep = 1;
        this.renderQuestion();
      });
    }
  }

  /**
   * Hiển thị câu hỏi hiện tại
   */
  renderQuestion() {
    const questionIndex = this.currentStep - 1;
    const q = QUIZ_QUESTIONS[questionIndex];
    const total = QUIZ_QUESTIONS.length;
    const progressPercent = Math.round(((questionIndex + 1) / total) * 100);

    const letters = ["A", "B", "C", "D"];

    this.container.innerHTML = `
      <div class="quiz-progress-wrapper">
        <div class="quiz-progress-text">
          <span>Câu hỏi ${this.currentStep} / ${total}</span>
          <span>Tiến độ: ${progressPercent}%</span>
        </div>
        <div class="quiz-progress-bar">
          <div class="quiz-progress-fill" style="width: ${progressPercent}%"></div>
        </div>
      </div>

      <section class="quiz-question-card" aria-label="Nội dung câu hỏi">
        <h2 class="quiz-question-title">${q.title}</h2>
        <div class="quiz-options-list">
          ${q.options.map((opt, i) => `
            <button type="button" class="quiz-option-btn" data-genre="${opt.genre}">
              <span class="quiz-option-letter">${letters[i]}</span>
              <span>${opt.text}</span>
            </button>
          `).join('')}
        </div>
      </section>
    `;

    // Gắn sự kiện chọn đáp án
    const optionBtns = this.container.querySelectorAll(".quiz-option-btn");
    optionBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const genre = btn.getAttribute("data-genre");
        btn.classList.add("is-selected");

        // Cộng điểm cho thể loại được chọn
        if (this.scores[genre] !== undefined) {
          this.scores[genre] += 1;
        }

        // Chuyển sang câu tiếp theo sau hiệu ứng 0.3s
        setTimeout(() => {
          if (this.currentStep < total) {
            this.currentStep += 1;
            this.renderQuestion();
          } else {
            this.renderResult();
          }
        }, 280);
      });
    });
  }

  /**
   * Tính toán và hiển thị màn hình kết quả
   */
  renderResult() {
    // Tìm thể loại có điểm cao nhất
    let topGenre = "Tâm lý";
    let highestScore = -1;

    for (const [genre, score] of Object.entries(this.scores)) {
      if (score > highestScore) {
        highestScore = score;
        topGenre = genre;
      }
    }

    const profile = GENRE_PROFILES[topGenre] || GENRE_PROFILES["Tâm lý"];

    // Lấy 3 phim phù hợp nhất từ MOVIES_DATABASE
    let matchingMovies = [];
    if (window.MOVIES_DATABASE) {
      matchingMovies = window.MOVIES_DATABASE
        .filter(m => m.genres.includes(topGenre))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);

      // Nếu không đủ 3 phim, bổ sung thêm phim điểm cao khác
      if (matchingMovies.length < 3) {
        const remaining = window.MOVIES_DATABASE
          .filter(m => !matchingMovies.includes(m))
          .slice(0, 3 - matchingMovies.length);
        matchingMovies = [...matchingMovies, ...remaining];
      }
    }

    this.container.innerHTML = `
      <section class="quiz-result-card" aria-label="Kết quả phân tích gu điện ảnh">
        <div class="quiz-result-header">
          <span style="font-size: 3rem; display: block; margin-bottom: 12px;">🎉</span>
          <span class="quiz-result-genre-badge">${profile.badge}</span>
          <p class="quiz-result-desc">${profile.desc}</p>
        </div>

        <div class="quiz-suggested-movies">
          <h3>🌟 3 Siêu Phẩm Dành Riêng Cho Bạn Tối Nay</h3>
          <div class="quiz-suggested-grid">
            ${matchingMovies.map(movie => `
              <article class="movie-card" style="box-shadow: none;">
                <div class="movie-card__poster-wrapper">
                  <img class="movie-card__poster" src="${movie.poster}" alt="${movie.title}" loading="lazy">
                  <span class="movie-card__rating-badge">★ ${movie.rating.toFixed(1)}</span>
                </div>
                <div class="movie-card__body">
                  <h4 class="movie-card__title" title="${movie.title}">
                    <a href="chi-tiet-phim.html?id=${movie.id}">${movie.title}</a>
                  </h4>
                  <p class="movie-card__original-title">${movie.year} • ${movie.durationText}</p>
                  <a href="chi-tiet-phim.html?id=${movie.id}" class="btn btn--primary btn--sm" style="margin-top: 8px;">Xem Chi Tiết</a>
                </div>
              </article>
            `).join('')}
          </div>
        </div>

        <div class="quiz-action-footer">
          <button type="button" id="btnRestartQuiz" class="btn btn--outline btn--lg">
            <span>🔄</span> Làm Lại Trắc Nghiệm
          </button>
          <a href="danh-sach-phim.html?genre=${encodeURIComponent(topGenre)}" class="btn btn--primary btn--lg">
            Xem Thêm Phim ${topGenre} &rarr;
          </a>
        </div>
      </section>
    `;

    // Sự kiện làm lại
    const btnRestart = document.getElementById("btnRestartQuiz");
    if (btnRestart) {
      btnRestart.addEventListener("click", () => {
        this.reset();
      });
    }
  }

  /**
   * Đặt lại trạng thái bài trắc nghiệm về ban đầu
   */
  reset() {
    this.currentStep = 0;
    this.scores = {
      "Hành động": 0,
      "Tình cảm": 0,
      "Tâm lý": 0,
      "Khoa học viễn tưởng": 0,
      "Kinh dị": 0,
      "Hoạt hình": 0
    };
    this.renderIntro();
  }
}

// Khởi chạy ứng dụng Quiz khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  new MovieQuizApp();
});
