angular.module('SimpleWorkCal', [])
.directive('datepicker', function($parse) {

	var linker = function(scope, element, attrs) {
		parsed = $parse(attrs.datepicker);
		element.pickadate({
			onStart: function() {
				currentDate = parsed(scope);
				this.set('select', currentDate);
			},

			onClose: function() {
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
