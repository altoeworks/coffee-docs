// ============================================================================
// GLOSSARY FUNCTIONALITY
// ============================================================================

// ============================================================================
// DARK MODE FUNCTIONALITY
// ============================================================================

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
    const body = document.body;
    const isDark = body.classList.contains('dark');

    if (isDark) {
        body.classList.remove('dark');
        localStorage.setItem('darkMode', 'false');
    } else {
        body.classList.add('dark');
        localStorage.setItem('darkMode', 'true');
    }
}

/**
 * Load dark mode preference from localStorage
 */
function loadDarkModePreference() {
    const savedPreference = localStorage.getItem('darkMode');
    if (savedPreference === 'true') {
        document.body.classList.add('dark');
    }
}

// ============================================================================
// PROGRESS BAR FUNCTIONALITY
// ============================================================================

/**
 * Update the reading progress bar based on scroll position
 */
function updateProgressBar() {
    const bar = document.getElementById('progress-bar');
    if (!bar) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = percent + '%';
}

// ============================================================================
// GLOSSARY FUNCTIONALITY
// ============================================================================

/**
 * Initialize glossary functionality
 */
function initGlossary() {
    const terms = Object.keys(glossaryData);
    const alphabet = [...new Set(terms.map(term => term.charAt(0).toUpperCase()))].sort();

    // Get all unique categories from all terms
    const allCategories = new Set();
    Object.values(glossaryData).forEach(item => {
        // Handle both old single category and new multiple categories format
        if (item.categories) {
            item.categories.forEach(cat => allCategories.add(cat));
        } else if (item.category) {
            allCategories.add(item.category);
        }
    });
    const categories = [...allCategories].sort();

    // Update stats
    const totalTermsElement = document.getElementById('total-terms');
    if (totalTermsElement) {
        totalTermsElement.textContent = `${terms.length} terms`;
    }

    // Create alphabet navigation
    const alphabetNav = document.getElementById('alphabet-nav');
    if (alphabetNav) {
        alphabetNav.innerHTML = `
            <button class="px-3 py-2 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-colors" data-letter="all">
                All
            </button>
        `;
    } else {
        return;
    }

    alphabet.forEach(letter => {
        const button = document.createElement('button');
        button.className = 'px-3 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors dark:bg-darksection dark:text-darktext dark:hover:bg-darkbg';
        button.textContent = letter;
        button.setAttribute('data-letter', letter);
        button.addEventListener('click', () => filterByLetter(letter));
        alphabetNav.appendChild(button);
    });

    // Add "All" button functionality
    const allButton = alphabetNav.querySelector('[data-letter="all"]');
    if (allButton) {
        allButton.addEventListener('click', () => filterByLetter('all'));
    }

    // Create category navigation
    const categoryNav = document.getElementById('category-nav');
    if (categoryNav) {
        categoryNav.innerHTML = `
            <button class="px-3 py-2 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-colors" data-category="all">
                All Categories
            </button>
        `;

        categories.forEach(category => {
            const button = document.createElement('button');
            const categoryColor = categoryColors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
            button.className = `px-3 py-2 rounded-lg font-medium transition-colors ${categoryColor}`;
            button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            button.setAttribute('data-category', category);
            button.addEventListener('click', () => filterByCategory(category));
            categoryNav.appendChild(button);
        });

        // Add "All Categories" button functionality
        const allCategoryButton = categoryNav.querySelector('[data-category="all"]');
        if (allCategoryButton) {
            allCategoryButton.addEventListener('click', () => filterByCategory('all'));
        }
    }

    // Render all terms
    renderTerms(terms);
}

/**
 * Render terms in the container
 */
function renderTerms(terms) {
    const container = document.getElementById('terms-container');
    const noResults = document.getElementById('no-results');

    if (terms.length === 0) {
        container.innerHTML = '';
        noResults.classList.remove('hidden');
        document.getElementById('filtered-count').textContent = '0 terms';
        return;
    }

    noResults.classList.add('hidden');
    document.getElementById('filtered-count').textContent = `${terms.length} terms`;

    // Group terms by first letter
    const groupedTerms = {};
    terms.forEach(term => {
        const firstLetter = term.charAt(0).toUpperCase();
        if (!groupedTerms[firstLetter]) {
            groupedTerms[firstLetter] = [];
        }
        groupedTerms[firstLetter].push(term);
    });

    // Sort letters and render
    const sortedLetters = Object.keys(groupedTerms).sort();
    container.innerHTML = '';

    sortedLetters.forEach(letter => {
        const letterSection = document.createElement('div');
        letterSection.className = 'mb-12';

        const letterHeader = document.createElement('h2');
        letterHeader.className = 'text-3xl font-bold text-main mb-6 dark:text-darktext';
        letterHeader.textContent = letter;
        letterSection.appendChild(letterHeader);

        const termsGrid = document.createElement('div');
        termsGrid.className = 'grid gap-6 md:grid-cols-2 lg:grid-cols-3';

        groupedTerms[letter].forEach(term => {
            const termCard = createTermCard(term, glossaryData[term]);
            termsGrid.appendChild(termCard);
        });

        letterSection.appendChild(termsGrid);
        container.appendChild(letterSection);
    });
}

