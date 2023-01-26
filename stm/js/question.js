class Question {

	constructor() {
		this.questionNumber = 0;
		this.questionTitle = "Unkown";
		this.questionAnswers = [];
		this.correctAnswerIndex = 0;
	}
	
	pickOtherAnswers(categoryData, numberOfAnswers, key) {
		let correctAnswer = this.questionAnswers[0];
		var otherData = categoryData.filter(function(e) {
			return e.values[key] != correctAnswer;
		});
		
		otherData = shuffle(otherData);
		while ( (this.questionAnswers.length < numberOfAnswers) &&
				(otherData.length > 0) ) {
			let data = otherData.pop();
			this.questionAnswers.push(data.values[key]);
		}
	}
	
	findCorrectAnswer(answer) {
		for(var i=0; i < this.questionAnswers.length; i++) {
			if (this.questionAnswers[i] == answer) {
				this.correctAnswerIndex = i;
				break;
			}
		}
	}
	
	questionDiv() {
		return document.getElementById("question-" + this.questionNumber);
	}
	
	correctAnswerListItem() {
		return document.getElementById(this.questionDiv().id + "-answer-li-" + this.correctAnswerIndex);
	}
	
	selectedAnswerListItem() {
		return document.getElementById(this.questionDiv().id + "-answer-li-" + this.selectedAnswerIndex());
	}
	
	submitButton() {
		return document.getElementById("submit-" + this.questionDiv().id);
	}
	
	nextButton() {
		return document.getElementById("next-" + this.questionDiv().id);
	}
	
	next() {
		let selectedAnswerObj = this.questionDiv().querySelector("input[type='radio']:checked");
		if (selectedAnswerObj != null) {
			selectedAnswerObj.checked = false;
		}
		
		this.submitButton().style.display = "none";
		this.nextButton().style.display = "block";
		
		let radioButtons = this.questionDiv().querySelectorAll("input[type='radio']");
		for (var i=0; i < radioButtons.length; i++) {
			radioButtons[i].disabled = true;
		}
	}
	
	resetClasses() {
		let listItems = this.questionDiv().querySelectorAll("li");
		for (var i=0; i < listItems.length; i++) {
			listItems[i].className = null;
		}
	}
	
	selectedAnswerIndex() {
		let selectedAnswerObj = this.questionDiv().querySelector("input[type='radio']:checked");
		if (selectedAnswerObj != null) {
			return selectedAnswerObj.value;
		} else {
			return -1;
		}
	}
	
	buildHTML(questionNumber) {
		this.questionNumber = questionNumber;
	
		var mainDiv = createDiv("question-" + this.questionNumber);
		
		var titleHeader = createHeader(1, "Soru " + this.questionNumber);
		mainDiv.appendChild(titleHeader);
		
		var questionLabel = createLabel("");
		mainDiv.appendChild(questionLabel)
		
		var questionHeader = createHeader(2, this.questionTitle);
		mainDiv.appendChild(questionHeader);
		
		var listObj = document.createElement("ul");
		listObj.id = "answers";
		
		for (var i=0; i < this.questionAnswers.length; i++) {
			var listItemObj = document.createElement("li");
			listItemObj.id = mainDiv.id + "-answer-li-" + i;
			
			let answer = this.questionAnswers[i];
			let radioButtonGroup = mainDiv.id + "-answers";
			let radioButtonID = mainDiv.id + "-answer-" + i;
			let radioButtonObj = createRadioButton(radioButtonGroup, i, radioButtonID);
			let answerLabel = createLabel(answer, radioButtonObj);
			
			listItemObj.appendChild(radioButtonObj);
			listItemObj.appendChild(answerLabel);
			
			listObj.appendChild(listItemObj);
		}
		mainDiv.appendChild(listObj);
		
		addBreak(mainDiv);
		addBreak(mainDiv);
		
		let quitButton = createButton("Çıkış", "quit-" + mainDiv.id, quitGame);
		mainDiv.appendChild(quitButton);
		
		let question = this;
		let answerFunction = function() {
			submitQuestion(question);
		};
		let submitButton = createButton("Tamam", "submit-" + mainDiv.id, answerFunction);
		mainDiv.appendChild(submitButton);
		
		let nextFunction = function() {
			nextQuestion(question);
		}
		let nextButton = createButton("Sonraki", "next-" + mainDiv.id, nextFunction);
		nextButton.style.display = "none";
		mainDiv.appendChild(nextButton);
		
		return mainDiv;
	}

}

