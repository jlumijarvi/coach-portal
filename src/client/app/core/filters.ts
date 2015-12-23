/// <reference path="../../../../typings/tsd.d.ts" />

namespace app.filters {

  angular.module('app').filter('range', () => {
    return (input: Array<number>, total: string) => {
      var totalInt = parseInt(total);

      for (var i = 0; i < totalInt; i++) {
        input.push(i);
      }

      return input;
    };
  });
}
