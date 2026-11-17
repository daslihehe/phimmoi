/**
 * ==============================================================================
 * DỰ ÁN CỔNG THÔNG TIN ĐIỆN ẢNH - PHIMMOI.NET
 * File: js/form-validate.js
 * Mô tả: Kiểm tra tính hợp lệ của biểu mẫu Đề xuất phim (lien-he.html):
 *        1. Họ và tên: Bắt buộc, tối thiểu 3 ký tự
 *        2. Email: Đúng định dạng email chuẩn RFC
 *        3. Số điện thoại: Chuẩn định dạng di động Việt Nam (03, 05, 07, 08, 09 + 8 số)
 *        4. Tên phim đề xuất: Bắt buộc nhập
 *        5. Thể loại chính: Bắt buộc chọn từ danh sách
 *        6. Lý do / Nội dung đề xuất: Tối thiểu 20 ký tự (kèm đếm ký tự realtime)
 *        7. Điều khoản đóng góp: Bắt buộc đánh dấu chọn
 *        8. Hiển thị thông báo lỗi ngay dưới từng ô và banner thông báo thành công
 * ==============================================================================
 */

// REGEX KIỂM TRA ĐỊNH DẠNG
const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const REGEX_VN_PHONE = /^(03|05|07|08|09)\d{8}$/;

/**
 * Hiển thị lỗi dưới trường nhập liệu
 * @param {HTMLElement} inputEl - Phần tử input/select/textarea
 * @param {string} message - Thông điệp lỗi cần hiển thị
 */
function showError(inputEl, message) {
  const formGroup = inputEl.closest(".form-group");
  if (!formGroup) return;

  formGroup.classList.add("has-error");
  formGroup.classList.remove("has-success");

  const errorEl = formGroup.querySelector(".form-error-msg");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = "block";
  }
}

/**
 * Xóa thông báo lỗi và đánh dấu trường hợp lệ
 * @param {HTMLElement} inputEl - Phần tử input/select/textarea
 */
function showSuccess(inputEl) {
  const formGroup = inputEl.closest(".form-group");
  if (!formGroup) return;

  formGroup.classList.remove("has-error");
  formGroup.classList.add("has-success");

  const errorEl = formGroup.querySelector(".form-error-msg");
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.style.display = "none";
  }
}

/**
 * Kiểm tra tính hợp lệ của trường Họ và tên
 */
function validateFullName(input) {
  const val = input.value.trim();
  if (val === "") {
    showError(input, "Vui lòng nhập họ và tên của bạn.");
    return false;
  }
  if (val.length < 3) {
    showError(input, "Họ và tên phải có tối thiểu 3 ký tự.");
    return false;
  }
  showSuccess(input);
  return true;
}

/**
 * Kiểm tra tính hợp lệ của trường Email
 */
function validateEmail(input) {
  const val = input.value.trim();
  if (val === "") {
    showError(input, "Vui lòng nhập địa chỉ email liên hệ.");
    return false;
  }
  if (!REGEX_EMAIL.test(val)) {
    showError(input, "Địa chỉ email không đúng định dạng (Ví dụ: ban@example.com).");
    return false;
  }
  showSuccess(input);
  return true;
}

/**
 * Kiểm tra tính hợp lệ của trường Số điện thoại Việt Nam
 */
function validatePhone(input) {
  const val = input.value.trim();
  if (val === "") {
    showError(input, "Vui lòng nhập số điện thoại liên hệ.");
    return false;
  }
  // Loại bỏ khoảng trắng hoặc dấu chấm nếu người dùng lỡ nhập
  const cleanPhone = val.replace(/[\s.-]/g, "");
  if (!REGEX_VN_PHONE.test(cleanPhone)) {
    showError(input, "Số điện thoại di động Việt Nam không hợp lệ (Bắt đầu bằng 03, 05, 07, 08, 09 và gồm 10 chữ số).");
    return false;
  }
  showSuccess(input);
  return true;
}

/**
 * Kiểm tra tên phim đề xuất
 */
function validateMovieName(input) {
  const val = input.value.trim();
  if (val === "") {
    showError(input, "Vui lòng nhập tên bộ phim bạn muốn đề xuất.");
    return false;
  }
  showSuccess(input);
  return true;
}

/**
 * Kiểm tra chọn thể loại
 */
