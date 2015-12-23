/// <reference path="../../../../typings/tsd.d.ts" />

namespace app {

	export enum NotieStyle {
		success = 1,
		warning = 2,
		error = 3,
		info = 4
	}

    export class Notie {
		
		notie: any = window['notie'];
		defaultSeconds: number = 2.5;
		defaultStyle: number = NotieStyle.info;

        constructor() {
        }

        alert(message: string, style?: number, seconds?: number) {
			this.notie.alert(style || this.defaultStyle, message, seconds || this.defaultSeconds);
		}
		confirm(title: string, acceptText: string, cancelText: string, cb: any) {
			if (!angular.isFunction(cb)) {
				throw new Error('cb not a function');
			}
			this.notie.confirm(title, acceptText, cancelText, cb);
		}
		input(title:string, submitText: string, cancelText: string, type: string, placeholder: string, cb: any, prefilledValue?: string) {
			if (!angular.isFunction(cb)) {
				throw new Error('cb not a function');
			}
			this.notie.input(title, submitText, cancelText, type, placeholder, cb, prefilledValue);
		}
    }

    angular.module('app').service('notie', Notie);
}
