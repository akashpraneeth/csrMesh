angular.module('starter.controllers', [])
	
	.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
		
		// With the new view caching in Ionic, Controllers are only called
		// when they are recreated or on app start, instead of every page change.
		// To listen for when this page is active (for example, to refresh data),
		// listen for the $ionicView.enter event:
		//$scope.$on('$ionicView.enter', function(e) {
		//});
		
		// Form data for the login modal
		$scope.loginData = {};
		
		// Create the login modal that we will use later
		$ionicModal.fromTemplateUrl('templates/login.html', {
			scope: $scope
		}).then(function (modal) {
			$scope.modal = modal;
		});
		
		// Triggered in the login modal to close it
		$scope.closeLogin = function () {
			$scope.modal.hide();
		};
		
		// Open the login modal
		$scope.login = function () {
			$scope.modal.show();
		};
		
		// Perform the login action when the user submits the login form
		$scope.doLogin = function () {
			console.log('Doing login', $scope.loginData);
			
			// Simulate a login delay. Remove this and replace with your login
			// code if using a login system
			$timeout(function () {
				$scope.closeLogin();
			}, 1000);
		};
	})
	
	.controller('PlaylistsCtrl', function ($scope, $state) {
		$scope.playlists = [
			{title: 'Reggae', id: 1},
			{title: 'Chill', id: 2},
			{title: 'Dubstep', id: 3},
			{title: 'Indie', id: 4},
			{title: 'Rap', id: 5},
			{title: 'Cowbell', id: 6}
		];
		$scope.cordovaCall = function () {
			$state.go("app.search");
		}
	})
	
	.controller('PlaylistCtrl', function ($scope, $stateParams) {
		$scope.color = "yellow";
		$scope.Buttons = ["Is Bluetooth Enabled", "Is Channel Enabled", "Enable Channel", "Enable Bluetooth"];
		$scope.changeColor = function (clr) {
			console.log(clr);
			if (clr == 'callBlue') {
				window.MyCordovaPlugin.callBlue(function (res) {
					//window.alert(res);
					$scope.color = res;
				});
			} else if (clr == 'callRed') {
				window.MyCordovaPlugin.callRed(function (res) {
					//window.alert(res);
					$scope.color = res;
				});
			} else if (clr == 'callGreen') {
				window.MyCordovaPlugin.lightGetState(function (res) {
					//window.MyCordovaPlugin.callGreen(function (res) {
					//window.alert(res);
					$scope.color = res;
				}, function (err) {
					window.alert(err);
				});
			}
		};
		
		$scope.isChannelReady = function () {
			window.MyCordovaPlugin.isChannelReady(
				function (res) {
					if (res) {
						console.log("channel is Ready");
					} else {
						console.log("channel is not ready");
					}
				}, function (err) {
					window.alert(err);
				});
		};
		$scope.buttons = [
			{name: "Is Bluetooth Enabled"},
			{name: "Is Channel Enabled"},
			{name: "Enable Channel"},
			{name: "Enable Bluetooth"}
		];
		
		$scope.buttonFunctionality = function (index) {
			console.log(index);
			switch (index) {
				case 0 : {
					$scope.isBluetoothEnabled();
					break;
				}
				case 1 : {
					$scope.isChannelReady();
					break;
				}
				case 2 : {
					$scope.enableChannel();
					break;
				}
				case 3 : {
					$scope.enableBluetooth();
					break;
				}
				default: {
					break;
				}
			}
		};
		
		$scope.isBluetoothEnabled = function () {
			window.MyCordovaPlugin.isBluetoothEnabled(
				function (res) {
					if (res) {
						console.log("Bluetooth enabled");
					} else {
						console.log("Bluetooth not enabled.");
					}
				}, function (err) {
					window.alert(err);
				});
		};
		
		$scope.enableBluetooth = function () {
			window.MyCordovaPlugin.enableBluetooth(
				function (res) {
					if (res) {
						console.log("Bluetooth enabled");
					} else {
						console.log("Problem in enabling Bluetooth");
					}
				}, function (err) {
					window.alert(err);
				});
		};
		
		$scope.enableChannel = function () {
			window.MyCordovaPlugin.enableChannel(
				function (res) {
					if (res) {
						console.log("Channel enabled");
					} else {
						console.log("Problem in enabling channel.");
					}
				}, function (err) {
					window.alert(err);
				});
		};
	})
	
	.controller('searchCtrl', function ($scope, $state, $rootScope) {
		$scope.getUnpairedDevices = function () {
			window.MyCordovaPlugin.getUnpairedDevices(
				function (res) {
					if (res) {
						$scope.devices = res;
						console.log(res);
					} else {
						console.log("Problem occurred.");
					}
				}, function (err) {
					window.alert(err);
				});
		};
		
		$scope.checkData = function () {
			$scope.associateDevice();
		};
		
		$scope.associateDevice = function () {
			console.log($scope.devices);
			console.log("Associating Device");
			var deviceUUIDHASH31 = $scope.devices.discoveredList.UUIDHASH31;
			window.MyCordovaPlugin.associateDevice(deviceUUIDHASH31, function (res) {
					console.log("Associating Device");
					console.log(res);
					$rootScope.deviceId = res;
					$state.go("app.colors");
				},
				function (err) {
					console.log(err);
					console.log("Error in associating device");
				});
		};
		$scope.getUnpairedDevices();
	})
	
	
	.controller('bleCtrl', function ($scope) {
		function initializeBluetooth() {
			window.bluetoothle.initialize({request: true}).then(null,
				function (obj) {
					window.alert("error occured");
					window.alert(obj);
					//Handle errors
				},
				function (obj) {
					window.alert("Bluetooth switched on successfully");
					window.alert(obj);
					//Handle successes
				}
			);
		}
		
		initializeBluetooth();
		
	})
	
	.controller('colorCtrl', function ($scope, $rootScope) {
		$scope.colors = [
			{colorName: "Red", background: "#FF0000", color: "#FFFFFF", hex: "#FF0000"},
			{colorName: "Blue", background: "#0000FF", color: "#FFFFFF", hex: "#0000FF"},
			{colorName: "Green", background: "#008000", color: "#FFFFFF", hex: "#008000"}
		];
		
		$scope.setOtherBackgroundColors = function (index) {
			for (var i = 0; i < $scope.colors.length; i++) {
				if (i != index) {
					var tempColor1 = angular.copy($scope.colors[index].background);
					$scope.colors[index].background = angular.copy($scope.colors[index].color);
					$scope.colors[index].color = tempColor1;
				}
			}
		};
		
		$scope.setRgb = function (index) {
			console.log(index);
			var tempColor = angular.copy($scope.colors[index].background);
			$scope.colors[index].background = angular.copy($scope.colors[index].color);
			$scope.colors[index].color = tempColor;
			$scope.setOtherBackgroundColors(index);
			
			
			window.MyCordovaPlugin.setRgb($rootScope.deviceId, $scope.colors[index].hex, function (res) {
				console.log(res);
			}, function (err) {
				console.log(err);
			})
		}
		
		
	});
