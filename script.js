// Sample Data (replace with your logic to load/save from localStorage)
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

function signup() {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    if (users.find(user => user.email === email)) {
        alert("Email already exists.");
        return;
    }

    const newUser = {
        email: email,
        password: password
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    console.log("Signup successful:", newUser);
    showApp();
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        console.log("Login successful:", user);
        showApp();
    } else {
        alert("Invalid email or password.");
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    console.log("Logout successful");
    showLogin();
}

function showSignup() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('app').style.display = 'none';
}

function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('app').style.display = 'none';
}

function showApp() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('app').style.display = 'block';
}

// Check if user is already logged in
if (currentUser) {
    showApp();
} else {
    showLogin();
}

window.getSolution = function() {
    const issue = document.getElementById('issue-input').value;
    getOllamaSolution(issue);
}

window.getOllamaSolution = function() {
    const issue = document.getElementById('issue-input').value;
    document.getElementById('solution-text').innerText = "Loading...";

    const flaskURL = 'http://localhost:5000/generate'; // Flask server URL

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: issue })
    };

    const solutionTextElement = document.getElementById('solution-text');
    solutionTextElement.innerText = ''; // Clear previous solution

    fetch(flaskURL, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let partialData = "";

            return new Promise((resolve, reject) => {
                function read() {
                    reader.read().then(({ done, value }) => {
                        if (done) {
                            resolve();
                            return;
                        }
                        partialData += decoder.decode(value);
                        // Process each SSE event
                        let lines = partialData.split('\n');
                        for (let i = 0; i < lines.length - 1; i++) {
                            const line = lines[i];
                            if (line.startsWith("data: ")) {
                                const content = line.substring(5).trim();
                                solutionTextElement.innerText += content;
                            }
                        }
                        partialData = lines[lines.length - 1];
                        read();
                    }).catch(e => {
                        reject(e);
                    });
                }
                read();
            });
        })
        .catch(error => {
            console.error("Error calling Flask server:", error);
            document.getElementById('solution-text').innerText = "Error getting solution. Check console.";
        });
}

window.markSolved = function(solvedBy) {
    const issue = document.getElementById('issue-input').value;
    const solution = document.getElementById('solution-text').innerText;
    //No database, nothing to do
        alert("Marked as solved.");
        clearInput();

}

window.forwardToSystems = function() {
    const issue = document.getElementById('issue-input').value;
    const flaskURL = 'http://localhost:5000/forward';

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ issue: issue })
    };

    fetch(flaskURL, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            clearInput();
        })
        .catch(error => {
            console.error("Error calling Flask server:", error);
            alert("Error forwarding issue. Check console.");
        });
}

// Function to fetch unsolved issues
window.getUnsolvedIssues = function() {
    const flaskURL = 'http://localhost:5000/unsolved';

    fetch(flaskURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayUnsolvedIssues(data);
        })
        .catch(error => {
            console.error("Error getting unsolved issues:", error);
            alert("Error getting unsolved issues. Check console.");
        });
};

// Function to display unsolved issues
function displayUnsolvedIssues(issues) {
    const unsolvedList = document.getElementById('unsolved-list');
    unsolvedList.innerHTML = ''; // Clear existing list

    issues.forEach((issue, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <p><strong>Issue:</strong> ${issue.issue}</p>
            <p><strong>Solution:</strong> ${issue.solution || 'No solution yet'}</p>
            <textarea id="solution-input-${index}" rows="2" cols="50" placeholder="Enter solution"></textarea>
            <button onclick="solveIssue(${index})">Solve</button>
        `;
        unsolvedList.appendChild(listItem);
    });
}

// Function to solve an issue
window.solveIssue = function(index) {
    const solutionInput = document.getElementById(`solution-input-${index}`);
    const solution = solutionInput.value;

    const flaskURL = 'http://localhost:5000/solve';
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ index: index, solution: solution })
    };

    fetch(flaskURL, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            getUnsolvedIssues(); // Refresh the list
        })
        .catch(error => {
            console.error("Error solving issue:", error);
            alert("Error solving issue. Check console.");
        });
};

window.signup = signup;
window.login = login;
window.logout = logout;
window.showSignup = showSignup;
window.showLogin = showLogin;
window.showApp = showApp;
window.getSolution = getSolution;
window.getOllamaSolution = getOllamaSolution;
window.markSolved = markSolved;
window.forwardToSystems = forwardToSystems;
window.clearInput = clearInput;
window.getUnsolvedIssues = getUnsolvedIssues;
window.solveIssue = solveIssue;