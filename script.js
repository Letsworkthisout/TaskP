let tasks = [];
let comparisons = [];
let currentComparison = 0;
let selectedTask = null;

function startComparisons() {
    tasks = [];
    for (let i = 1; i <= 10; i++) {
        const taskInput = document.getElementById(`task${i}`).value.trim();
        if (taskInput) {
            tasks.push({name: taskInput, points: 0});
        }
    }

    if (tasks.length < 2) {
        alert("Please enter at least 2 tasks.");
        return false;
    }

    comparisons = [];
    for (let i = 0; i < tasks.length; i++) {
        for (let j = i + 1; j < tasks.length; j++) {
            comparisons.push([i, j]);
        }
    }

    currentComparison = 0;
    document.getElementById('task-input').style.display = 'none';
    document.getElementById('comparison').style.display = 'block';
    showComparison();

    return false; // Prevent form submission
}

function showComparison() {
    if (currentComparison < comparisons.length) {
        const [i, j] = comparisons[currentComparison];
        document.getElementById('task1-btn').innerText = tasks[i].name;
        document.getElementById('task2-btn').innerText = tasks[j].name;
        document.getElementById('task1-btn').classList.remove('selected');
        document.getElementById('task2-btn').classList.remove('selected');
        selectedTask = null;
    } else {
        showResults();
    }
}

function selectTask(selected) {
    selectedTask = selected;
    document.getElementById('task1-btn').classList.toggle('selected', selected === 1);
    document.getElementById('task2-btn').classList.toggle('selected', selected === 2);
}

function nextComparison() {
    if (selectedTask !== null) {
        const [i, j] = comparisons[currentComparison];
        if (selectedTask === 1) {
            tasks[i].points++;
        } else {
            tasks[j].points++;
        }
        currentComparison++;
        showComparison();
    } else {
        alert("Please select a task.");
    }
}

function previousComparison() {
    if (currentComparison > 0) {
        currentComparison--;
        showComparison();
    }
}

function showResults() {
    tasks.sort((a, b) => b.points - a.points);
    const totalComparisons = comparisons.length;
    const resultList = document.getElementById('result-list');
    resultList.innerHTML = tasks.map((task, index) => {
        const percentage = ((task.points / totalComparisons) * 100).toFixed(2);
        return `<tr><td>${index + 1}</td><td>${task.name}</td><td>${task.points}</td><td>${percentage}%</td></tr>`;
    }).join('');
    document.getElementById('comparison').style.display = 'none';
    document.getElementById('result').style.display = 'block';
}

function confirmRestart() {
    if (confirm("Are you sure you want to start again? You will lose your current progress.")) {
        restart();
    }
}

function restart() {
    tasks = [];
    comparisons = [];
    currentComparison = 0;
    selectedTask = null;
    document.getElementById('task-form').reset();
    document.getElementById('task-input').style.display = 'block';
    document.getElementById('comparison').style.display = 'none';
    document.getElementById('result').style.display = 'none';
}

function emailResults() {
    const email = prompt("Please enter your email address:");
    if (email) {
        const subject = "Task Prioritizer Results";
        const body = tasks.map((task, index) => `${index + 1}. ${task.name} - ${task.points} points (${((task.points / comparisons.length) * 100).toFixed(2)}%)`).join('\n');
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
}

document.addEventListener('keydown', function(event) {
    if (document.getElementById('comparison').style.display === 'block') {
        if (event.key === '1') {
            selectTask(1);
        } else if (event.key === '2') {
            selectTask(2);
        } else if (event.key === 'Enter') {
            nextComparison();
        }
    }
});