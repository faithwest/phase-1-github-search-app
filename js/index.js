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

//display users// Attach a click event listener to the results container to handle user clicks on user items
resultsContainer.addEventListener('click', async (e) => {
    if (e.target.tagName === 'A') {
      // Check if the clicked element is an anchor (link)
      e.preventDefault(); // Prevent the default link behavior
      const userURL = e.target.href; // Get the URL of the user's profile page
  
      try {
        // Create a URL for the user's repositories endpoint
        const userReposURL = `${userURL}/repos`;
        const response = await fetch(userReposURL, {
          headers: {
            Accept: 'application/vnd.github.v3+json', // Specify the GitHub API version
          },
        });
  
        if (!response.ok) {
          // If the response status is not okay, display an error message
          resultsContainer.innerHTML = `<p>Error: ${response.statusText}</p>`;
          return;
        }
  
        const repos = await response.json(); // Parse the response data as JSON
  
        if (repos.length === 0) {
          // If no repositories were found, display a message
          resultsContainer.innerHTML = '<p>No repositories found for this user.</p>';
        } else {
          // If repositories were found, create HTML for displaying repository information
          const repoListHTML = repos
            .map((repo) => {
              return `
                <div class="repo">
                  <p><a href="${repo.html_url}" target="_blank">${repo.name}</a></p>
                </div>
              `;
            })
            .join(''); // Join the HTML for each repository into a single string
  
          resultsContainer.innerHTML = repoListHTML; // Display the repository list on the page
        }
      } catch (error) {
        // Handle any errors that occurred during the fetch or processing of data
        resultsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
      }
    }
  });

  //fetching and displaying 
  function fetchUserRepositories(username) {
    // Use fetch to make a GET request to the User Repos Endpoint
    fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then(response => response.json())
    .then(data => {
        displayUserRepositories(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function displayUserRepositories(repositories) {
    userRepos.innerHTML = ''; // Clear previous results

    if (repositories.length === 0) {
        userRepos.innerHTML = '<p>No repositories found for this user.</p>';
        return;
    }

    repositories.forEach(repo => {
        const repoCard = document.createElement('div');
        repoCard.classList.add('repo-card');

        const repoName = document.createElement('p');
        repoName.textContent = repo.name;

        const repoLink = document.createElement('a');
        repoLink.href = repo.html_url;
        repoLink.textContent = 'View Repo';
        repoLink.target = '_blank';

        repoCard.appendChild(repoName);
        repoCard.appendChild(repoLink);

        userRepos.appendChild(repoCard);
    });
}
