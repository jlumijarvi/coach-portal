/// <reference path="../../../../typings/tsd.d.ts" />

namespace app {

    interface IAttributeResource extends ng.resource.IResource<app.models.Attribute> {
    }
    
    class API {
        public static attributes: string = 'attributes';
        public static persons: string = 'persons';
        public static groups: string = 'groups';
    }

    export class DataContext {

        public attributes: app.models.Attribute[];
        public persons: models.Person[];
        public groups: models.Group[];

        static $inject = ['$http', '$q'];
        constructor(private $http: ng.IHttpService,
            private $q: ng.IQService) {
        }

        // groups
        getGroup(id:any): ng.IPromise<models.Group> {
            return this.get(API.groups, id);
        }
        getGroups(forceRefresh?: boolean, params?: any): ng.IPromise<models.Group[]> {
            if (!forceRefresh && this.groups) { return this.$q.when(this.groups); }
            return this.query(API.groups, {}, '/app/data/groups.json')
        }
        createGroup(group: models.Group): ng.IPromise<models.Group> {
            return this.create(API.groups, group);
        }
        updateGroup(id:any, group: models.Group): ng.IPromise<models.Group> {
            return this.update(API.groups, id, group);
        }
        deleteGroup(id:any): any {
            return this.delete(API.groups, id);
        }

        // persons
        getPerson(id:any): ng.IPromise<models.Person> {
            return this.get(API.persons, id);
        }
        getPersons(forceRefresh?: boolean, params?: any): ng.IPromise<models.Person[]> {
            if (!forceRefresh && this.persons) { return this.$q.when(this.persons); }
            return this.query(API.persons, {}, '/app/data/persons.json')
        }
        createPerson(person: models.Person): ng.IPromise<models.Person> {
            return this.create(API.persons, person);
        }
        updatePerson(id:any, person: models.Person): ng.IPromise<models.Person> {
            return this.update(API.persons, id, person);
        }
        deletePerson(id:any): any {
            return this.delete(API.persons, id);
        }

        // attributes
        getAttributes(): ng.IPromise<app.models.Attribute[]> {
            return this.query('attributes', {}, '/app/data/attributes.json');
        }

        // http methods
        private query(api: string, params?: any, url?: string) {
            return this.$http.get(url || '/api/' + api).then((response: any): any => {
                this[api] = response.data;
                return this[api];
            });
        }
        private get(api: string, id: any) {
            return this.$http.get('/api/' + api + '/' + id).then((response: any): any => {
                var idx = _.indexOf(this[api], { id: id });
                this[api][idx] = response.data;
                return response;
            });
        }
        private create(api: string, item: any) {
            return this.$http.post('/api/' + api, item).then((response: any): any => {
                this[api].push(response.data);
                return response;
            });
        }
        private update(api: string, id: any, item: any) {
            return this.$http.put('/api/' + api + '/' + id, item).then((response: any): any => {
                var idx = _.indexOf(this[api], { id: id });
                this[api][idx] = response.data;
                return response;
            });
        }
        private delete(api: string, id: any) {
            return this.$http.delete('/api/' + api + '/' + id).then((response: any): any => {
                this[api] = _.filter(this['api'], (item: any) => { return id !== item.id });
                return response.data;
            });
        }
    }

    angular
        .module('app')
        .service('dataContext', DataContext);
}
