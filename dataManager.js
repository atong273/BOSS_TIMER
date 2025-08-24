// Boss Respawn Data Manager
class BossDataManager {
    constructor() {
        this.defaultDeathTimes = {
            'venatus': '2023-05-15T10:00',
            'viorent': '2023-05-15T10:00',
            'ego': '2023-05-15T21:00',
            'livera': '2023-05-15T00:00',
            'araneo': '2023-05-15T00:00',
            'undomiel': '2023-05-15T00:00',
            'lady-dalia': '2023-05-15T18:00',
            'general-aquleus': '2023-05-15T05:00',
            'amentis': '2023-05-15T05:00',
            'baron-braudmore': '2023-05-15T05:00'
        };
        
        this.defaultCooldowns = {
            'venatus': '10',
            'viorent': '10',
            'ego': '21',
            'livera': '24',
            'araneo': '24',
            'undomiel': '24',
            'lady-dalia': '18',
            'general-aquleus': '29',
            'amentis': '29',
            'baron-braudmore': '32'
        };
        
        this.fixedSchedules = {
            'clemantis': 'Mon 11:30 / Thurs 19:00',
            'saphirus': 'Sun 17:00 / Tues 11:30',
            'neutro': 'Tues 19:00 / Thurs 11:30',
            'thymele': 'Mon 19:00 / Wed 11:30',
            'milavy': 'Sat 15:00'
        };
    }
    
    // Initialize with default data
    initializeDefaults() {
        // Set default death times and cooldowns for regular bosses
        const rows = document.querySelectorAll('#bossTable tbody tr');
        rows.forEach(row => {
            const bossId = row.dataset.bossId;
            if (bossId && this.defaultDeathTimes[bossId] && this.defaultCooldowns[bossId]) {
                row.dataset.deathTime = this.defaultDeathTimes[bossId];
                row.dataset.cooldown = this.defaultCooldowns[bossId];
                
                // Update display values
                this.updateDisplayValues(row, 'regular');
            }
        });
        
        // Set default schedules for fixed bosses
        const fixedRows = document.querySelectorAll('#fixedBossTable tbody tr');
        fixedRows.forEach(row => {
            const bossId = row.dataset.bossId;
            if (bossId && this.fixedSchedules[bossId]) {
                row.dataset.fixedSchedule = this.fixedSchedules[bossId];
                
                // Update display values
                this.updateDisplayValues(row, 'fixed');
            }
        });
    }
    
    // Update display values for a row
    updateDisplayValues(row, type) {
        if (type === 'regular') {
            const deathTime = new Date(row.dataset.deathTime);
            const dateCell = row.querySelector('.date-cell');
            const timeCell = row.querySelector('.time-cell');
            const cooldownCell = row.querySelector('.cooldown-cell');
            
            if (dateCell) {
                const year = deathTime.getFullYear();
                const month = String(deathTime.getMonth() + 1).padStart(2, '0');
                const day = String(deathTime.getDate()).padStart(2, '0');
                dateCell.textContent = `${year}-${month}-${day}`;
            }
            
            if (timeCell) {
                const hours = String(deathTime.getHours()).padStart(2, '0');
                const minutes = String(deathTime.getMinutes()).padStart(2, '0');
                timeCell.textContent = `${hours}:${minutes}`;
            }
            
            if (cooldownCell) {
                cooldownCell.textContent = `${row.dataset.cooldown}h`;
            }
        } else if (type === 'fixed') {
            const scheduleCell = row.querySelector('.schedule-cell');
            if (scheduleCell) {
                scheduleCell.textContent = row.dataset.fixedSchedule;
            }
        }
    }
    
