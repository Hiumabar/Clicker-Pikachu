let score = 0;
let pointsPerClick = 1;
let username = '';

// Load leaderboard from localStorage
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

// Load username and score from localStorage
username = localStorage.getItem('username') || '';
score = parseInt(localStorage.getItem('score'), 10) || 0;

function startGame() {
    username = document.getElementById('username').value;
    if (username === '') {
        alert('Please enter a username');
        return;
    }
    localStorage.setItem('username', username);
    document.getElementById('username-container').classList.add('hidden');
    document.getElementById('score-container').classList.remove('hidden');
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
    displayMessage(`You gained ${pointsPerClick} points!`);
    localStorage.setItem('score', score);
    updateLeaderboard();
}

function buyUpgrade(upgrade) {
    if (username === '') {
        alert('Please enter a username');
        return;
    }
    if (upgrade === 1 && score >= 10) {
        score -= 10;
        pointsPerClick += 1;
        document.getElementById('score').innerText = score;
        displayMessage("Upgrade 1 purchased! Points per click increased by 1.");
    } else if (upgrade === 2 && score >= 100) {
        score -= 100;
        pointsPerClick += 10;
        document.getElementById('score').innerText = score;
        displayMessage("Upgrade 2 purchased! Points per click increased by 10.");
    } else {
        displayMessage("Not enough points to purchase this upgrade.");
    }
    localStorage.setItem('score', score);
    updateLeaderboard();
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
    if (username !== '') {
        document.getElementById('username').value = username;
        document.getElementById('username-container').classList.add('hidden');
        document.getElementById('score-container').classList.remove('hidden');
        document.getElementById('click-image').classList.remove('hidden');
        document.getElementById('upgrades-container').classList.remove('hidden');
        document.getElementById('score').innerText = score;
    }
};