function validateGenreSelect(select) {
  const val = select.value;
  if (val === "" || val === "none") {
    showError(select, "Vui lòng chọn thể loại chính của phim đề xuất.");
    return false;
  }
  showSuccess(select);
  return true;
}

/**
 * Kiểm tra nội dung mô tả / lý do đề xuất
 */
function validateMessage(textarea) {
  const val = textarea.value.trim();
  if (val === "") {
    showError(textarea, "Vui lòng viết vài dòng giới thiệu hoặc lý do bạn đề xuất phim này.");
    return false;
  }
  if (val.length < 20) {
    showError(textarea, `Nội dung quá ngắn. Vui lòng nhập tối thiểu 20 ký tự (Hiện tại: ${val.length}/20).`);
    return false;
  }
  showSuccess(textarea);
  return true;
}

/**
 * Kiểm tra hộp checkbox đồng ý điều khoản
 */
function validateTermsCheckbox(checkbox) {
  if (!checkbox.checked) {
    showError(checkbox, "Bạn cần tích đồng ý với quy định đóng góp thông tin của website.");
    return false;
  }
  showSuccess(checkbox);
  return true;
}

/**
 * Khởi tạo kiểm tra tính hợp lệ Form Đề xuất phim
 */
function initContactForm() {
  const form = document.getElementById("movieSuggestForm");
  if (!form) return;

  const fullNameInput = document.getElementById("senderName");
  const emailInput = document.getElementById("senderEmail");
  const phoneInput = document.getElementById("senderPhone");
  const movieNameInput = document.getElementById("suggestMovieName");
  const genreSelect = document.getElementById("suggestGenre");
  const messageInput = document.getElementById("suggestMessage");
  const termsCheckbox = document.getElementById("agreeTerms");
  const charCounter = document.getElementById("charCounter");
  const successBanner = document.getElementById("formSuccessBanner");

  // Bộ đếm ký tự realtime cho textarea
  if (messageInput && charCounter) {
    messageInput.addEventListener("input", function () {
      const len = this.value.trim().length;
      charCounter.textContent = `${len} ký tự (tối thiểu 20)`;
      if (len >= 20) {
        charCounter.style.color = "var(--accent)";
      } else {
        charCounter.style.color = "var(--text-muted)";
      }
    });
  }

  // Lắng nghe sự kiện blur để kiểm tra ngay khi rời ô nhập liệu
  if (fullNameInput) fullNameInput.addEventListener("blur", () => validateFullName(fullNameInput));
  if (emailInput) emailInput.addEventListener("blur", () => validateEmail(emailInput));
  if (phoneInput) phoneInput.addEventListener("blur", () => validatePhone(phoneInput));
  if (movieNameInput) movieNameInput.addEventListener("blur", () => validateMovieName(movieNameInput));
  if (genreSelect) genreSelect.addEventListener("change", () => validateGenreSelect(genreSelect));
  if (messageInput) messageInput.addEventListener("blur", () => validateMessage(messageInput));
  if (termsCheckbox) termsCheckbox.addEventListener("change", () => validateTermsCheckbox(termsCheckbox));

  // Xử lý khi nhấn nút Gửi (Submit)
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Ngăn trình duyệt reload trang

    const isNameValid = validateFullName(fullNameInput);
    const isEmailValid = validateEmail(emailInput);
    const isPhoneValid = validatePhone(phoneInput);
    const isMovieValid = validateMovieName(movieNameInput);
    const isGenreValid = validateGenreSelect(genreSelect);
    const isMessageValid = validateMessage(messageInput);
    const isTermsValid = validateTermsCheckbox(termsCheckbox);

    const isFormValid = isNameValid && isEmailValid && isPhoneValid && isMovieValid && isGenreValid && isMessageValid && isTermsValid;

    if (isFormValid) {
      // Ẩn form và hiện banner thành công với hiệu ứng đẹp mắt
      if (successBanner) {
        successBanner.style.display = "block";
        successBanner.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      // Reset toàn bộ trường nhập liệu
      form.reset();

      // Xóa các class trạng thái thành công/lỗi
      form.querySelectorAll(".form-group").forEach(fg => {
        fg.classList.remove("has-success", "has-error");
      });

      if (charCounter) {
        charCounter.textContent = "0 ký tự (tối thiểu 20)";
        charCounter.style.color = "var(--text-muted)";
      }
    } else {
      // Cuộn đến trường lỗi đầu tiên
      const firstError = form.querySelector(".has-error");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });
}

// Khởi chạy khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  initContactForm();
});