/**
 * Create a term card element
 */
function createTermCard(term, data) {
    const card = document.createElement('div');
    card.className = 'bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all dark:bg-darksection dark:border-darkborder';

    // Handle both old single category and new multiple categories format
    const categories = data.categories || [data.category];

    // Create category badges HTML
    const categoryBadgesHtml = categories.map(category => {
        const categoryColor = categoryColors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        return `<button class="px-3.5 py-2 rounded-full text-xs font-medium ${categoryColor} hover:scale-105 transition-transform cursor-pointer" data-category="${category}">${category}</button>`;
    }).join('');

    card.innerHTML = `
        <div class="mb-3">
            <h3 class="text-xl font-semibold text-main dark:text-darktext mb-2">${term}</h3>
            <div class="flex flex-wrap gap-1.5">
                ${categoryBadgesHtml}
            </div>
        </div>
        <p class="text-gray-600 dark:text-darktext leading-relaxed">
            ${data.definition}
        </p>
    `;

    // Add click events to all category badges
    const categoryBadges = card.querySelectorAll('button[data-category]');
    categoryBadges.forEach(badge => {
        badge.addEventListener('click', () => filterByCategory(badge.getAttribute('data-category')));
    });

    return card;
}

/**
 * Filter terms by letter
 */
function filterByLetter(letter) {
    const searchInput = document.getElementById('search-input');
    const currentSearch = searchInput.value.toLowerCase();

    // Update alphabet navigation
    document.querySelectorAll('#alphabet-nav button').forEach(btn => {
        btn.classList.remove('bg-accent', 'text-white');
        btn.classList.add('bg-gray-100', 'text-gray-700', 'dark:bg-darksection', 'dark:text-darktext');
    });

    const activeButton = document.querySelector(`[data-letter="${letter}"]`);
    if (activeButton) {
        activeButton.classList.remove('bg-gray-100', 'text-gray-700', 'dark:bg-darksection', 'dark:text-darktext');
        activeButton.classList.add('bg-accent', 'text-white');
    }

    // Don't reset category filter - allow multiple filters
    // Get current active category
    const activeCategoryButton = document.querySelector('#category-nav button.bg-accent');
    const activeCategory = activeCategoryButton ? activeCategoryButton.getAttribute('data-category') : 'all';

    // Filter terms
    let filteredTerms = Object.keys(glossaryData);

    if (letter !== 'all') {
        filteredTerms = filteredTerms.filter(term =>
            term.charAt(0).toUpperCase() === letter
        );
    }

    // Apply category filter if active
    if (activeCategory !== 'all') {
        filteredTerms = filteredTerms.filter(term => {
            const data = glossaryData[term];
            if (data.categories) {
                return data.categories.includes(activeCategory);
            } else if (data.category) {
                return data.category === activeCategory;
            }
            return false;
        });
    }

    if (currentSearch) {
        filteredTerms = filteredTerms.filter(term =>
            term.toLowerCase().includes(currentSearch) ||
            glossaryData[term].definition.toLowerCase().includes(currentSearch) ||
            glossaryData[term].category.toLowerCase().includes(currentSearch)
        );
    }

    renderTerms(filteredTerms);
    updateClearFiltersButton();
}

/**
 * Filter terms by category
 */
