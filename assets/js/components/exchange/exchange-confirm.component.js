angular
  .module('walletApp')
  .component('exchangeConfirm', {
    bindings: {
      type: '<',
      quote: '<',
      details: '<',
      namespace: '<',
      onCancel: '&',
      onSuccess: '&',
      handleTrade: '&',
      handleQuote: '&',
      onExpiration: '&'
    },
    templateUrl: 'templates/exchange/confirm.pug',
    controller: ExchangeConfirmController,
    controllerAs: '$ctrl'
  });

function ExchangeConfirmController (Env, AngularHelper, $scope, $rootScope, $timeout, $q, Alerts, currency, Wallet, MyWalletHelpers, Exchange) {
  $scope.type = '.' + this.type;
  $scope.tradeState = '.confirm';
  $scope.namespace = this.namespace;

  $scope.getTimeToExpiration = () => this.quote.expiresAt - new Date();
  $scope.onExpiration = () => { $scope.lock(); this.quote = null; this.onExpiration().then($scope.free); };

  $scope.trade = () => {
    $scope.lock();
    let quote = this.quote;

    this.handleTrade({quote: quote})
      .then(this.onSuccess)
      .catch((err) => { Alerts.displayError(Exchange.interpretError(err)); this.onCancel(); })
      .finally($scope.free);
  };

  AngularHelper.installLock.call($scope);
  Env.then(env => $scope.qaDebugger = env.qaDebugger);
}
