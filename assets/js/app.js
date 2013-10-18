app = angular.module('SimpleWorkCal', [])

app.factory('tasks', function() {
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
	console.log(moment());
	var currentDate = new Date();
	$scope.chosenDate = currentDate;
	$scope.tasks = tasks;
	
	// Update the scope in case it's
	// interrupted by another apply mid updating
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

	$scope.updateDetail = function(indx) {
		console.log(indx)
	}

	$scope.cancelEdit = function(detailValue) {
		console.log('canceled doind - ', detailValue);
	}

})

app.directive('datepicker', function($parse) {
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




// More
// http://plnkr.co/edit/EsW7mV?p=preview


// On esc event
app.directive('onEsc', function() {
  return function(scope, element, attrs) {
    element.bind('keydown', function(e) {
      if (e.keyCode === 27) {
        scope.$apply(attrs.onEsc);
      }
    });
  };
});

// On enter event
app.directive('onEnter', function() {
  return function(scope, elment, attrs) {
    elment.bind('keypress', function(e) {
      if (e.keyCode === 13) {
        scope.$apply(attrs.onEnter);
      }
    });
  };
});

// Inline edit directive
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
    templateUrl: 'inline-edit.html'
  };
});


