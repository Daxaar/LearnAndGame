/// <reference path="jquery-1.6.4-vsdoc.js" />
/// <reference path="knockout-1.3.0beta.debug.js" />


(function(lg,$){
    lg.utils = function(){
        changeEnterToTab = function(){
            console.log('changeenter');
            //TODO: http://thinksimply.com/blog/jquery-enter-tab
        };
    };
}(window.learnAndGame = window.learnAndGame || {}, jQuery));
    
function Question(leftNumber,rightNumber,sign){
    var self = this;
    this.left = ko.observable(leftNumber);
	this.right = ko.observable(rightNumber);
	this.sign = ko.observable(sign);
	this.someValue = 100;
	
	this.correctAnswer = function(){
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
	
	this.givenAnswer = ko.observable("");
	this.isCorrect = ko.dependentObservable(function(){
		return self.correctAnswer() == self.givenAnswer();
	});
};


var viewModel = {
    questionTypes: ko.observableArray(
		[{ text: 'Addition', value: '+' }, { text: 'Subtraction', value: '-' }, { text: 'Multiplication', value: 'x'}]),
    questionTypeSelected: ko.observable(),
    timeOptions: ko.observableArray([1, 2, 3, 4, 5, 6, 7]),
    timeOptionSelected: ko.observable(7),

    highestNumber: ko.observable(10),
    nextNumber: function () {
        return Math.floor(Math.random() * this.numberBondsToSelected());
    },
    numberOfQuestions: ko.observableArray([10, 20, 30, 40]),
    numberOfQuestionsSelected: ko.observable(40),

    numberBondsTo: ko.observableArray([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]),
    numberBondsToSelected: ko.observable(10),

    firstName: ko.observable("Darren"),
    lastName: ko.observable("Lewis"),
    //This is an observable array of question arrays 
    //(bit funky but it gets us the column based layout) 
    questionGrid: ko.observableArray([]),
    outOfTime: ko.observable(false),
    timeLeft: ko.observable(60),
    games: ko.observableArray([{ name: "Number Bonds" }, { name: "Number Lines" }, { name: "Spelling" }, { name: "Reading"}])
};

viewModel.isOutOfTime = ko.dependentObservable(function () {
    return this.timeLeft <= 0;
}, viewModel);

viewModel.allQuestions = ko.dependentObservable(function(){
	var total=0;
	var allquestions = [];
	ko.utils.arrayForEach(this.questionGrid(),function(item){
		ko.utils.arrayForEach(item.questionRow(),function(question){
			allquestions.push(question);
		})
	});
	return allquestions;
},viewModel);

viewModel.answeredQuestions = ko.dependentObservable(function(){
    ko.utils.arrayMap
	var answered = _.filter(this.allQuestions(),function(question){return question.givenAnswer() != "";});
	return answered;
},viewModel);
	
viewModel.fullName = ko.dependentObservable(function(){
	return this.firstName() + ' ' + this.lastName();
},viewModel);