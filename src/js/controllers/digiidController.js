'use strict';

angular.module('copayApp.controllers').controller('digiidController', function($scope, $http, $stateParams, $state, digiidService) {
  $scope.uri = $stateParams.uri;
  $scope.address = $stateParams.address;
  var parser = getLocation($scope.uri);
  $scope.host = parser.host;

  function getLocation(href) {
    var match = href.match(/^(digiid?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
    return match && {
        href: href,
        protocol: match[1],
        host: match[2],
        hostname: match[3],
        port: match[4],
        pathname: match[5],
        search: match[6],
        hash: match[7]
    }
  }

  $scope.init = function() {
    digiidService.signMessage($scope.uri, function(err, signature, address) {
      var protocol = $scope.uri[$scope.uri.length - 1] === '1' ? 'http://' : 'https://';
      var url = protocol + $scope.uri.substring(9, $scope.uri.length);
      $http.post(url, { address: address, uri: $scope.uri, signature: signature })
        .then(function(resp) {
          $state.go('tabs.home').then(function() {
            $state.transitionTo('tabs.home.success', {
              uri: $scope.uri,
              host: $scope.host,
              address: address
            });
          });
        })
        .catch(function(err) {
          $state.go('tabs.home').then(function() {
            $state.transitionTo('tabs.home.failure', {
              uri: $scope.uri,
              host: $scope.host,
              address: address,
              status: err
            });
          });
        })
    });
  }

});