function filterByCategory(category) {
    const searchInput = document.getElementById('search-input');
    const currentSearch = searchInput.value.toLowerCase();

    // Update category navigation - reset all buttons to their default colors
    document.querySelectorAll('#category-nav button').forEach(btn => {
        const btnCategory = btn.getAttribute('data-category');
        if (btnCategory === 'all') {
            // Reset "All Categories" button to default state (not accent color)
            btn.className = 'px-3 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors dark:bg-darksection dark:text-darktext dark:hover:bg-darkbg';
        } else {
            const categoryColor = categoryColors[btnCategory] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
            btn.className = `px-3 py-2 rounded-lg font-medium transition-colors ${categoryColor}`;
        }
    });

    // Set the active button to accent color
    const activeButton = document.querySelector(`[data-category="${category}"]`);
    if (activeButton) {
        activeButton.className = 'px-3 py-2 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-colors';
    }

    // Don't reset letter filter - allow multiple filters
    // Get current active letter
    const activeLetterButton = document.querySelector('#alphabet-nav button.bg-accent');
    const activeLetter = activeLetterButton ? activeLetterButton.getAttribute('data-letter') : 'all';

    // Filter terms
    let filteredTerms = Object.keys(glossaryData);

    // Apply letter filter if active
    if (activeLetter !== 'all') {
        filteredTerms = filteredTerms.filter(term =>
            term.charAt(0).toUpperCase() === activeLetter
        );
    }

    if (category !== 'all') {
        filteredTerms = filteredTerms.filter(term => {
            const data = glossaryData[term];
            // Handle both old single category and new multiple categories format
            if (data.categories) {
                return data.categories.includes(category);
            } else if (data.category) {
                return data.category === category;
            }
            return false;
        });
    }

    if (currentSearch) {
        filteredTerms = filteredTerms.filter(term => {
            const data = glossaryData[term];
            const categories = data.categories || [data.category];
            return term.toLowerCase().includes(currentSearch) ||
                data.definition.toLowerCase().includes(currentSearch) ||
                categories.some(cat => cat.toLowerCase().includes(currentSearch));
        });
    }

    renderTerms(filteredTerms);
    updateClearFiltersButton();
}

/**
 * Clear all filters and reset to default state
 */
function clearAllFilters() {
    // Clear search input
    const searchInput = document.getElementById('search-input');
    searchInput.value = '';

    // Reset letter filter
    document.querySelectorAll('#alphabet-nav button').forEach(btn => {
        btn.classList.remove('bg-accent', 'text-white');
        btn.classList.add('bg-gray-100', 'text-gray-700', 'dark:bg-darksection', 'dark:text-darktext');
    });

    // Set "All" button as active
    const allLetterButton = document.querySelector('#alphabet-nav button[data-letter="all"]');
    if (allLetterButton) {
        allLetterButton.classList.remove('bg-gray-100', 'text-gray-700', 'dark:bg-darksection', 'dark:text-darktext');
        allLetterButton.classList.add('bg-accent', 'text-white');
    }

    // Reset category filter
    document.querySelectorAll('#category-nav button').forEach(btn => {
        const btnCategory = btn.getAttribute('data-category');
        if (btnCategory === 'all') {
            btn.className = 'px-3 py-2 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-colors';
        } else {
            const categoryColor = categoryColors[btnCategory] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
            btn.className = `px-3 py-2 rounded-lg font-medium transition-colors ${categoryColor}`;
        }
    });

    // Show all terms
    renderTerms(Object.keys(glossaryData));

    // Hide clear filters button
    updateClearFiltersButton();
}

/**
 * Update the clear filters button visibility
 */
function updateClearFiltersButton() {
    const clearBtn = document.getElementById('clear-filters-btn');
    const searchInput = document.getElementById('search-input');
    const activeLetterButton = document.querySelector('#alphabet-nav button.bg-accent');
    const activeCategoryButton = document.querySelector('#category-nav button.bg-accent');

    const hasSearch = searchInput.value.trim() !== '';
    const hasLetterFilter = activeLetterButton && activeLetterButton.getAttribute('data-letter') !== 'all';
    const hasCategoryFilter = activeCategoryButton && activeCategoryButton.getAttribute('data-category') !== 'all';

    if (hasSearch || hasLetterFilter || hasCategoryFilter) {
        clearBtn.classList.remove('opacity-50', 'pointer-events-none');
        clearBtn.classList.add('opacity-100');
    } else {
        clearBtn.classList.add('opacity-50', 'pointer-events-none');
        clearBtn.classList.remove('opacity-100');
    }
}

/**
 * Handle search functionality
 */
function handleSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const activeLetterButton = document.querySelector('#alphabet-nav button.bg-accent');
    const activeCategoryButton = document.querySelector('#category-nav button.bg-accent');
    const activeLetter = activeLetterButton ? activeLetterButton.getAttribute('data-letter') : 'all';
    const activeCategory = activeCategoryButton ? activeCategoryButton.getAttribute('data-category') : 'all';

    let filteredTerms = Object.keys(glossaryData);

    // Filter by letter
    if (activeLetter !== 'all') {
        filteredTerms = filteredTerms.filter(term =>
            term.charAt(0).toUpperCase() === activeLetter
        );
    }

    // Filter by category
    if (activeCategory !== 'all') {
        filteredTerms = filteredTerms.filter(term => {
            const data = glossaryData[term];
            // Handle both old single category and new multiple categories format
            if (data.categories) {
                return data.categories.includes(activeCategory);
            } else if (data.category) {
                return data.category === activeCategory;
            }
            return false;
        });
    }

    // Filter by search term
    if (searchTerm) {
        filteredTerms = filteredTerms.filter(term => {
            const data = glossaryData[term];
            const categories = data.categories || [data.category];
            return term.toLowerCase().includes(searchTerm) ||
                data.definition.toLowerCase().includes(searchTerm) ||
                categories.some(cat => cat.toLowerCase().includes(searchTerm));
        });
    }

    renderTerms(filteredTerms);
    updateClearFiltersButton();
}

