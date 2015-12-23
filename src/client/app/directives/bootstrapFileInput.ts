/// <reference path="../../../../typings/tsd.d.ts" />

namespace app.directives {

	class BootstrapFileInput implements ng.IDirective {

		restrict: string = 'A';
		onChangeHandler: any;
		require: any = 'ngModel';

		scope: any = {
			ngModel: '='
		}

		constructor() {
		}

		link: ng.IDirectiveLinkFn = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
			// hide original
			element.hide();

			// markup for bootstrap  file input
			var elem = element.after(
				'<div>' +
				'<div class="input-group">' +
				'<span class="input-group-btn">' +
				'<button id="select" class="btn btn-secondary" type="button">Valitse</button>' +
				'<button id="clear" class="btn btn-danger" disabled type="button">Poista</button>' +
				'</span>' +
				'</div><br/>' +
				'<img id="preview" alt="Kuva" class="rounded" style="display:none; max-height:200px" />' +
				'</div>').next();
			// delegate click event to the original element
			elem.find('#select').bind('click', () => { element.click() });
			elem.find('#clear').bind('click', () => { this.setPreviewImage(elem, null) });

			// change event handling
			var onChangeHandler = scope.$parent.$eval(attrs['ngChange']);
			element.bind('change', (events: any) => {
				var files: FileList = events.target.files;
				elem.find('input').val(files.length > 0 ? files[0].name : '');
				scope['ngModel'] = files;
				scope.$apply();
				if (angular.isDefined(attrs['ngChange'])) {
					try {
						onChangeHandler(scope, { $event: events, files: files });
					}
					catch (err) {
						console.error(attrs['ngChange'] + ' undefined');
					}
				}
				this.setPreviewImage(elem, files);
			});
		}

		setPreviewImage(element: JQuery, files: FileList): void {
			if (files && files[0]) {
				var reader = new FileReader();
				reader.onload = (e: any) => {
					element.find('#preview').attr('src', e.target.result);
				}
				reader.readAsDataURL(files[0]);
				element.find('#clear').removeAttr('disabled');
				element.find('#preview').fadeIn(null, () => {
					$('html,body').animate({ scrollTop: element.find('#preview').offset().top });
				});
			}
			else {
				element.find('#clear').attr('disabled', '');
				element.find('#preview').fadeOut(null, () => {
					element.find('#preview').removeAttr('src');
				});
			}
		}

        public static factory(): ng.IDirectiveFactory {
            var ret = () => { return new BootstrapFileInput(); };
			return ret;
        }
	}

	angular
		.module('app')
		.directive('bsFileInput', BootstrapFileInput.factory());
}
