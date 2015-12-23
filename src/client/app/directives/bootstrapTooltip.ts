/// <reference path="../../../../typings/tsd.d.ts" />

namespace app.directives {

	class BootstrapTooltip implements ng.IDirective {

		restrict: string = 'A';
		scope: any = true;
		bowser: BowserModule.IBowser = window['bowser'];

		constructor() {
		}

		link: ng.IDirectiveLinkFn = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
			element.attr('title', attrs['bsTooltip']);
			var opts = element.attr('tooltip-options') || {};
			var type = element.attr('tooltip-type');
			if (!this.bowser.firefox) { // is not working with firefox
				if (angular.isDefined(type)) {
					var template = _.template('<div class="tooltip tooltip-<%= type %> top" role="tooltip">' +
						'<div class="tooltip-arrow tooltip-<%= type %>"></div>' +
						'<div class="tooltip-inner">' +
						'</div>' +
						'</div>');
					opts['template'] = template({type: type});
					opts['placement'] = 'right';
				}
				element.tooltip(opts);
			}
		}

        public static factory(): ng.IDirectiveFactory {
            var ret = () => { return new BootstrapTooltip(); };
			return ret;
        }
	}

	angular
		.module('app')
		.directive('bsTooltip', BootstrapTooltip.factory());
}
