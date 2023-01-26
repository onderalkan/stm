var categoriesDiv = null;
var selectedCategories = [];
var numberOfQuestions = 10;
var numberOfAnswers = 2;
var questions = [];
var correctAnswers = 0;

window.onload = function() {
	categoriesDiv = document.getElementById("categories");
	if (categoriesDiv == null) {
		window.alert("Unable to start game!");
		return;
	}
	
	for(var key in gameData) {
		let cb = createCheckbox(key, key, key);
		let lbl = createLabel(key, cb);
		
		let cbDiv = createDiv("cb-button");
		cbDiv.appendChild(cb);
		cbDiv.appendChild(lbl);
		
		categoriesDiv.appendChild(cbDiv);
	}
}

function startGame() {
	var gameDiv = document.getElementById("game-wrapper");
	gameDiv.innerHTML = "";
	
	var progressDiv = document.getElementById("progress-wrapper");
	progressDiv.innerHTML = "";
	
	var totalAvailableQuestions = 0;
	correctAnswers = 0;
	
	var selectedCheckboxes = categoriesDiv.querySelectorAll("input[type='checkbox']:checked");
	
	selectedCategories = {};
	for(var i=0; i < selectedCheckboxes.length; i++) {
		var cb = selectedCheckboxes[i];
		var category = cb.value;
		
		totalAvailableQuestions += gameData[category].length;
		selectedCategories[category] = gameData[category];
	}
	
	if (selectedCategories.length == 0) {
		window.alert("Please select at least one category.");
		return;
	}
	
	numberOfAnswers = document.querySelector('input[name="difficulty"]:checked').value;
	numberOfQuestions = Math.max(10, selectedCheckboxes.length * 5);
	numberOfQuestions = Math.min(numberOfQuestions, totalAvailableQuestions);
	
	var questions = buildQuestions(selectedCategories, numberOfQuestions, numberOfAnswers);
	for (var i=0; i < questions.length; i++) {
		let question = questions[i];
		gameDiv.appendChild(question.buildHTML(i + 1));
		
		let progressSection = createDiv("progress-question-" + (i + 1));
		progressDiv.appendChild(progressSection);
	}
	
	var gameSetupWrapper = document.getElementById("game-setup-wrapper");
	gameSetupWrapper.style.display = "none";
	
	var scoreWrapper = document.getElementById("score-wrapper");
	scoreWrapper.style.display = "none";
	
	var firstQuestion = document.getElementById("question-1");
	firstQuestion.style.display = "block";
}

function quitGame() {
	if (window.confirm("Çıkmak istediğinize emin misiniz?")) {
		restartGame();
	}
}

function restartGame() {
	var gameDiv = document.getElementById("game-wrapper");
	gameDiv.innerHTML = "";
	
	var progressDiv = document.getElementById("progress-wrapper");
	progressDiv.innerHTML = "";
		
	var scoreWrapper = document.getElementById("score-wrapper");
	scoreWrapper.style.display = "none";
	
	var gameSetupWrapper = document.getElementById("game-setup-wrapper");
	gameSetupWrapper.style.display = "block";
}