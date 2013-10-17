angular.module('SimpleWorkCal', [])
.factory('tasks', function() {
	return [ 'Buy some milk', 
				'something here',
				'Visit the bank',
				'Pay bills',
				'Walk the monkey',
				'make some chilli',
				'pack dinner',
				'wash car',
				'brush teeth' ];
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
