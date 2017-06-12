
(function (){
  'use strict'
  angular.module('NarrowItDownApp',[])
        .controller('NarrowItDownController',NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .directive('foundItems', FoundItemsDirective);

    NarrowItDownController.$inject = ['MenuSearchService','$scope'];
    var foundItems = [];
    function NarrowItDownController(MenuSearchService, $scope){
      var menu = this;
      var searchParam = "";



        $scope.getMatchedMenuItems = function(){
          searchParam = $scope.searchTerm == 'undefined' ? "" : $scope.searchTerm;

          if(searchParam == "" || typeof(searchParam) == 'undefined')
          {
            menu.MenuItems = [];
            menu.NoDataFoundMessage = "Nothing Found! Please Enter Search Value.";
          }
          else {
            searchParam = $scope.searchTerm.toLowerCase();
            menu.NoDataFoundMessage = "";
            var promise = MenuSearchService.getMatchedMenuItems();
            promise.then(function(response){
            console.log("Inside If");
            foundItems = [];
            for ( var i = 0 ; i < response.data.menu_items.length ; i++ )
            {
              if ( response.data.menu_items[i].description.toLowerCase().indexOf(searchParam) !== -1 ) {
                  foundItems.push( response.data.menu_items[i] );
                }
            }
            menu.NoDataFoundMessage = foundItems.length == 0 ? "Nothing Found" : "";
            menu.MenuItems = foundItems;
          })
          .catch(function (error) {
                console.log("Error: " + error);
                console.log("Error while retrieving the data.");
            });

        }
      }

      menu.removeItem = function(itemIndex){
        menu.MenuItems.splice(itemIndex,1);
      }
    }


    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http){
      var service = this;

      service.getMatchedMenuItems = function(){
        var response = $http({
          method: "GET",
          url: ("https://davids-restaurant.herokuapp.com/menu_items.json")
        })

        return response;
      }
    }

    function FoundItemsDirective(){
      var ddo = {
        templateUrl: 'FoundMenuItems.html',
        scope: {
            menuItems: '<',
            onRemove: '&'
        },
        controller: NarrowItDownController,
        controllerAs: 'menu',
        bindToController: true
      }

      return ddo;
    }
})();