// ============================================================================
// HAMBURGER MENU FUNCTIONALITY
// ============================================================================

/**
 * Initialize hamburger menu functionality
 */
function initializeHamburgerMenu() {
    const hamburgerBtn = document.getElementById('hamburger-menu-btn');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const menuDarkModeToggle = document.getElementById('menu-dark-mode-toggle');
    const backBtn = document.getElementById('back-btn');

    // Show hamburger button immediately
    if (hamburgerBtn) {
        hamburgerBtn.style.opacity = '1';
        hamburgerBtn.style.pointerEvents = 'auto';
    }

    // Back button is now static, no need to manipulate opacity

    // Open menu
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerMenu.classList.remove('opacity-0', 'pointer-events-none');
            hamburgerMenu.querySelector('div').classList.remove('translate-x-full');
        });
    }

    // Close menu
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', () => {
            hamburgerMenu.classList.add('opacity-0', 'pointer-events-none');
            hamburgerMenu.querySelector('div').classList.add('translate-x-full');
        });
    }

    // Close menu when clicking outside
    hamburgerMenu.addEventListener('click', (e) => {
        if (e.target === hamburgerMenu) {
            hamburgerMenu.classList.add('opacity-0', 'pointer-events-none');
            hamburgerMenu.querySelector('div').classList.add('translate-x-full');
        }
    });

    // Menu dark mode toggle
    if (menuDarkModeToggle) {
        menuDarkModeToggle.addEventListener('click', () => {
            toggleDarkMode();
            hamburgerMenu.classList.add('opacity-0', 'pointer-events-none');
            hamburgerMenu.querySelector('div').classList.add('translate-x-full');
        });
    }

    // Close menu when any menu link is clicked
    const menuLinks = hamburgerMenu?.querySelectorAll('a');
    if (menuLinks) {
        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Close menu first
                hamburgerMenu.classList.add('opacity-0', 'pointer-events-none');
                hamburgerMenu.querySelector('div').classList.add('translate-x-full');

                // For links to index.html, use replace for more reliable navigation
                if (link.href && link.href.includes('index.html')) {
                    e.preventDefault();
                    setTimeout(() => {
                        window.location.replace('index.html' + (link.hash || ''));
                    }, 100);
                }
            });
        });
    }

    // Back button functionality
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            // Use replace to avoid navigation issues and ensure clean loading
            window.location.replace('index.html');
        });
    }
}

// ============================================================================
// BACK TO TOP FUNCTIONALITY
// ============================================================================

/**
 * Initialize back to top button functionality
 */
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top-btn');

    if (!backToTopBtn) return;

    // Show/hide button based on scroll position with smooth fade
    function toggleBackToTopButton() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const threshold = 300;

        if (scrollTop > threshold) {
            // Smooth fade in
            backToTopBtn.classList.remove('pointer-events-none');
            // Small delay to ensure smooth transition
            setTimeout(() => {
                backToTopBtn.classList.remove('opacity-0');
            }, 50);
        } else {
            // Smooth fade out
            backToTopBtn.classList.add('opacity-0');
            // Wait for fade out to complete before disabling pointer events
            setTimeout(() => {
                if (backToTopBtn.classList.contains('opacity-0')) {
                    backToTopBtn.classList.add('pointer-events-none');
                }
            }, 500);
        }
    }

    // Scroll to top functionality
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add scroll event listener
    window.addEventListener('scroll', toggleBackToTopButton);
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

document.addEventListener('DOMContentLoaded', function () {
    // Load dark mode preference
    loadDarkModePreference();

    // Initialize glossary
    initGlossary();

    // Initialize hamburger menu
    initializeHamburgerMenu();

    // Initialize back to top button
    initializeBackToTop();

    // Add event listeners
    const searchInput = document.getElementById('search-input');

    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Clear filters button
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }

    // Progress bar update on scroll
    window.addEventListener('scroll', updateProgressBar);
}); 