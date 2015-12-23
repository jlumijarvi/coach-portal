/// <reference path="../../../../typings/tsd.d.ts" />

namespace app.controllers {

	export class PersonController {
		public files: FileList;
		public person: any;

		static $inject = ['$scope', 'notie'];
		constructor(private $scope: ng.IScope, private notie: app.Notie) {
		}

		filesChanged(e, data): void {
		}

		submit(): void {
			this.notie.alert('Tallennettu onnistuneesti', NotieStyle.success);
			this.person = null;
		}
	}

	angular
		.module('app')
		.controller('PersonController', PersonController);
}
