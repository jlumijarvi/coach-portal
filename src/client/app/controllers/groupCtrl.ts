/// <reference path="../../../../typings/tsd.d.ts" />

namespace app.controllers {

	export class GroupController {
		public logoFiles: FileList;
		public action: string = 'Lisää';

		static $inject = ['$scope'];
		constructor(private $scope: ng.IScope) {
		}
		
		logoChanged(e, data): void {
		}
	}

	angular
		.module('app')
		.controller('GroupController', GroupController);
}
