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
  userId = localStorage.getItem('userId'); 
  console.log('User information from localStorage:', { userToken, userId });
   if (!userToken || !userId) {
    } else {
    console.log('User information is available. Proceeding with the API call.');
          }
    });
  document.addEventListener('DOMContentLoaded', function () {
    const userToken = localStorage.getItem('userToken');
    const userId = localStorage.getItem('userId');
    console.log('User information from localStorage:', { userToken, userId });
      if (!userToken || !userId) {
      console.error('UserToken or UserId not available');
      displayErrorMessage('User information not available. Redirecting to login.');
      setTimeout(function() {
        window.location.href = 'login.html';
      }, 3000);        } else {
      console.log('User information is available. Proceeding with the API call.');
        fetch(`http://localhost:2001/users/${userId}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      })
        .then(response => {
          console.log('Response status:', response.status);
            if (!response.ok) {
            return response.json().then(errorData => {
              throw new Error(errorData.message || 'Failed to fetch user profile');
            });
          }
            return response.json();
        })
        .then(profileData => {
          displayUserProfile(profileData);
          setupUpdateButtons(profileData);
        })
        .catch(error => {
          console.error('Error fetching user profile:', error);
          displayErrorMessage(`Failed to fetch user profile. Error: ${error.message}`);
        });
    }
  });
    function displayUserProfile(profileData) {
    const profileInfo = document.getElementById('profileInfo');
    profileInfo.innerHTML = `
        <div class="card mb-4">
            <div class="card-body">
                <h5 class="card-title">User Information</h5>
                <p class="card-text">ID: ${profileData.id}</p>
                <p class="card-text">Username: ${profileData.username}</p>
                <p class="card-text">Email: ${profileData.email}</p>
            </div>
        </div>
    `;
}
  const displayUserJobsBtn = document.getElementById('displayUserJobsBtn');
  displayUserJobsBtn.addEventListener('click', function () {
  fetchUserJobs(userId, userToken); 
});
    function setupUpdateButtons(profileData) {
    const updateUsernameBtn = document.getElementById('updateUsernameBtn');
    const updateEmailBtn = document.getElementById('updateEmailBtn');
    const usernameField = document.getElementById('usernameField');
    const emailField = document.getElementById('emailField');
      updateUsernameBtn.addEventListener('click', function () {
      const newUsername = prompt('Enter new username:');
      if (newUsername !== null) {
        updateUsernameOnBackend(newUsername)
          .then(updatedUsername => {
           usernameField.textContent = updatedUsername;
          })
          .catch(error => {
            console.error('Error updating username:', error);
          });
      }
    });
      updateEmailBtn.addEventListener('click', function () {
      const newEmail = prompt('Enter new email:');
      if (newEmail !== null) {
        updateEmailOnBackend(newEmail)
          .then(updatedEmail => {
            emailField.textContent = updatedEmail;
          })
          .catch(error => {
            console.error('Error updating email:', error);
          });
      }
    });
  }
   function updateUsernameOnBackend(username) {
  const userId = localStorage.getItem('userId');
  const userToken = localStorage.getItem('userToken');
   return fetch(`http://localhost:2001/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`,
    },
    body: JSON.stringify({ username }), 
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update username on the backend');
      }
      return response.json();
    })
    .then(updatedUserData => {

      return updatedUserData.username;
    });
}
function updateEmailOnBackend(email) {
  const userId = localStorage.getItem('userId');
  const userToken = localStorage.getItem('userToken');
    return fetch(`http://localhost:2001/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`,
    },
    body: JSON.stringify({ email }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update email on the backend');
      }
      return response.json();
    })
    .then(updatedUserData => {
      return updatedUserData.email;
    });
}
function updateUsernameOnBackend(username) {
  const userId = localStorage.getItem('userId');
  const userToken = localStorage.getItem('userToken');
  return fetch(`http://localhost:2001/users/${userId}`, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify({ username }),
  })
      .then(response => {
          if (!response.ok) {
              throw new Error('Failed to update username on the backend');
          }
          return response.json();
      })
      .then(updatedUserData => {
          displayUserProfile(updatedUserData); 
          return updatedUserData.username;
      });
}
function updateEmailOnBackend(email) {
  const userId = localStorage.getItem('userId');
  const userToken = localStorage.getItem('userToken');
  return fetch(`http://localhost:2001/users/${userId}`, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify({ email }),
  })
      .then(response => {
          if (!response.ok) {
              throw new Error('Failed to update email on the backend');
          }
          return response.json();
      })
      .then(updatedUserData => {
          displayUserProfile(updatedUserData); 
          return updatedUserData.email;
      });
}
function fetchUserJobs(userId, userToken) {
fetch(`http://localhost:2001/jobs/user-jobs/${userId}`, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${userToken}`,
    },
})
    .then(response => {
        console.log('Response status for user jobs:', response.status);

        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message || 'Failed to fetch user jobs');
            });
        }

        return response.json();
    })
    .then(userJobsData => {
        displayUserJobs(userJobsData.jobs);
    })
    .catch(error => {
        console.error('Error fetching user jobs:', error);
        displayErrorMessage(`Failed to fetch user jobs. Error: ${error.message}`);
    });
}
function displayUserJobs(userJobs) {
const userJobsContainer = document.getElementById('userJobs');
if (userJobs.length > 0) {
    const jobsList = userJobs.map(job => `
        <li>
            ${job.title}: ${job.description}
            <button onclick="deleteJob('${job.id}')" class="btn btn-danger">Delete Job</button>
            
        </li>`
    ).join('');
    userJobsContainer.innerHTML = `<h2>User Jobs:</h2><ul>${jobsList}</ul>`;
} else {
    userJobsContainer.innerHTML = '<p>No jobs found for this user.</p>';
}
}
function deleteJob(jobId) {
const userId = localStorage.getItem('userId');
const userToken = localStorage.getItem('userToken');
fetch(`http://localhost:2001/jobs/${jobId}`, {
    method: 'DELETE',
    headers: {
        'Authorization': `Bearer ${userToken}`,
    },
})
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete job');
        }
        fetchUserJobs(userId, userToken);
    })
    .catch(error => {
        console.error('Error deleting job:', error);
        displayErrorMessage(`Error deleting job. ${error.message}`);
    });
}
function updateJob(jobId) {
const userId = localStorage.getItem('userId');
const userToken = localStorage.getItem('userToken');
fetch(`http://localhost:2001/jobs/${jobId}`, {
  method: 'GET',
  headers: {
      'Authorization': `Bearer ${userToken}`,
  },
})
  .then(response => {
      if (!response.ok) {
          throw new Error('Failed to fetch job details for update');
      }
      return response.json();
  })
  .then(jobDetails => {
      const updatedTitle = prompt('Enter updated title:', jobDetails.title);
      const updatedDescription = prompt('Enter updated description:', jobDetails.description);
      if (updatedTitle === null || updatedDescription === null) {
          console.log('Update canceled by user');
          return;
      }
      const updatedJobData = {
          title: updatedTitle,
          description: updatedDescription,
      };
      return fetch(`http://localhost:2001/jobs/${jobId}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userToken}`,
          },
          body: JSON.stringify(updatedJobData),
      });
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Failed to update job on the server');
      }
      fetchUserJobs(userId, userToken);
  })
  .catch(error => {
      console.error('Error updating job:', error);
      displayErrorMessage(`Error updating job. ${error.message}`);
  });
}
document.addEventListener('DOMContentLoaded', function () {
const userToken = localStorage.getItem('userToken');
const userId = localStorage.getItem('userId'); 
console.log('User information from localStorage:', { userToken, userId });
if (!userToken || !userId) {
} else {
  console.log('User information is available. Proceeding with the API call.');
  const displayUserJobsBtn = document.getElementById('displayUserJobsBtn');
  if (displayUserJobsBtn) {
      displayUserJobsBtn.addEventListener('click', function () {
          fetchUserJobs(userId, userToken);
      });
  } else {
      console.error('Button with ID "displayUserJobsBtn" not found.');
  }
}
});

document.addEventListener('DOMContentLoaded', function () {
  const displayUserJobsBtn = document.getElementById('displayUserJobsBtn');
  const userJobsCard = document.getElementById('userJobsCard');
  if (displayUserJobsBtn && userJobsCard) {
    displayUserJobsBtn.addEventListener('click', function () {
      userJobsCard.style.display = 'block';
      fetchUserJobs(userId, userToken);
    });
  } else {
    console.error('Button with ID "displayUserJobsBtn" or "userJobsCard" not found.');
  }
});
