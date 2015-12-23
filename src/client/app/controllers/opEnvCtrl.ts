/// <reference path="../../../../typings/tsd.d.ts" />


namespace app.controllers {

	export class OpEnvController {
		title: string = 'Valmentajan toimintaympäristö';
		attributes: app.models.Attribute[];

		static $inject = ['dataContext'];
		constructor(private dataContext: app.DataContext) {
			this.dataContext.getAttributes().then((data: any) => {
				this.attributes = data;
			});
		}

		toggleSelected(attribute: app.models.Attribute, option: app.models.Option): void {
			attribute.options.forEach((opt: models.Option) => {
				opt.isSelected = (option == opt) && !opt.isSelected;
			});
		}

		hasSelections(attribute: app.models.Attribute): boolean {
			var ret = _.some(attribute.options, (it: models.Option) => {
				return it.isSelected;
			});
			console.log(ret);
			return ret;
		}
	}

	angular.module('app').controller('OpEnvController', OpEnvController);
}
