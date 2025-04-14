const apiKey = process.env.NEWS_API_KEY;
const newsContainer = document.getElementById("news");
const loader = document.getElementById("loader");
const categorySelect = document.getElementById("category");
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageNumberDisplay = document.getElementById("pageNumber");

const baseUrl = `https://newsapi.org/v2/top-headlines?country=us`;

let currentPage = 1;
const pageSize = 5;
let totalResults = 0;

async function fetchNews(category = "", keyword = "", page = 1) {
  try {
    loader.style.display = "block";
    newsContainer.innerHTML = "";

    let url = `${baseUrl}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;
    if (category) url += `&category=${category}`;
    if (keyword) url += `&q=${encodeURIComponent(keyword)}`;

    const response = await fetch(url);
    const data = await response.json();
    totalResults = data.totalResults;
    displayNews(data.articles);
    updatePaginationButtons();
  } catch (error) {
    console.error("Fetch error:", error);
    newsContainer.innerHTML = "<p>Failed to load news. Try again later.</p>";
  } finally {
    loader.style.display = "none";
  }
}

function displayNews(articles) {
  newsContainer.innerHTML = "";

  if (!articles.length) {
    newsContainer.innerHTML = "<p>No news found.</p>";
    return;
  }

  for (const article of articles) {
    const articleDiv = document.createElement("div");
    articleDiv.classList.add("article");

    const title = document.createElement("h4");
    title.textContent = article.title;
    articleDiv.appendChild(title);

    if (article.urlToImage) {
      const image = document.createElement("img");
      image.src = article.urlToImage;
      image.alt = article.title;
      image.style.maxWidth = "100%";
      articleDiv.appendChild(image);
    }

    if (article.description) {
      const description = document.createElement("p");
      description.textContent = article.description;
      articleDiv.appendChild(description);
    }

    const link = document.createElement("a");
    link.href = article.url;
    link.target = "_blank";
    link.textContent = "Read more";
    articleDiv.appendChild(link);

    newsContainer.appendChild(articleDiv);
  }

  pageNumberDisplay.textContent = `Page ${currentPage}`;
}

function updatePaginationButtons() {
  prevBtn.disabled = currentPage === 1;
  const totalPages = Math.ceil(totalResults / pageSize);
  nextBtn.style.display = currentPage < totalPages ? "inline" : "none";
}

// Event listeners
categorySelect.addEventListener("change", () => {
  currentPage = 1;
  fetchNews(categorySelect.value, searchInput.value, currentPage);
});

searchBtn.addEventListener("click", () => {
  currentPage = 1;
  fetchNews(categorySelect.value, searchInput.value, currentPage);
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchNews(categorySelect.value, searchInput.value, currentPage);
  }
});

nextBtn.addEventListener("click", () => {
  currentPage++;
  fetchNews(categorySelect.value, searchInput.value, currentPage);
});

// Load on start
fetchNews();
