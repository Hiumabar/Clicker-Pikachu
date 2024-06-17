let score = 0;
let pointsPerClick = 1;
let username = '';
let upgrades = {
    1: { cost: 10, increment: 1, level: 0 },
    2: { cost: 100, increment: 10, level: 0 },
    3: { cost: 500, increment: 50, level: 0 },
    4: { cost: 1000, increment: 100, level: 0 },
    5: { cost: 5000, increment: 500, level: 0 }
};

// Load leaderboard from localStorage
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

// Load username, score, pointsPerClick, and upgrades from localStorage
username = localStorage.getItem('username') || '';
score = parseInt(localStorage.getItem('score'), 10) || 0;
pointsPerClick = parseInt(localStorage.getItem('pointsPerClick'), 10) || 1;
upgrades = JSON.parse(localStorage.getItem('upgrades')) || upgrades;

function startGame() {
    username = document.getElementById('username').value;
    if (username === '') {
        alert('Please enter a username');
        return;
    }
    localStorage.setItem('username', username);
    document.getElementById('username-container').classList.add('hidden');
    document.getElementById('score-highscore-container').classList.remove('hidden');
    document.getElementById('click-image').classList.remove('hidden');
    document.getElementById('upgrades-container').classList.remove('hidden');
    document.getElementById('score').innerText = score;
    loadLeaderboard();
}

function incrementScore() {
    if (username === '') {
        alert('Please enter a username');
        return;
    }
    score += pointsPerClick;
    document.getElementById('score').innerText = score;
    document.getElementById('pikachu-sound').play();
    displayMessage(`You gained ${pointsPerClick} points!`);
    localStorage.setItem('score', score);
    updateLeaderboard();
}

function buyUpgrade(upgrade) {
    if (username === '') {
        alert('Please enter a username');
        return;
    }
    if (score >= upgrades[upgrade].cost) {
        score -= upgrades[upgrade].cost;
        pointsPerClick += upgrades[upgrade].increment;
        upgrades[upgrade].level += 1;
        upgrades[upgrade].cost = Math.floor(upgrades[upgrade].cost * 1.2);  // Increase cost for next purchase
        document.getElementById('score').innerText = score;
        displayMessage(`Upgrade ${upgrade} purchased! Points per click increased by ${upgrades[upgrade].increment}.`);
    } else {
        displayMessage("Not enough points to purchase this upgrade.");
    }
    localStorage.setItem('score', score);
    localStorage.setItem('pointsPerClick', pointsPerClick);
    localStorage.setItem('upgrades', JSON.stringify(upgrades));
    updateLeaderboard();
    updateUpgradeButtons();
}

function displayMessage(message) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerText = message;
    setTimeout(() => {
        messageDiv.innerText = '';
    }, 2000);
}

function updateLeaderboard() {
    // Find if the user already exists in the leaderboard
    let userIndex = leaderboard.findIndex(entry => entry.name === username);

    if (userIndex !== -1) {
        // Update score if the new score is higher
        if (score > leaderboard[userIndex].score) {
            leaderboard[userIndex].score = score;
        }
    } else {
        // Add new user to the leaderboard
        leaderboard.push({ name: username, score: score });
    }

    // Sort leaderboard
    leaderboard.sort((a, b) => b.score - a.score);

    // Save leaderboard to localStorage
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    // Display leaderboard
    loadLeaderboard();
}

function updateUpgradeButtons() {
    for (let i = 1; i <= 5; i++) {
        const button = document.getElementById(`upgrade-${i}`);
        button.innerText = `Upgrade ${i} (Cost: ${upgrades[i].cost}, +${upgrades[i].increment} per click)`;
    }
}

function loadLeaderboard() {
    let leaderboardHTML = '';
    for (let i = 0; i < leaderboard.length && i < 10; i++) {
        leaderboardHTML += `<li>${leaderboard[i].name}: ${leaderboard[i].score}</li>`;
    }
    document.getElementById('highscore').innerHTML = leaderboardHTML;
}

// Load leaderboard and username on page load
window.onload = () => {
    loadLeaderboard();
    updateUpgradeButtons();
    if (username !== '') {
        document.getElementById('username-container').classList.add('hidden');
        document.getElementById('score-highscore-container').classList.remove('hidden');
        document.getElementById('click-image').classList.remove('hidden');
        document.getElementById('upgrades-container').classList.remove('hidden');
        document.getElementById('score').innerText = score;
    }
};
