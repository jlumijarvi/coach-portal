/// <reference path="../../../../typings/tsd.d.ts" />

namespace app.models {

	export class Attribute {
		constructor(public name: string, public options: app.models.Option[]) {
		}
	}
}
