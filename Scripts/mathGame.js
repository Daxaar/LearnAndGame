/// <reference path="jquery-1.6.4-vsdoc.js" />
/// <reference path="knockout-1.3.0beta.debug.js" />


(function (lg,$){
	'use strict';

    lg.Question = function (leftNumber, rightNumber, sign){
    	var self = this;
    	self.left = ko.observable(leftNumber);
		self.right = ko.observable(rightNumber);
		self.sign = ko.observable(sign);
	
		self.correctAnswer = function(){
			if(self.sign() === "+"){
				return self.left() + self.right();	
			}
			else if(self.sign() === "-"){
				return self.left() - self.right();
			}
			else if(self.sign() === "x"){
				return self.left() * self.right();
			}
		
		};
	
		self.givenAnswer = ko.observable("");
		self.isCorrect = ko.dependentObservable(function() {
				return self.correctAnswer() == self.givenAnswer();
			});
	};

}(window.LearnAndGame = window.LearnAndGame || {}, jQuery));

var viewModel = {
	questionTypes: ko.observableArray(
		[{text:'Addition',value:'+'},{text:'Subtraction',value:'-'},{text:'Multiplication',value:'x'}]),
	questionTypeSelected: ko.observable(),
	timeOptions: ko.observableArray([0.4,1,2,3,4,5,6,7]),
	timeOptionSelected: ko.observable(0.4),
    
	highestNumber: ko.observable(10),

	numberOfQuestions: ko.observableArray([10,20,30,40]),
	numberOfQuestionsSelected: ko.observable(40),

	numberBondsTo: ko.observableArray([10,20,30,40,50,60,70,80,90,100]),
	numberBondsToSelected: ko.observable(10),

	firstName: ko.observable("Darren"),
	lastName: ko.observable("Lewis"),
	//This is an observable array of question arrays (bit funky but it gets us the column based layout) 
	questionGrid: ko.observableArray([]),
	outOfTime: ko.observable(false),
	games: ko.observableArray([{name:"Number Bonds"},{name:"Number Lines"},{name:"Spelling"},{name:"Reading"}]),
	
	scored: ko.observable(false),
	
	nextNumber: function(){
        return Math.floor(Math.random() * this.numberBondsToSelected());
    },
	reset: function (settings){
		this.questionGrid.removeAll();
		this.outOfTime(false);
		this.scored(false);
		var rowCount = this.numberOfQuestionsSelected() / settings.columnCount;

	    for (j = 0; j < rowCount; j++) {
	        viewModel.questionGrid.push({ questionRow: ko.observableArray() });
	        for (i = 0; i < settings.columnCount; i++) {
	            var question = new LearnAndGame.Question(this.nextNumber(), this.nextNumber(), this.questionTypeSelected());
	            this.questionGrid()[j].questionRow.push(question);
	        };
    	};
	},

	score: function(){
		if(this.isComplete()) {
			console.log('calculating score');
			this.scored(true);
			return _.filter(this.answeredQuestions(),function(question){return question.isCorrect();}).length;
		}
		return 0;
	},


	scoreMessage: function() 
	{
		var message = "Not bad.  Have another go to try and improve your score";
		var score = this.score();

		console.log(score);

		if(score == this.numberOfQuestionsSelected())
		{
			message = "Unbelievable!  You got EVERY question right.  You're way too awesome for this.  Perhaps you should try a higher number bond";
		}
		else if(score === 0) {
			message = "I think you need to concentrate a little harder or maybe try a lower number bond."
		}
		if(this.answeredQuestions().length === this.numberOfQuestionsSelected() ){
			message = "Nice one!  You answered all the questions in the time allowed and scored " + score;
		}

		return message;
	},

	allQuestionsAnswered: function(){
		console.log('allQuestionsAnswered');
		return this.answeredQuestions().length == this.numberOfQuestionsSelected();
	},
};

viewModel.allQuestions = ko.dependentObservable(function(){
	console.log('allQuestions');
	var total=0;
	var allquestions = [];
	ko.utils.arrayForEach(this.questionGrid(),function(item){
		ko.utils.arrayForEach(item.questionRow(),function(question){
			allquestions.push(question);
		})
	});
	return allquestions;
},viewModel).extend({ throttle: 500 });


viewModel.answeredQuestions = ko.dependentObservable(function(){
	console.log('answeredQuestions')
	return _.filter(this.allQuestions(),function(question){return question.givenAnswer() != "";});
},viewModel);
	
viewModel.fullName = ko.dependentObservable(function(){	
	return this.firstName() + ' ' + this.lastName();
},viewModel);

viewModel.isComplete = ko.dependentObservable(function(){
	console.log('isComplete');
	return this.allQuestionsAnswered() || this.outOfTime();
},viewModel);


/* Custom Bindings */
ko.bindingHandlers.toggleGrid = {
	init: function(element, valueAccessor) {
		$(element).css({opacity:1,display:'block'});
	},
    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
         
        var value = ko.utils.unwrapObservable(valueAccessor());
        
        $(element).css({opacity:1,display:'block'});

        console.log('isComplete: ' + value);
        if (value == true) {
        	$(element).animate({opacity:0.5},1000);
        }
    }
};

ko.bindingHandlers.animateVisible = {
	init: function(element, valueAccessor) {
		$(element).bounceBox();
	},
	update: function(element, valueAccessor, allBindingsAccessor,viewModel) {
        if(valueAccessor() == true) {
        	var scoreMessage = viewModel.scoreMessage();
			console.log('score message = ' + scoreMessage);
			$(element).bounceBoxToggle();
			$("#scoreMessage").text(viewModel.scoreMessage);
			$('#timer').countdown('destroy');
        }
        else {
			$(element).bounceBoxHide();
        }
	}
};
