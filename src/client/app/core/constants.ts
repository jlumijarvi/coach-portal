/// <reference path="../../../../typings/tsd.d.ts" />

namespace app {

    var months_fi_fi = [
        'tammikuu',
        'helmikuu',
        'maaliskuu',
        'huhtikuu',
        'toukokuu',
        'kesäkuu',
        'heinäkuu',
        'elokuu',
        'syyskuu',
        'lokakuu',
        'marraskuu',
        'joulukuu'];

    angular.module('app').constant('monthLocales', {
        'months_fi-fi': months_fi_fi
    });
}
