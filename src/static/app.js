document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        // Participants section HTML
        let participantsHTML = '';
        if (details.participants && details.participants.length > 0) {
          participantsHTML = `
            <div class="participants-section" style="margin-top:1em;padding:0.8em 1em;background:#f7f9fa;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
              <strong style="color:#2d3a4b;font-size:1.05em;">Participants:</strong>
              <ul style="margin:0.5em 0 0 1.5em;color:#2b6cb0;font-size:1em;">
                ${details.participants.map(p => `<li style=\"margin-bottom:0.25em;list-style-type:disc;\"><span role=\"img\" aria-label=\"user\">👤</span> ${p}</li>`).join('')}
              </ul>
            </div>
          `;
        } else {
          participantsHTML = `
            <div class="participants-section" style="margin-top:1em;padding:0.8em 1em;background:#f7f9fa;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
              <strong style="color:#2d3a4b;font-size:1.05em;">Participants:</strong>
              <p style="color:#b0b7c3;font-style:italic;margin:0.5em 0 0 1.5em;">No participants yet.</p>
            </div>
          `;
        }

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
          ${participantsHTML}
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
