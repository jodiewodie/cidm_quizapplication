var quizModule = angular.module('QuizApplication', []); 

quizModule.controller('QuizApplicationController',
    ['$scope','studentListService','questionListService','LocalStorageService',
        //callback function
        function($scope, studentListService, questionListService, LocalStorageService){
    
    var qac = this;

    //use service here
    qac.students_completed = [];
    
    //use service here
    qac.questions_completed = [];
    
    qac.getNextQuestion = function(){
        
        if(qac.questions.length > 0){
            var index = Math.floor(Math.random() * qac.questions.length);
            qac.selected_question = qac.questions[index];
            qac.questions_completed.push(qac.selected_question);
            qac.questions.splice(index, 1);            
        }
        else{
            qac.questions = qac.questions_completed;
            qac.questions_completed = [];
        }

    }
    
    qac.getNextStudent = function(){
        
        if(qac.students.length > 0){
            var index = Math.floor(Math.random() * qac.students.length);
            qac.selected_student = qac.students[index];
            qac.students_completed.push(qac.selected_student);
            qac.students.splice(index, 1);
        }
        else{
            qac.students = qac.students_completed;
            qac.students_completed = [];
        }
    }
    
    qac.getNext = function(){
        qac.getNextQuestion();
        qac.getNextStudent();
    }
    
    qac.doCorrect = function(){
        qac.selected_student.correct++;
        
       // console.log("length of students is: " + qac.students.length);
       // console.log("length of students_completed is: " + qac.students_completed.length);
        var wholeList = qac.students.concat(qac.students_completed);
        qac.update(angular.toJson(wholeList));
        qac.getNext();
    }
    
    qac.doIncorrect = function(){
        qac.selected_student.incorrect++;
       // console.log("length of students is: " + qac.students.length);
      //  console.log("length of students_completed is: " + qac.students_completed.length);        
        var wholeList = qac.students.concat(qac.students_completed);        
        qac.update(angular.toJson(wholeList));
        qac.getNext();        
    };
    
    qac.fetch = function() {
        return LocalStorageService.getData();
    };
    qac.update = function(val) {
        return LocalStorageService.setData(val);
    };
    
    qac.getStudents = function(){
        var fromStorage = qac.fetch();
        
       // console.log(fromStorage);
        
        if(fromStorage){
          //  console.log(fromStorage);
            qac.students = fromStorage;
            qac.getNextStudent();
        }else{
            studentListService.getStudentList()
                .then(
                    // if $http.get was successful, do this
                    function(response){
                      //  console.log(response);
                        qac.students = response.data;
                        qac.getNextStudent();
                    },
                    // if $http.get was unsuccessful, do this
                    function(response){
                       // console.log(response);
                        qac.students = [];
                    }
            );
        }
        
    };
     qac.getQuestions = function(){
        questionListService.getQuestionList()
        .then(
            // if $http.get was successful, do this
            function(response){
              //  console.log(response);
                qac.questions = response.data;
                qac.getNextQuestion();
            },
            // if $http.get was unsuccessful, do this
            function(response){
               // console.log(response);
                qac.questions = [];
            }
        );
    };
    
     // qac.getNext();
     qac.getStudents();
     qac.getQuestions();
    
    // mc.latestData = function(){
    //     return LocalStorageService.getData();
    // };
    // mc.update = function(val){
    //     return LocalStorageService.setData(val);
    // };
    // mc.update(angular.toJson(mc.students));
    // mc.students = LocalStorageService.getData();
    
}]);

/////  THIS RETRIEVES THE STUDENT LISTS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
quizModule.factory('studentListService', ['$http', function($http){
    
    var studentListService = {};
    
    studentListService.getStudentList = function(){
        return $http.get("students.json");
    }
    return studentListService;
    
}]);

///// THIS RETRIEVES THE QUESTION LISTS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
quizModule.factory('questionListService', ['$http', function($http){
    
    var questionListService = {};
    
    questionListService.getQuestionsList = function(){
        return $http.get("questions.json");
    }
    return questionListService;
    
}]);

////// THIS IS THE LOCAL STORAGE SERVICE //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
quizModule.factory("LocalStorageService", function($window, $rootScope) {
    
    angular.element($window).on('storage', function(event){
        if (event.key === 'my-storage7') {
            $rootScope.$apply();
        }
    });
    
    return {
        setData: function(val) {
            $window.localStorage && $window.localStorage.setItem('my-storage7', val);
            return this;
        },
        getData: function() {
            
            var val = $window.localStorage && $window.localStorage.getItem('my-storage7');
            var data = angular.fromJson(val);
            
            return data; 
        }
    };
});