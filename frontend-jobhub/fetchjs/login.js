function validateUsername(username) {
    return username.length >= 5 && username.length <= 10;
  }
  function validatePassword(password) {
    return password.length >= 5 && password.length <= 12;
  }
  function loginUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (!validateUsername(username)) {
      document.getElementById('errorMessage').innerHTML = '<p class="error-message">Username should be between 5 and 10 characters long.</p>';
      return;
    }
    if (!validatePassword(password)) {
      document.getElementById('errorMessage').innerHTML = '<p class="error-message">Password should be between 5 and 12 characters long.</p>';
      return;
    }
    const loginData = {
      username,
      password,
    };
    fetch('http://localhost:2001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Invalid credentials');
        }
        return response.json();
      })
      .then(data => {
        console.log('Response data:', data);

        if (!data.userId || typeof data.userId !== 'string') {
          throw new Error('User ID not found or invalid in the response');
        }
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userId', data.userId);
        console.log('Stored userToken:', localStorage.getItem('userToken'));
        console.log('Stored userId:', localStorage.getItem('userId'));
        window.location.href = 'dashboard.html';
      })
      .catch(error => {
        console.error('Login failed:', error.message);
        document.getElementById('errorMessage').innerHTML = `<p class="error-message">${error.message}</p>`;
      });
  }