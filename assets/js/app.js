angular.module('SimpleWorkCal', [])
.directive('datepicker', function($parse) {

	var linker = function(scope, element, attrs) {
		parsed = $parse(attrs.datepicker);
		element.pickadate({
			firstDay: 1, // Start with a Monday

			onStart: function() {
				//Get initial date from $scope
				currentDate = parsed(scope); 
				this.set('select', currentDate);
				scope.$apply(function(){
					parsed.assign(scope, currentDate);
				});
			},

			onClose: function() {
				// Update the scope with the latest date from the picker
				latestDate = this.get();
				scope.$apply(function(){
					parsed.assign(scope, latestDate);
				});
			}
		});
	};

	return {
		restrict : 'A',
		link     : linker
	}
})

.controller('DateCtrl', function($scope) {
	var currentDate = new Date(); // Lets begin with today!!
	$scope.chosenDate = currentDate;

	$scope.tasks = [
		'',
		'something here',
		'',
		'',
		'',
		'',
		'',
		'',
		''
		]
});
