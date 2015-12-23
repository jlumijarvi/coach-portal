/// <reference path="../../../../typings/tsd.d.ts" />

namespace app.directives {

	interface IDatePickerScope extends ng.IScope {
		date: any;
		years: number[];
		months: string[];
		days: number[];
		required: boolean;
		dateChanged: any;
	}

	class BootstrapDatePicker implements ng.IDirective {

		restrict: string = 'E';
		date: Date;
		templateUrl: string = '/app/templates/bsDatePicker.html';
		require: any = 'ngModel';
		scope: any = {
			ngModel: '='
		}

		constructor(private $locale: ng.ILocaleService, private monthLocales: any) {
		}

		link: ng.IDirectiveLinkFn = (scope: IDatePickerScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
			scope['ngModel'] = scope['ngModel'] || { year: '', month: '', day: '' };
			scope.$watch('ngModel', (data) => {
				scope.date = data;
			});
			scope.years = _.range(1900, new Date().getFullYear() + 1);
			scope.months = this.$locale.DATETIME_FORMATS.MONTH;
			scope.days = _.range(1, 32);
			scope.required = angular.isDefined(attrs['required']);
			scope.dateChanged = () => {
				if (scope.date.year && scope.date.month) {
					scope.days = _.range(1, new Date(scope.date.year, scope.date.month, 0).getDate() + 1);
					var idx = _.indexOf(scope.days, parseInt(scope.date.day));
					if (idx == -1) {
						scope.date.day = _.max(scope.days).toString();
					}
				}
				scope['ngModel'] = scope.date;
			};
		}

        public static factory(): ng.IDirectiveFactory {
            var ret = ($locale: ng.ILocaleService, monthLocales: any) => {
				return new BootstrapDatePicker($locale, monthLocales);
			};
			ret.$inject = ['$locale', 'monthLocales'];
			return ret;
        }
	}

	angular
		.module('app')
		.directive('bsDatePicker', BootstrapDatePicker.factory());
}
