import { products } from "./asset/data/product.js";
import feedbacks from "./asset/data/feedback.js";
import questions from "./asset/data/question.js";

// Render Products
function renderProducts() {
  const wrapper = document.getElementById("product-swiper-wrapper");
  if (!wrapper) {
    console.error("product-swiper-wrapper not found in DOM");
    return;
  }

  if (!products || !Array.isArray(products)) {
    console.error("products is not an array", products);
    wrapper.innerHTML = "<div style='padding:20px'>No products data</div>";
    return;
  }

  console.log("Rendering products count:", products.length);

  wrapper.innerHTML = products
    .map(
      (product) => `
      <div class="swiper-slide bg-white flex flex-col gap-[1vmax]">
        <div class="relative overflow-hidden group">
          <img src="${product.image}" 
               class="w-full bg-[#fdf6ee] rounded-xl" 
               alt="${product.name}">
          <button
            class="absolute m-[20px] bottom-0 left-0 right-0 bg-[#6b7c5a] text-white font-semibold py-3
                   transform translate-y-full opacity-0
                   group-hover:translate-y-0 group-hover:opacity-100
                   transition duration-300 ease-out">
            ADD TO CART
          </button>
        </div>
        <div class="text-[12px] leading-[12px] tracking-[1px] text-gray-500 uppercase">${product.brand}</div>
        <h3 class="text-[16px] leading-[26px] font-[600] tracking-[0.6px] py-[10p]">
          ${product.name}
        </h3>
        <div class="flex gap-[12px] items-center">
          <span class="text-[20px] font-bold">$${product.price}</span>
          ${
            product.oldPrice
              ? `<span class="line-through text-[14px] text-gray-400">$${product.oldPrice}</span>`
              : ""
          }
        </div>
        <div class="flex items-center gap-[1px]">
          ${Array(product.rating)
            .fill()
            .map(
              () => `
            <svg class="w-[14.5px] h-[14.5px] text-yellow-400" 
                 xmlns="http://www.w3.org/2000/svg" 
                 viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.9998 17L6.12197 20.5902L7.72007 13.8906L2.48926 9.40983L9.35479 8.85942L11.9998 2.5L14.6449 8.85942L21.5104 9.40983L16.2796 13.8906L17.8777 20.5902L11.9998 17Z"/>
            </svg>
          `
            )
            .join("")}
        </div>
      </div>
    `
    )
    .join("");
}

// --- Thêm: startCountdownFromHtml ---
function startCountdownFromHtml() {
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
    console.warn("Countdown elements not found, skipping countdown.");
    return;
  }

  function pad(num) {
    return String(num).padStart(2, "0");
  }

  // đọc giá trị ban đầu (số) từ HTML
  const initialDays = parseInt(daysEl.textContent, 10) || 0;
  const initialHours = parseInt(hoursEl.textContent, 10) || 0;
  const initialMinutes = parseInt(minutesEl.textContent, 10) || 0;
  const initialSeconds = parseInt(secondsEl.textContent, 10) || 0;

  // tính thời điểm đích (target) dựa trên giá trị ban đầu tính từ now
  const now = Date.now();
  const target = new Date(
    now +
      initialDays * 24 * 60 * 60 * 1000 +
      initialHours * 60 * 60 * 1000 +
      initialMinutes * 60 * 1000 +
      initialSeconds * 1000
  ).getTime();

  function update() {
    const diff = target - Date.now();
    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    daysEl.textContent = pad(d);
    hoursEl.textContent = pad(h);
    minutesEl.textContent = pad(m);
    secondsEl.textContent = pad(s);
  }

  update();
  const intervalId = setInterval(() => {
    update();
    // stop when reaches zero (optional)
    if (
      daysEl.textContent === "00" &&
      hoursEl.textContent === "00" &&
      minutesEl.textContent === "00" &&
      secondsEl.textContent === "00"
    ) {
      clearInterval(intervalId);
    }
  }, 1000);
}
// --- end startCountdownFromHtml ---

