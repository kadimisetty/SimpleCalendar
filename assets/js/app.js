app = angular.module('SimpleWorkCal', [])

app.factory('tasks', function() {
	// A factory that hands over a mock data container
	// Will be mapped into id with a date+hour as key
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

app.controller('DateCtrl', function($scope, tasks) {
	// Start with a new date!
	$scope.chosenDate = new Date();
	// Load tasks from the factory into the scope
	$scope.tasks = tasks;
	
	// Protect updting scope from being 
	// interrupted by another similar scope update
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

	// Perform update scope.model's current value
	$scope.updateDetail = function(indx) {
		console.log(indx)
	}

	// Perform when the user "cancels" out of an editing action
	$scope.cancelEdit = function(detailValue) {
		console.log('canceled doind - ', detailValue);
	}

})

// Presetn a datepicker and associated actions
app.directive('datepicker', function($parse) {
	return function(scope, element, attrs) {
		// Use $parse to access nested attributes
		parsed = $parse(attrs.datepicker);

		// Instantiate a pickadate and start with selected options
		element.pickadate({
			firstDay: 1,          // Start with a Monday
			format: 'd mmm yyyy', // Use pickadats's date format syntax
			today:'Today',        // Use this word to stand for today
			clear: '',            // Disable the clear button

			onStart: function() { // Run when the pickadate is started initially
				//Update initial date into the scope
				currentDate = parsed(scope); 
				this.set('select', currentDate);
				scope.safeApply(function(){
					parsed.assign(scope, currentDate);
				});
			},

			onClose: function() { // Run when pickadate closes the calendar
				latestDate = this.get();
				scope.safeApply(function(){
					parsed.assign(scope, latestDate);
				});
			}
		});
	}
})

// Hook to 'Esc' event
app.directive('onEsc', function() {
  return function(scope, element, attrs) {
    element.bind('keydown', function(e) {
      if (e.keyCode === 27) {
        scope.$apply(attrs.onEsc);
      }
    });
  };
});

// Hook to 'Enter' event
app.directive('onEnter', function() {
  return function(scope, elment, attrs) {
    elment.bind('keypress', function(e) {
      if (e.keyCode === 13) {
        scope.$apply(attrs.onEnter);
      }
    });
  };
});

app.directive('inlineEdit', function($timeout) {
  return {

    scope: {
      model: '=inlineEdit',
      handleSave: '&onSave',
      handleCancel: '&onCancel'
    },

    link: function(scope, elm, attr) {
      var previousValue;
      
      scope.edit = function() {
        scope.editMode = true;
        previousValue = scope.model;
        
        $timeout(function() {
          elm.find('input')[0].focus();
        }, 0, false);
      };

      scope.save = function() {
        scope.editMode = false;
        scope.handleSave({value: scope.model});
      };

      scope.cancel = function() {
        scope.editMode = false;
        scope.model = previousValue;
        scope.handleCancel({value: scope.model});
      };
    },

    templateUrl: 'inline-edit.html' //Load template form this URL
  };
});
