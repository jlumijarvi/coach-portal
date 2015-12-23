/// <reference path="../../../../typings/tsd.d.ts" />

namespace app.directives {

	class BootstrapForm implements ng.IDirective {

		restrict: string = 'A';
		scope: any = true;

		constructor(private $compile: ng.ICompileService) {
		}

		link: ng.IDirectiveLinkFn = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
			element.find('[required]').each((index, elem) => {
				var prevLabel = $(elem).siblings('label');
				prevLabel.append(' <i class="fa fa-star small"></i>');
				if (prevLabel.length > 0) {
					var newLabel = prevLabel.clone();
					newLabel.attr('bs-tooltip', 'Vaaditaan');
					newLabel.attr('tooltip-type', 'danger');
					newLabel = this.$compile(newLabel)(scope);
					prevLabel.replaceWith(newLabel);
				}
			});
		}

        public static factory(): ng.IDirectiveFactory {
            var ret = ($compile: ng.ICompileService) => {
				return new BootstrapForm($compile);
			};
			ret.$inject = ['$compile'];
			return ret;
        }
	}

	angular
		.module('app')
		.directive('bsForm', BootstrapForm.factory());
}
