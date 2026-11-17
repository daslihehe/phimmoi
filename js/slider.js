/**
 * ==============================================================================
 * DỰ ÁN CỔNG THÔNG TIN ĐIỆN ẢNH - PHIMMOI.NET
 * File: js/slider.js
 * Mô tả: Điều khiển Carousel/Slider phim nổi bật trên Trang chủ:
 *        - Tự động chạy (Autoplay) với hằng số thời gian tùy chỉnh
 *        - Dừng chạy khi di chuột vào slider (Pause on Hover)
 *        - Nút bấm Trước (Prev) / Tiếp theo (Next)
 *        - Chấm tròn điều hướng (Indicator Dots)
 *        - Hỗ trợ phím mũi tên trái/phải trên bàn phím
 * ==============================================================================
 */

// HẰNG SỐ DỄ DÀNG ĐIỀU CHỈNH TRONG BUỔI VẤN ĐÁP:
const SLIDER_AUTOPLAY_INTERVAL = 5000; // Thời gian chuyển slide: 5000ms = 5 giây

class MovieHeroSlider {
  constructor() {
    this.sliderContainer = document.querySelector(".hero-slider-section");
    this.slides = document.querySelectorAll(".hero-slide");
    this.dots = document.querySelectorAll(".slider-dot");
    this.prevBtn = document.querySelector(".slider-arrow--prev");
    this.nextBtn = document.querySelector(".slider-arrow--next");

    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.timer = null;
    this.isPlaying = true;

    if (this.totalSlides > 0) {
      this.init();
    }
  }

  /**
   * Khởi tạo các sự kiện và kích hoạt chạy tự động
   */
  init() {
    // Sự kiện nút Next / Prev
    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => {
        this.nextSlide();
        this.resetTimer();
      });
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => {
        this.prevSlide();
        this.resetTimer();
      });
    }

    // Sự kiện click vào các dấu chấm tròn (dots)
    this.dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        this.goToSlide(index);
        this.resetTimer();
      });
    });

    // Tạm dừng khi di chuột vào Slider, chạy lại khi rời chuột (Pause on hover)
    if (this.sliderContainer) {
      this.sliderContainer.addEventListener("mouseenter", () => {
        this.pause();
      });

      this.sliderContainer.addEventListener("mouseleave", () => {
        this.play();
      });
    }

    // Điều hướng bằng bàn phím mũi tên khi đang xem trang
    document.addEventListener("keydown", (e) => {
      if (!this.sliderContainer) return;
      const rect = this.sliderContainer.getBoundingClientRect();
      const isInViewport = rect.top >= -200 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + 200;
      if (isInViewport) {
        if (e.key === "ArrowLeft") {
          this.prevSlide();
          this.resetTimer();
        } else if (e.key === "ArrowRight") {
          this.nextSlide();
          this.resetTimer();
        }
      }
    });

    // Bắt đầu chạy tự động
    this.play();
  }

  /**
   * Chuyển đến slide tại chỉ số index cụ thể
   * @param {number} index - Vị trí slide cần tới (0 -> totalSlides - 1)
   */
  goToSlide(index) {
    if (index < 0) {
      this.currentIndex = this.totalSlides - 1;
    } else if (index >= this.totalSlides) {
      this.currentIndex = 0;
    } else {
      this.currentIndex = index;
    }

    // Cập nhật class active cho Slide
    this.slides.forEach((slide, i) => {
      if (i === this.currentIndex) {
        slide.classList.add("is-active");
      } else {
        slide.classList.remove("is-active");
      }
    });

    // Cập nhật class active cho Dot
    this.dots.forEach((dot, i) => {
      if (i === this.currentIndex) {
        dot.classList.add("is-active");
        dot.setAttribute("aria-current", "true");
      } else {
        dot.classList.remove("is-active");
        dot.removeAttribute("aria-current");
      }
    });
  }

  /**
   * Chuyển sang slide tiếp theo
   */
  nextSlide() {
    this.goToSlide(this.currentIndex + 1);
  }

  /**
   * Quay lại slide liền trước
   */
  prevSlide() {
    this.goToSlide(this.currentIndex - 1);
  }

  /**
   * Bắt đầu chạy tự động sau mỗi khoảng thời gian SLIDER_AUTOPLAY_INTERVAL
   */
  play() {
    this.isPlaying = true;
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.nextSlide();
    }, SLIDER_AUTOPLAY_INTERVAL);
  }

  /**
   * Tạm dừng chạy tự động
   */
  pause() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Đặt lại bộ đếm khi người dùng tương tác thủ công
   */
  resetTimer() {
    this.pause();
    this.play();
  }
}

// Khởi chạy slider khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  new MovieHeroSlider();
});