    // Save data to localStorage (temporary storage during session)
    saveToLocalStorage() {
        const data = {
            regularBosses: {},
            fixedBosses: {}
        };
        
        // Collect regular boss data
        const rows = document.querySelectorAll('#bossTable tbody tr');
        rows.forEach(row => {
            const bossId = row.dataset.bossId;
            const deathTime = row.dataset.deathTime;
            const cooldown = row.dataset.cooldown;
            
            if (bossId && deathTime && cooldown) {
                data.regularBosses[bossId] = {
                    deathTime: deathTime,
                    cooldown: cooldown
                };
            }
        });
        
        // Collect fixed boss data
        const fixedRows = document.querySelectorAll('#fixedBossTable tbody tr');
        fixedRows.forEach(row => {
            const bossId = row.dataset.bossId;
            const schedule = row.dataset.fixedSchedule;
            
            if (bossId && schedule) {
                data.fixedBosses[bossId] = {
                    schedule: schedule
                };
            }
        });
        
        localStorage.setItem('bossRespawnData_temp', JSON.stringify(data));
        return data;
    }
    
    // Load data from localStorage (temporary)
    loadFromLocalStorage() {
        const savedData = localStorage.getItem('bossRespawnData_temp');
        const hasSavedData = savedData !== null;
        
        if (savedData) {
            const data = JSON.parse(savedData);
            
            // Load regular boss data
            Object.keys(data.regularBosses).forEach(bossId => {
                const row = document.querySelector(`#bossTable tr[data-boss-id="${bossId}"]`);
                if (row && data.regularBosses[bossId]) {
                    const bossData = data.regularBosses[bossId];
                    row.dataset.deathTime = bossData.deathTime;
                    row.dataset.cooldown = bossData.cooldown;
                    
                    // Update display values
                    this.updateDisplayValues(row, 'regular');
                }
            });
            
            // Load fixed boss data
            Object.keys(data.fixedBosses).forEach(bossId => {
                const row = document.querySelector(`#fixedBossTable tr[data-boss-id="${bossId}"]`);
                if (row && data.fixedBosses[bossId]) {
                    const bossData = data.fixedBosses[bossId];
                    row.dataset.fixedSchedule = bossData.schedule;
                    
                    // Update display values
                    this.updateDisplayValues(row, 'fixed');
                }
            });
            
            return data;
        }
        
        return hasSavedData;
    }
    
