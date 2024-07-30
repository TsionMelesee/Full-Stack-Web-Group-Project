function displayErrorMessage(message) {
  const errorContainer = document.getElementById('errorContainer');
  if (errorContainer) {
    errorContainer.innerHTML = `<p style="color: red;">Error: ${message}</p>`;
  } else {
    console.error(`Error: ${message}`);
  }
}
document.addEventListener('DOMContentLoaded', function () {
  const userToken = localStorage.getItem('userToken');
  const userId = localStorage.getItem('userId');
  if (!userToken || !userId) {
    console.error('UserToken or UserId not available');
    displayErrorMessage('User information not available. Redirecting to login.');
    setTimeout(function() {
      window.location.href = 'login.html';
    }, 3000);
  } else {
    console.log('User information is available. Proceeding with the API call.');
    fetch(`http://localhost:2001/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
    })
    .then(response => {
      console.log('Response status:', response.status);
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(errorData.message || 'Failed to fetch user profiles');
        });
      }
      return response.json();
    })
    .then(users => {
      const userProfilesContainer = document.getElementById('userProfiles');
      users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'card mb-4';
        userCard.innerHTML = `
          <div class="card-body">
            <h5 class="card-title">User Information</h5>
            <p class="card-text">ID: ${user.id}</p>
            <p class="card-text">Username: ${user.username}</p>
            <p class="card-text">Email: ${user.email}</p>
            <button onclick="deleteUser(${user.id})" class="btn btn-danger">Delete</button>
          </div>
        `;
        userProfilesContainer.appendChild(userCard);
      });
    })
    .catch(error => {
      console.error('Error fetching user profiles:', error);
      displayErrorMessage(`Failed to fetch user profiles. Error: ${error.message}`);
    });
  }
});
function deleteUser(userId) {
  const userToken = localStorage.getItem('userToken');
  fetch(`http://localhost:2001/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${userToken}`,
    },
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(errorData => {
        throw new Error(errorData.message || 'Failed to delete user');
      });
    }
    console.log(`User with ID ${userId} deleted successfully`);
  })
  .catch(error => {
    console.error('Error deleting user:', error);
    displayErrorMessage(`Failed to delete user. Error: ${error.message}`);
  });
}
