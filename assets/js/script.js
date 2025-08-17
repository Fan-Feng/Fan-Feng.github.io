'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}


// Publications are rendered statically from index.html. CSV renderer removed per request.

// Publication year parsing helper (empty/non-number => very small)
const parseYearFromLi = (li) => {
  const yEl = li.querySelector('.pub-year');
  if (!yEl) return Number.NEGATIVE_INFINITY;
  const txt = yEl.textContent.trim();
  const n = parseInt(txt, 10);
  return Number.isNaN(n) ? Number.NEGATIVE_INFINITY : n;
};

// Sort the publication list; descending=true sorts newest-first
const sortPublications = (descending = true) => {
  const list = document.querySelector('.blog-posts-list');
  if (!list) return;
  const items = Array.from(list.querySelectorAll('li.blog-post-item'));
  items.sort((a, b) => {
    const ya = parseYearFromLi(a);
    const yb = parseYearFromLi(b);
    return descending ? yb - ya : ya - yb;
  });
  items.forEach(i => list.appendChild(i));
};

// Wire the Year button to toggle sort order based on current state
const sortYearBtn = document.getElementById('sort-year-btn');
if (sortYearBtn) {
  sortYearBtn.addEventListener('click', function () {
    const list = document.querySelector('.blog-posts-list');
    if (!list) return;

    const items = Array.from(list.querySelectorAll('li.blog-post-item'));
    const years = items.map(parseYearFromLi);

    const isSortedDesc = (arr) => {
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < arr[i + 1]) return false;
      }
      return true;
    };

    const isSortedAsc = (arr) => {
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) return false;
      }
      return true;
    };

    let descending = true; // default
    if (isSortedDesc(years)) descending = false; // switch to ascending
    else if (isSortedAsc(years)) descending = true; // switch to descending
    else descending = true; // default to descending if unsorted/mixed

    sortPublications(descending);
  });
}

// Default: sort publications by year descending on page load
sortPublications(true);

// Publication type filters (Conference / Journal / Others)
const pubFilterBtns = document.querySelectorAll('.pub-filter-btn');
if (pubFilterBtns && pubFilterBtns.length) {
  const list = document.querySelector('.blog-posts-list');
  const items = Array.from(document.querySelectorAll('li.blog-post-item'));

  const getType = (li) => {
    const t = li.querySelector('.pub-tag.pub-type');
    if (!t) return '';
    return t.textContent.trim().toLowerCase();
  };

  const applyFilter = (filter) => {
    items.forEach(li => {
      const type = getType(li);
      if (!filter || filter === 'all') {
        li.style.display = '';
      } else if (filter === 'others') {
        if (type !== 'conference' && type !== 'journal') li.style.display = '';
        else li.style.display = 'none';
      } else {
        li.style.display = (type === filter) ? '' : 'none';
      }
    });
  };

  pubFilterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      // toggle active class, but ensure only one active
      pubFilterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const f = this.dataset.pubFilter;
      applyFilter(f);
    });
  });

  // set 'All' as default active filter on load
  const allBtn = Array.from(pubFilterBtns).find(b => b.dataset.pubFilter === 'all');
  if (allBtn) {
    allBtn.classList.add('active');
    applyFilter('all');
  }

}