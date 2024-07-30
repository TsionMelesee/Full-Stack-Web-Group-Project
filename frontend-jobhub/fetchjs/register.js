function registerUser() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  if (username.trim().length < 5 || username.trim().length > 10) {
    displayMessage('error', 'Username must be between 5 and 10 characters.');
    return;
  }
  if (password.trim().length < 5 || password.trim().length > 12) {
    displayMessage('error', 'Password must be between 5 and 12 characters.');
    return;
  }
  const email = document.getElementById('email').value;
  const registrationData = {
    username,
    password,
    email,
  };
  fetch('http://localhost:2001/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registrationData),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      return response.json();
    })
    .then(data => {
      displayMessage('success', 'Registration successful: ' + data.token);
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    })
    .catch(error => {
      displayMessage('error', 'Registration failed: ' + error.message);
    });
}
function displayMessage(type, message) {
  const responseMessage = document.getElementById('responseMessage');
  responseMessage.innerHTML = `<p class="${type}-message">${message}</p>`;
}
