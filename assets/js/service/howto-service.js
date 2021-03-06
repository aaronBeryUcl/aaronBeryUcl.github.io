(function() {
    'use strict';

    howToService.$inject = ['$http'];

    angular
        .module('howToApp')
        .service('howToService',howToService);

    function howToService($http) {
        var fbInstance = "search2";
        var angularCallback = "&callback=JSON_CALLBACK";
        var currentCollection = "isd-howto";

        var service = {
            getHowTos: getHowTos
            ,getSuggestions: getSuggestions
        };

        return service;
        
        function getSuggestions(vm) {
          var fbUrl = buildFbUrl(vm,'suggest');

          return $http.jsonp(fbUrl).success(
            function(data, status, headers, config) {
              // this callback will be called asynchronously
              // when the response is available
              return data;
            }).
            error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            });
        }

        function getHowTos(vm) {
          var fbUrl = buildFbUrl(vm);

          return $http.jsonp(fbUrl).success(
            function(data, status, headers, config) {
              // this callback will be called asynchronously
              // when the response is available
              return data;
            }).
            error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            });
        }

        /* Private Methods
        ----------------------------------------------------------------------*/
        function buildFbUrl(vm,callType) {
          var callTypeStr
            ,queryParamStr
            ,searchExtraParams;

          if(typeof callType !== 'undefined' && callType === 'suggest'){
            callTypeStr = callType;
            queryParamStr = 'partial_query';
            searchExtraParams = '&show=5&fmt=json++';
          }else {
            callTypeStr = 'search';
            queryParamStr = 'query';
            searchExtraParams = getMetaParams(vm.upi) + buildFacetsQryStr(vm.selectedFacets) + getStartRank(vm.currentPage,vm.numRanks);
          }

          return "//" + fbInstance + ".ucl.ac.uk/s/" + callTypeStr + ".json?collection=" + currentCollection + "&" + queryParamStr + "=" + sanitizeQuery(vm.query) + searchExtraParams + angularCallback;
        }

        function buildFacetsQryStr(selectedFacets) {
            var str = '';
            angular.forEach(selectedFacets, function(x,i) {
                str += "&" + x.queryStringParam;
            });
            return str;
        }
        function getStartRank(currentPage,numRanks) {
            return "&start_rank=" + ((currentPage*numRanks) + 1);
        }
        function getMetaParams(upi) {
            if(typeof upi !=='undefined' && upi.length) {
                return "&meta_V_sand=" + upi;
            }else{
                return "";
            }
        }
        function sanitizeQuery(str) {
          if(!str.length)str = '!padrenullquery';

          return str;
        }
    }
})();
