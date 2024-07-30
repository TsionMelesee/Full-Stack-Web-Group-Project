async function fetchJobs(apiEndpoint) {
  try {
    const response = await fetch(apiEndpoint, {
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
    const jobListHTML = jobs.map(job => createJobCard(job)).join('');
    jobListContainer.innerHTML = jobListHTML;
  } else {
    jobListContainer.innerHTML = '<p>No jobs available.</p>';
  }
}
function createJobCard(job) {
  return `
    <div class="card">
      <h2>${job.title}</h2>
      <p>Description and contact: ${job.description}</p>
      <p>Salary: ${job.salary}</p>
    </div>
  `;
}
window.onload = () => fetchJobs('http://localhost:2001/jobs/forEmployees');