function nextQuestion(question) {
	question.questionDiv().style.display = "none";
	
	let nextQuestionIndex = question.questionNumber + 1;
	var nextQuestionDiv = document.getElementById("question-" + nextQuestionIndex);
	if (nextQuestionDiv != null) {
		nextQuestionDiv.style.display = "block";
	} else {
		let scoreLabel = document.getElementById("score-label");
		scoreLabel.innerHTML = "";
		scoreLabel.appendChild(document.createTextNode(correctAnswers + " / " + numberOfQuestions));
	
		let scoreDiv = document.getElementById("score-wrapper");
		scoreDiv.style.display = "block";
	}
}

function submitQuestion(question) {
	let selectedAnswerIndex = question.selectedAnswerIndex();
	if (selectedAnswerIndex < 0) {
		return;
	}
	
	let correctAnswerListItem = question.correctAnswerListItem();
	let selectedAnswerListItem = question.selectedAnswerListItem();
	let progressDiv = document.getElementById("progress-question-" + question.questionNumber);
	
	question.resetClasses();
	if (selectedAnswerIndex == question.correctAnswerIndex) {
		selectedAnswerListItem.className = "right";
		progressDiv.className = "progressRight";
		correctAnswers++;
	} else {
		selectedAnswerListItem.className = "wrong";
		correctAnswerListItem.className = "correct";
		progressDiv.className = "progressWrong";
	}
	
	question.next();
}

function buildQuestions(categories, numberOfQuestions, numberOfAnswers) {
	var questions = [];
	var categorySplit = calculateCategorySplit(categories, numberOfQuestions);
	
	// Now we build the array of questions.
	for (category in categorySplit) {
		var categoryData = categories[category].slice();
		categoryData = shuffle(categoryData);
		
		let split = categorySplit[category];
		for(var i=0; i < split; i++) {
			let data = categoryData[i];
			var titleKey = "soru";
			var answerKey = "cevap";
			if (Math.random() > 0) {
				titleKey = "cevap";
				answerKey = "soru";
			}
			
			let title = data.values[titleKey];
			let answer = data.values[answerKey];
		
			var question = new Question();
			question.questionTitle = title;
			question.questionAnswers.push(answer);
			question.pickOtherAnswers(categoryData, numberOfAnswers, answerKey);
			
			question.questionAnswers = shuffle(question.questionAnswers);
			question.findCorrectAnswer(answer);
			questions.push(question);
		}
	}

	questions = shuffle(questions);
	return questions;
}

// ToDo: check if only one category
// ToDo: check if number of categories > number of questions
// ToDo: check if split > number of entries in category
function calculateCategorySplit(categories, numberOfQuestions) {
	var totalQuestions = 0;
	var totalAllocated = 0;
	var categorySplit = {};
	
	for(category in categories) {
		totalQuestions += categories[category].length;
	}
	
	for(category in categories) {
		var split = categories[category].length / (totalQuestions * 1.0);
		split = Math.round(split * numberOfQuestions);
		
		categorySplit[category] = split;
		totalAllocated += split;
	}
	
	// This makes sure we have the right number of questions
	var keys = Object.keys(categorySplit);
	while(totalAllocated > numberOfQuestions) {
		let idx = Math.floor(Math.random()*keys.length);
		categorySplit[keys[idx]]--;
		totalAllocated--;
	}
	
	while(totalAllocated < numberOfQuestions) {
		let idx = Math.floor(Math.random()*keys.length);
		categorySplit[keys[idx]]++;
		totalAllocated++;
	}	
	
	return categorySplit;
}