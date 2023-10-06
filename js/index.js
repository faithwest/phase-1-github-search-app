// Define variables to store elements
const searchForm = document.getElementById('search-form'); // Get the search form element
const searchInput = document.getElementById('search-input'); // Get the search input element
const resultsContainer = document.getElementById('results-container'); // Get the container for displaying search results
const API_BASE_URL = 'https://api.github.com'; // Define the base URL for GitHub API

// Attach an event listener to the search form for handling user submission
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent the default form submission behavior
  const searchTerm = searchInput.value.trim(); // Get the user's search term from the input field

  if (searchTerm === '') {
    // If the search term is empty, display an error message
    resultsContainer.innerHTML = '<p>Please enter a search term.</p>';
  } else {
    try {
      // Create a URL for the user search endpoint with the search term
      const userSearchURL = `${API_BASE_URL}/search/users?q=${searchTerm}`;
      const response = await fetch(userSearchURL, {
        headers: {
          Accept: 'application/vnd.github.v3+json', // Specify the GitHub API version
        },
      });

      if (!response.ok) {
        // If the response status is not okay, display an error message
        resultsContainer.innerHTML = `<p>Error: ${response.statusText}</p>`;
        return;
      }

      const data = await response.json(); // Parse the response data as JSON
      const users = data.items; // Get the array of user objects from the response

      if (users.length === 0) {
        // If no users were found, display a message
        resultsContainer.innerHTML = '<p>No users found.</p>';
      } else {
        // If users were found, create HTML for displaying user information
        const userListHTML = users
          .map((user) => {
            return `
              <div class="user">
                <img src="${user.avatar_url}" alt="${user.login}" />
                <p><a href="${user.html_url}" target="_blank">${user.login}</a></p>
              </div>
            `;
          })
          .join(''); // Join the HTML for each user into a single string

        resultsContainer.innerHTML = userListHTML; // Display the user list on the page
      }
    } catch (error) {
      // Handle any errors that occurred during the fetch or processing of data
      resultsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  }
});
