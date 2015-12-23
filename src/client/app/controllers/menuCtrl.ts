/// <reference path="../../../../typings/tsd.d.ts" />


namespace app.controllers {

	export class Menu {
		title: string = 'Valinnat';
		isLoading: boolean = true;
		menuItems: app.models.MenuItem[] = [
			{ text: 'Toimintaympäristö', href: '/', faIcon: '', isActive: false },
			{ text: 'Henkilöt', href: '/addPerson', faIcon: 'fa-user-plus', isActive: false },
			{ text: 'Ryhmät', href: '/addGroup', faIcon: 'fa-users-plus', isActive: false }
		];

		static $inject = ['$scope'];
		constructor(private scope: ng.IScope) {
			this.isLoading = false;
			scope.$on('$routeChangeSuccess', (ev: any, current: any, prev: any) => {
				this.menuItems.forEach((it: models.MenuItem) => {
					it.isActive = (it.href == current.$$route.originalPath);
				});
			});
		}
	}

	angular
		.module('app')
		.controller('Menu', Menu);
}
