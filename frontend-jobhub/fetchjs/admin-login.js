async function loginAdmin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
      if (username === 'admin' && password === '123abc') {
      window.location.href = 'admin-user-list.html';
    } else {
      document.getElementById('errorMessage').innerText = 'Invalid credentials. Please try again.';
    }
  }
  