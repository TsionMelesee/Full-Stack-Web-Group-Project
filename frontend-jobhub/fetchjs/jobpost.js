document.addEventListener('DOMContentLoaded', function () {
  const createJobBtn = document.getElementById('createJobBtn');
  const successMessage = document.getElementById('successMessage');
  createJobBtn.addEventListener('click', function () {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const salary = parseInt(document.getElementById('salary').value, 10);
    const createrId = localStorage.getItem('userId'); 
    const userType = document.getElementById('userType').value;
    const createJobDto = {
      title,
      description,
      salary,
      createrId,
      userType,
    };
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      window.location.href = 'login.html';
      return;
    }
    fetch('http://localhost:2001/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify(createJobDto),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to create job');
        }
        return response.json();
      })
      .then(createdJob => {
        console.log('Job created successfully:', createdJob);
        successMessage.classList.remove('d-none'); 
      })
      .catch(error => {
        console.error('Error creating job:', error);
      });
  });
});
