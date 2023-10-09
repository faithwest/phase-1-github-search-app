// Step 1: Form Submission
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const userList = document.getElementById('userList');
const repoList = document.getElementById('repoList');

// Listen for form submission
searchForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();

    if (searchTerm === '') {
        alert('Please enter a username.');
        return;
    }

    // Step 3: Call a function to search for users and display them
    await searchUsers(searchTerm);
});
// Step 3: Search Users and Display
async function searchUsers(username) {
  try {
      // Make a GET request to GitHub API with the username
      const response = await fetch(`https://api.github.com/search/users?q=${username}`, {
          headers: {
              'Accept': 'application/vnd.github.v3+json'
          }
      });

      if (!response.ok) {
          throw new Error('GitHub API request failed');
      }

      const data = await response.json();

      // Clear previous user list
      userList.innerHTML = '';

      // Loop through the user data and display user cards
      data.items.forEach(user => {
          const userCard = document.createElement('div');
          userCard.classList.add('user-card');

          // Display user information: username, avatar, and link to profile
          userCard.innerHTML = `
              <img src="${user.avatar_url}" alt="${user.login}">
              <h3>${user.login}</h3>
              <a href="${user.html_url}" target="_blank">View Profile</a>
          `;

          userList.appendChild(userCard);

          // Step 4: Add a click event listener to each user card
          userCard.addEventListener('click', () => {
              // Step 4: Call a function to fetch and display user repositories
              getUserRepos(user.login);
          });
      });
  } catch (error) {
      console.error(error);
  }
}
// Step 4: Fetch and Display User Repositories
async function getUserRepos(username) {
  try {
      // Make a GET request to fetch user repositories
      const response = await fetch(`https://api.github.com/users/${username}/repos`, {
          headers: {
              'Accept': 'application/vnd.github.v3+json'
          }
      });

      if (!response.ok) {
          throw new Error('GitHub API request failed');
      }

      const data = await response.json();

      // Clear previous repo list
      repoList.innerHTML = '';

      // Loop through the user's repositories and display them
      data.forEach(repo => {
          const repoItem = document.createElement('div');
          repoItem.classList.add('repo-item');

          // Display repository information: name, description, and link
          repoItem.innerHTML = `
              <h3>${repo.name}</h3>
              <p>${repo.description || 'No description available'}</p>
              <a href="${repo.html_url}" target="_blank">Visit Repo</a>
          `;

          repoList.appendChild(repoItem);
      });
  } catch (error) {
      console.error(error);
  }
}