    // Export data to JSON file
    exportData() {
        const data = {
            regularBosses: {},
            fixedBosses: {}
        };
        
        // Collect regular boss data
        const rows = document.querySelectorAll('#bossTable tbody tr');
        rows.forEach(row => {
            const bossId = row.dataset.bossId;
            const deathTime = row.dataset.deathTime;
            const cooldown = row.dataset.cooldown;
            
            if (bossId && deathTime && cooldown) {
                data.regularBosses[bossId] = {
                    deathTime: deathTime,
                    cooldown: cooldown
                };
            }
        });
        
        // Collect fixed boss data
        const fixedRows = document.querySelectorAll('#fixedBossTable tbody tr');
        fixedRows.forEach(row => {
            const bossId = row.dataset.bossId;
            const schedule = row.dataset.fixedSchedule;
            
            if (bossId && schedule) {
                data.fixedBosses[bossId] = {
                    schedule: schedule
                };
            }
        });
        
        // Create and download the file
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `boss_respawn_data_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        return data;
    }
    
    // Import data from JSON file
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Validate data structure
                    if (!data.regularBosses || !data.fixedBosses) {
                        throw new Error('Invalid data format');
                    }
                    
                    // Load regular boss data
                    Object.keys(data.regularBosses).forEach(bossId => {
                        const row = document.querySelector(`#bossTable tr[data-boss-id="${bossId}"]`);
                        if (row && data.regularBosses[bossId]) {
                            const bossData = data.regularBosses[bossId];
                            row.dataset.deathTime = bossData.deathTime;
                            row.dataset.cooldown = bossData.cooldown;
                            
                            // Update display values
                            this.updateDisplayValues(row, 'regular');
                        }
                    });
                    
                    // Load fixed boss data
                    Object.keys(data.fixedBosses).forEach(bossId => {
                        const row = document.querySelector(`#fixedBossTable tr[data-boss-id="${bossId}"]`);
                        if (row && data.fixedBosses[bossId]) {
                            const bossData = data.fixedBosses[bossId];
                            row.dataset.fixedSchedule = bossData.schedule;
                            
                            // Update display values
                            this.updateDisplayValues(row, 'fixed');
                        }
                    });
                    
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }
    
    // Calculate respawn time and time remaining
    calculateRespawn(deathTimeStr, cooldownHours) {
        // Parse death time from ISO format
        const deathDateTime = new Date(deathTimeStr);
        
        if (isNaN(deathDateTime.getTime())) {
            return {
                respawnDateTime: null,
                respawnDate: 'Invalid Date',
                respawnTime: 'Invalid Time',
                timeRemaining: 'Invalid Input',
                timeRemainingMs: Infinity
            };
        }
        
        // Calculate respawn time
        const respawnDateTime = new Date(deathDateTime);
        respawnDateTime.setHours(respawnDateTime.getHours() + parseInt(cooldownHours));
        
        // Calculate time remaining
        const now = new Date();
        const timeRemainingMs = respawnDateTime - now;
        const timeRemainingHours = Math.floor(timeRemainingMs / (1000 * 60 * 60));
        const timeRemainingMinutes = Math.floor((timeRemainingMs % (1000 * 60 * 60)) / (1000 * 60));
        
        // Format respawn time
        const respawnDate = respawnDateTime.toLocaleDateString();
        const respawnTime = respawnDateTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        // Format time remaining
        let timeRemainingStr = '';
        if (timeRemainingMs > 0) {
            timeRemainingStr = `${timeRemainingHours}h ${timeRemainingMinutes}m left`;
        } else {
            timeRemainingStr = 'Ready to respawn';
        }
        
        return {
            respawnDateTime,
            respawnDate,
            respawnTime,
            timeRemaining: timeRemainingStr,
            timeRemainingMs
        };
    }
    
    // Calculate next fixed boss spawn
    calculateNextFixedSpawn(scheduleStr) {
        // Parse schedule string (e.g., "Mon 11:30 / Thurs 19:00" or "Sat 15:00")
        const scheduleParts = scheduleStr.split('/');
        const now = new Date();
        let nextSpawn = null;
        let minTimeRemaining = Infinity;
        
        // Day mapping
        const dayMap = {
            'Sun': 0,
            'Mon': 1,
            'Tues': 2,
            'Wed': 3,
            'Thurs': 4,
            'Fri': 5,
            'Sat': 6
        };
        
        // Check each schedule part
        scheduleParts.forEach(part => {
            const trimmedPart = part.trim();
            const dayTimeMatch = trimmedPart.match(/^(\w+)\s+(\d{1,2}):(\d{2})$/);
            
            if (dayTimeMatch) {
                const dayName = dayTimeMatch[1];
                const hours = parseInt(dayTimeMatch[2]);
                const minutes = parseInt(dayTimeMatch[3]);
                
                const dayOfWeek = dayMap[dayName];
                if (dayOfWeek !== undefined) {
                    // Create a date for this week's spawn
                    const spawnDate = new Date(now);
                    spawnDate.setDate(now.getDate() + (dayOfWeek + 7 - now.getDay()) % 7);
                    spawnDate.setHours(hours, minutes, 0, 0);
                    
                    // If this spawn time has already passed this week, add 7 days
                    if (spawnDate <= now) {
                        spawnDate.setDate(spawnDate.getDate() + 7);
                    }
                    
                    // Calculate time remaining
                    const timeRemainingMs = spawnDate - now;
                    
                    // If this is the next spawn, remember it
                    if (timeRemainingMs < minTimeRemaining && timeRemainingMs > 0) {
                        minTimeRemaining = timeRemainingMs;
                        nextSpawn = {
                            spawnDateTime: spawnDate,
                            timeRemainingMs: timeRemainingMs
                        };
                    }
                }
            }
        });
        
        // If no valid spawn time found, return default
        if (!nextSpawn) {
            return {
                spawnDateTime: null,
                spawnTime: 'Invalid schedule',
                timeRemaining: 'Invalid schedule',
                timeRemainingMs: Infinity
            };
        }
        
        // Format spawn time
        const spawnTime = nextSpawn.spawnDateTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const spawnDay = nextSpawn.spawnDateTime.toLocaleDateString();
        
        // Format time remaining
        const timeRemainingHours = Math.floor(nextSpawn.timeRemainingMs / (1000 * 60 * 60));
        const timeRemainingMinutes = Math.floor((nextSpawn.timeRemainingMs % (1000 * 60 * 60)) / (1000 * 60));
        
        let timeRemainingStr = '';
        if (nextSpawn.timeRemainingMs > 0) {
            timeRemainingStr = `${timeRemainingHours}h ${timeRemainingMinutes}m left`;
        } else {
            timeRemainingStr = 'Ready to respawn';
        }
        
        return {
            spawnDateTime: nextSpawn.spawnDateTime,
            spawnTime: `${spawnTime} (${spawnDay})`,
            timeRemaining: timeRemainingStr,
            timeRemainingMs: nextSpawn.timeRemainingMs
        };
    }
    
    // Update respawn times and highlight next boss
    updateRespawnTimes() {
        let nextRespawnRow = null;
        let nextFixedBossRow = null;
        let minTimeRemaining = Infinity;
        let minFixedTimeRemaining = Infinity;
        
        // Update regular bosses
        const rows = document.querySelectorAll('#bossTable tbody tr');
        rows.forEach(row => {
            const respawnCell = row.querySelector('.respawn-cell');
            const timeLeftCell = row.querySelector('.time-left-cell');
            const deathTime = row.dataset.deathTime;
            const cooldown = row.dataset.cooldown;
            
            const respawnData = this.calculateRespawn(deathTime, cooldown);
            
            // Update respawn cell
            respawnCell.textContent = `${respawnData.respawnTime} (${respawnData.respawnDate})`;
            
            // Update time left cell
            timeLeftCell.innerHTML = `<span class="time-remaining">${respawnData.timeRemaining}</span>`;
            
            // Check if this is the next boss to respawn
            if (respawnData.timeRemainingMs > 0 && respawnData.timeRemainingMs < minTimeRemaining) {
                minTimeRemaining = respawnData.timeRemainingMs;
                nextRespawnRow = row;
            }
        });
        
        // Update fixed bosses
        const fixedRows = document.querySelectorAll('#fixedBossTable tbody tr');
        fixedRows.forEach(row => {
            const nextSpawnCell = row.querySelector('.next-spawn-cell');
            const timeLeftCell = row.querySelector('.time-left-cell');
            const schedule = row.dataset.fixedSchedule;
            
            const spawnData = this.calculateNextFixedSpawn(schedule);
            
            // Update next spawn cell
            nextSpawnCell.textContent = spawnData.spawnTime;
            
            // Update time left cell
            timeLeftCell.innerHTML = `<span class="time-remaining">${spawnData.timeRemaining}</span>`;
            
            // Check if this is the next fixed boss to spawn
            if (spawnData.timeRemainingMs > 0 && spawnData.timeRemainingMs < minFixedTimeRemaining) {
                minFixedTimeRemaining = spawnData.timeRemainingMs;
                nextFixedBossRow = row;
            }
        });
        
        // Remove previous highlights
        rows.forEach(row => row.classList.remove('next-respawn'));
        fixedRows.forEach(row => row.classList.remove('next-respawn'));
        
        // Highlight next boss to respawn (regular or fixed)
        if (nextRespawnRow && (minTimeRemaining <= minFixedTimeRemaining || !nextFixedBossRow)) {
            nextRespawnRow.classList.add('next-respawn');
        } else if (nextFixedBossRow) {
            nextFixedBossRow.classList.add('next-respawn');
        }
        
        // Update last updated time
        const updateTimeElement = document.getElementById('updateTime');
        if (updateTimeElement) {
            updateTimeElement.textContent = new Date().toLocaleString();
        }
    }
    
    // Edit a regular boss row
    editRow(bossId) {
        const row = document.querySelector(`#bossTable tr[data-boss-id="${bossId}"]`);
        if (!row) return;
        
        // Get cells
        const dateCell = row.querySelector('.date-cell');
        const timeCell = row
