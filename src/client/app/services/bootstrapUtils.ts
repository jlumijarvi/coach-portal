/// <reference path="../../../../typings/tsd.d.ts" />

namespace app {

    export class BootstrapUtils {

        constructor() {
        }

        enableTooltips(element: ng.IAugmentedJQuery, opts?: TooltipOptions): void {
            $('#' + element[0].id).find('[data-toggle="tooltip"]').tooltip(opts);
        }
    }

    angular.module('app').service('bootstrapUtils', BootstrapUtils);
}
