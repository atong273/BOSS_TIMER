// In your main script

// Function to show notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Initialize the table
window.onload = function() {
    // Load data from localStorage or initialize with defaults
    const loadResult = loadFromLocalStorage();
    
    // Show notification if there's a message
    if (loadResult.message) {
        showNotification(loadResult.message);
    }
    
    // Update respawn times - this ensures time remaining is calculated on page load
    updateRespawnTimes();
    
    // Update time every minute
    setInterval(updateRespawnTimes, 60000);
};

// In your editRow function, update the saveChanges function:
const saveChanges = () => {
    const newDateValue = dateInput.value;
    const newTimeValue = timeInput.value;
    const newCooldownValue = cooldownInput.value;
    
    // Validate inputs
    if (!newDateValue || !newTimeValue) {
        alert('Please enter valid date and time');
        return;
    }
    
    if (!newCooldownValue || parseInt(newCooldownValue) <= 0 || parseInt(newCooldownValue) > 168) {
        alert('Please enter a valid cooldown between 1 and 168 hours');
        return;
    }
    
    // Update data attributes
    const newDeathTime = `${newDateValue}T${newTimeValue}`;
    row.dataset.deathTime = newDeathTime;
    row.dataset.cooldown = newCooldownValue;
    
    // Update display values
    dateCell.textContent = newDateValue;
    timeCell.textContent = newTimeValue;
    cooldownCell.textContent = `${newCooldownValue}h`;
    
    // Restore action cell
    actionCell.innerHTML = originalActionContent;
    
    // Save to localStorage and update respawn times
    const message = saveToLocalStorage();
    showNotification(message);
    updateRespawnTimes();
};

// In your editFixedBoss function, update the saveChanges function:
const saveChanges = () => {
    const newSchedule = scheduleInput.value.trim();
    
    // Validate input
    if (!newSchedule) {
        alert('Please enter a valid schedule');
        return;
    }
    
    // Update data attribute
    row.dataset.fixedSchedule = newSchedule;
    
    // Update display value
    scheduleCell.textContent = newSchedule;
    
    // Restore action cell
    actionCell.innerHTML = originalActionContent;
    
    // Save to localStorage and update respawn times
    const message = saveToLocalStorage();
    showNotification(message);
    updateRespawnTimes();
};
