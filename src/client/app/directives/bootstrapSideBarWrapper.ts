/// <reference path="../../../../typings/tsd.d.ts" />

namespace app.directives {

	class BootstrapSideBarLayout implements ng.IDirective {

		restrict: string = 'A';
		onChangeHandler: any;

		constructor() {
		}

		link: ng.IDirectiveLinkFn = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
			element.attr('id', 'wrapper');
			element.find('#menu-toggle').bind('click', (e) => {
				console.log(element.hasClass('toggled'));
				e.preventDefault();
				e.stopPropagation();
				element.removeClass('toggled');
			});
			element.bind('click', (e) => {
				element.addClass('toggled');
			});
			element.addClass('toggled');
			element.fadeIn();
		}

        public static factory(): ng.IDirectiveFactory {
            var ret = () => { return new BootstrapSideBarLayout(); };
			return ret;
        }
	}

	angular
		.module('app')
		.directive('bsSideBarLayout', BootstrapSideBarLayout.factory());
}
