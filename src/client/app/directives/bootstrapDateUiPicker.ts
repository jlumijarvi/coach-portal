/// <reference path="../../../../typings/tsd.d.ts" />

namespace app.directives {

	class BootstrapDateUiPicker implements ng.IDirective {

		restrict: string = 'A';
		scope: any = true;
		defaultOptions: any = {
			changeYear: true,
			changeMonth: true,
			yearRange: '1900:-0'
		};

		static $inject = ['$compile'];
		constructor(private $compile: ng.ICompileService) {
		}

		link: ng.IDirectiveLinkFn = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
			var options = scope['ui-date'] || this.defaultOptions;
			scope['dateOptions'] = options;
			var isRequired = angular.isDefined(element.attr('required'));
			var markup =
				'<div class="input-group">' +
				'<span class="input-group-btn">' +
				'<button class="btn btn-secondary"><i class="fa fa-calendar"></i>' +
				'</button>' +
				'</span>' +
				'<input ui-date="dateOptions" class="form-control">' +
				'</div>';
			var newElem = this.$compile(markup)(scope);
			if (isRequired) {
				newElem.attr('required', '');
			}
			newElem.find('button').bind('click', (e) => {
				e.preventDefault();
				newElem.find('input').focus();
			});
			element.replaceWith(newElem);
		}

        public static factory(): ng.IDirectiveFactory {
            var ret = ($compile: ng.ICompileService) => {
				return new BootstrapDateUiPicker($compile);
			};
			ret.$inject = ['$compile'];
			return ret;
        }
	}

	angular
		.module('app')
		.directive('bsDatePicker', BootstrapDateUiPicker.factory());
}
