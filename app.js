const api_key = "RbaiQGQU5QmXMMwIbTusJaDonGEYaZHd";

// submit event listener on search form
$("#search-gif-form").on("submit", async (e) => {
  e.preventDefault();

  // access the input search value
  const searchTerm = getSearchInput();
  // make get request to API and destructure url
  const {
    images: {
      original: { url },
    },
    title,
  } = await fetchGif(searchTerm);
  console.log(url);
  // create image dom element
  const $imgEl = createImg(url, title);
  // append to DOM, specifically to the gif grid section
  appendToGrid($imgEl);
  // clear the search input
  clearInput();
});

// remove images event listener
$(".remove-btn").on("click", () => {
  $(".gif-grid").empty();
});

const getSearchInput = () => {
  return $("#search-gif").val();
};

const fetchGif = async (searchTerm) => {
  try {
    const gifResponse = await axios.get(
      "https://api.giphy.com/v1/gifs/search",
      {
        params: { api_key, q: searchTerm },
      }
    );
    const statusCode = gifResponse.data.meta.status;
    const responseLength = gifResponse.data.data.length;
    // check if statuscode not ok
    if (statusCode !== 200) {
      throw new Error(`Attempt to fetch gif unsuccessful! - ${statusCode}`);
    }
    // check if array is empty - no gifs found
    if (responseLength === 0) displayMessage("No gifs found! 😭");
    // return only the first meme from the array
    console.log(gifResponse.data.data[0]);
    return gifResponse.data.data[0];
  } catch (e) {
    console.log(e, e.message);
    displayMessage(e.message);
  }
};

const clearInput = () => {
  $("#search-gif").val("");
};

const createImg = (url, title) => {
  return $(`<img src="${url}" alt="${title}" class="gif-grid-img" />`);
};

const appendToGrid = (imgEl) => {
  $(".gif-grid").append(imgEl);
};
