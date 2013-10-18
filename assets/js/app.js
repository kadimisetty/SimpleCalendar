angular.module('SimpleWorkCal', [])
.factory('tasks', function() {
	return [ 
		{'hour': '8 am'  , 'detail' : 'Buy some milk here'},
		{'hour': '9 am'  , 'detail' : 'Visit the bank'},
		{'hour': '10 am' , 'detail' : 'Pay bills'},
		{'hour': '11 am' , 'detail' : 'Walk the cats'},
		{'hour': '12 pm' , 'detail' : 'Make some chilli!'},
		{'hour': '1 pm'  , 'detail' : 'Pack evening snacks'},
		{'hour': '2 pm'  , 'detail' : 'Wash your Ferrari'},
		{'hour': '3 pm'  , 'detail' : 'Brush teeth'},
		{'hour': '4 pm'  , 'detail' : 'Brush teeth'},
		{'hour': '5 pm'  , 'detail' : 'Brush teeth'}
	];
})

.controller('DateCtrl', function($scope, tasks) {
	var currentDate = new Date(); // Lets begin with today!!
	$scope.chosenDate = currentDate;
	$scope.tasks = tasks;
	// $scope.updateScope = function() {
	// }
	$scope.safeApply = function(fn) {
		var phase = this.$root.$$phase;
		if(phase == '$apply' || phase == '$digest') {
			if(fn && (typeof(fn) === 'function')) {
				fn();
			}
		} else {
			this.$apply(fn);
		}
	};
})

.directive('datepicker', function($parse) {
	return function(scope, element, attrs) {
		parsed = $parse(attrs.datepicker);
		element.pickadate({
			firstDay: 1, // Start with a Monday
			clear: '', //Disable the clear button
			format: 'd mmm yyyy',
			today:'Today',

			onStart: function() {
				//Update initial date into the scope
				currentDate = parsed(scope); 
				this.set('select', currentDate);
				scope.safeApply(function(){
					parsed.assign(scope, currentDate);
				});
			},

			onClose: function() {
				// Update the scope with the latest date from the picker
				latestDate = this.get();
				scope.safeApply(function(){
					parsed.assign(scope, latestDate);
				});
			}
		});
	}
})
