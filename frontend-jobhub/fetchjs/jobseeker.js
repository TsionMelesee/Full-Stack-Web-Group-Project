async function fetchJobs() {
  try {
    const response = await fetch('http://localhost:2001/jobs/forJobSeekers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data.success) {
      displayJobs(data.jobs);
    } else {
      console.error('Error fetching jobs:', data.error);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}
function displayJobs(jobs) {
  const jobListContainer = document.getElementById('jobListContainer');
  if (jobs.length > 0) {
    const jobListHTML = jobs.map(job => `
      <div class="card">
        <h2>${job.title}</h2>
        <p>Description and contact: ${job.description}</p>
        <p>Salary: ${job.salary}</p>
        <p>Creator ID: ${job.createrId}</p>
        <p>User Type: ${job.userType}</p>
      </div>
    `).join('');
    jobListContainer.innerHTML = jobListHTML;
  } else {
    jobListContainer.innerHTML = '<p>No jobs available for employees.</p>';
  }
}
window.onload = fetchJobs;