document.addEventListener("DOMContentLoaded", async () => {
  renderProducts();

  // Bắt đầu countdown ngay sau khi render products
  startCountdownFromHtml();

  // Init Swiper AFTER products are rendered, only for product swiper
  const productEl = document.querySelector(".product-swiper");
  if (!productEl) {
    console.error("product-swiper element not found");
    return;
  }

  // Ensure Swiper is available
  if (typeof Swiper === "undefined") {
    console.error("Swiper is not loaded");
    return;
  }

  const swiper = new Swiper(productEl, {
    slidesPerView: 4,
    spaceBetween: 20,
    slidesPerGroup: 1,
    loop: false,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      320: { slidesPerView: 1 },
      640: { slidesPerView: 2 },
      1024: { slidesPerView: 4 },
    },
    on: {
      init: function () {
        updateProgress(this);
      },
      slideChange: function () {
        updateProgress(this);
      },
    },
  });

  function updateProgress(swiper) {
    const total = swiper.slides.length;
    const visible = swiper.params.slidesPerView;
    const percent = ((swiper.activeIndex + visible) / total) * 100;

    const fill = swiper.el.querySelector(".swiper-pagination-progressbar-fill");
    if (fill) fill.style.width = `${percent}%`;
  }

  // Dynamic import overview (avoid top-level import errors)
  try {
    const mod = await import("./asset/data/overview.js");
    const overviews = mod.overviews || mod.default;
    if (overviews && Array.isArray(overviews)) {
      renderOverview(overviews);
      // init Swiper instances AFTER rendering overview slides
      initOverviewSwipers();
    } else {
      console.warn("overviews not found or invalid", overviews);
    }
  } catch (err) {
    console.error("Failed to load overview data:", err);
  }
});

// Render Overview
function renderOverview(data) {
  let html = data
    .map(
      (element) => `
      <div class="swiper-slide">
        <figure>
          <img src=${element.image} alt="product image" />
        </figure>
      </div>
    `
    )
    .join("");

  document.querySelector(".overview__gallery")?.insertAdjacentHTML("beforeend", html);
}

// --- Thêm: init Swipers cho overview ---
function initOverviewSwipers() {
  if (typeof Swiper === "undefined") {
    console.error("Swiper is not loaded (overview)");
    return;
  }

  // main overview swiper (uses .btn-prev / .btn-next in HTML)
  new Swiper(".swiperOverview", {
    slidesPerView: 1,
    spaceBetween: 0,
    navigation: {
      nextEl: ".btn-next",
      prevEl: ".btn-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    loop: true,
  });

  // modal overview swiper (uses overview__button-prev / overview__button-next)
  new Swiper(".swiperOverviewModal", {
    slidesPerView: 1,
    spaceBetween: 0,
    zoom: true,
    navigation: {
      nextEl: ".overview__button-next",
      prevEl: ".overview__button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    loop: true,
  });
}
// --- end initOverviewSwipers ---

//conparison
const comparisonSlider = document.querySelector(".comparison__slider input");
const imageRight = document.querySelector(".image-right");
const comparisonLine = document.querySelector(".comparison__slider--line");

comparisonSlider.addEventListener("input", () => {
  const sliderValue = comparisonSlider.value;
  comparisonLine.style.left = sliderValue + "%";
  imageRight.style.clipPath = `inset(0 0 0 ${sliderValue}%)`;
});

// --- Thêm: helper renderRating ---
function renderRating(rating = 0) {
  const full = Math.max(0, Math.min(5, Math.floor(Number(rating) || 0)));
  return Array(full)
    .fill()
    .map(
      () =>
        `<svg class="w-[14.5px] h-[14.5px] text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.9998 17L6.12197 20.5902L7.72007 13.8906L2.48926 9.40983L9.35479 8.85942L11.9998 2.5L14.6449 8.85942L21.5104 9.40983L16.2796 13.8906L17.8777 20.5902L11.9998 17Z"/></svg>`
    )
    .join("");
}
// --- end helper ---

// --- Sửa: renderFeedback dùng .rating và an toàn nếu DOM chưa có ---
const renderFeedback = (data) => {
  if (!Array.isArray(data)) return;
  const html = data
    .map((element) => {
      const stars = renderRating(element.rating);
      return `
      <div class="swiper-slide">
        <div class="feedback__wrapper">
          <figure class="feedback__avatar">
            <img src="${element.avatar}" loading="lazy" alt="avatar feedback" />
          </figure>
          <div class="feedback__content">
            <div class="feedback__ratings">
              ${stars}
            </div>
            <div class="text-p1">
              ${element.feedback}
            </div>
            <div class="feedback__name text-p1">– ${element.name}</div>
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  const listEl = document.querySelector(".feedback__list");
  if (listEl) listEl.innerHTML = html;
};
// --- end renderFeedback ---

// Gọi sau khi định nghĩa
renderFeedback(feedbacks);

new Swiper(".swiperFeedback", {
  speed: 600,
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

// question
const renderQuestion = (data) => {
  let html = "";
  html = data.map((element) => {
    return `
      <div class="accordion__item">
        <div class="accordion__item--header">
          <span>${element.question}</span>
          <div class="accordion__header--icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor">
              <path
                d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
            </svg>
          </div>
        </div>
        <div class="accordion__item--body">
          <div class="accordion__content text-p2">${element.answer}</div>
        </div>
      </div>
    `;
  });
  document.querySelector(".question__accordion").innerHTML = html.join("");
};
renderQuestion(questions);
