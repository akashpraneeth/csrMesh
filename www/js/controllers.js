angular.module('starter.controllers', [])

	.controller('DashCtrl', ["$scope", "ionicToast",
		function ($scope, ionicToast) {
			function checkBluetooth() {
				window.CsrMeshPlugin.isBluetoothEnabled(
					function (res) {
						if (res) {
							ionicToast.show("Bluetooth enabled", 'bottom', false, 2000);
						} else {
						  ionicToast.show("Bluetooth not enabled", 'bottom', false, 2000);
						}
					}, function (err) {
						window.alert(err);
					});
			}

			function enableBluetooth() {
				window.CsrMeshPlugin.enableBluetooth(
					function (res) {
						if (res) {
						  ionicToast.show("Bluetooth enabled", 'bottom', false, 2000);
						} else {
							ionicToast.show("Problem in enabling Bluetooth", 'bottom', false, 2000);
						}
					}, function (err) {
						window.alert(err);
					});
			}

			function enableChannel() {
				window.CsrMeshPlugin.enableChannel(
					function (res) {
						if (res) {
							ionicToast.show("Channel enabled", 'bottom', false, 2000);
						} else {
							ionicToast.show("Problem in enabling channel.", 'bottom', false, 2000);
						}
					}, function (err) {
						window.alert(err);
					});
			}


			function checkChannel() {
				window.CsrMeshPlugin.isChannelReady(
					function (res) {
						if (res) {
							ionicToast.show("channel is Ready", 'bottom', false, 2000);
						} else {
						  ionicToast.show("channel is not ready", 'bottom', false, 2000);
						}
					}, function (err) {
						window.alert(err);
					});
			}

			$scope.triggerEvent = function (type, event) {
				if (event == "enable") {
					ionicToast.show('Enabling ' + type, 'bottom', false, 2000);
				}

				if (type == "bluetooth") {
					switch (event) {
						case "enable": {
							enableBluetooth();
							break;
						}

						case "check": {
							checkBluetooth();
						}
					}
				} else if (type == "channel") {
					switch (event) {
						case "enable": {
							enableChannel();
							break;
						}

						case "check": {
							checkChannel();
						}
					}
				}
			}
		}])

	.controller('DeviceListCtrl', ["$scope", "CSRService", "ionicToast",
		function ($scope, CSRService, ionicToast) {
			var associatedDevices = CSRService.getAssociatedDevices();

			$scope.devices = [];

			function checkChannel(success, error) {
				window.CsrMeshPlugin.isChannelReady(
					function (res) {
						if (res) {
							success(true);
						} else {
							error(false);
						}
					}, function (err) {
						error(false);
					});
			}

			function checkIfDeviceIsAlreadyAssociated(UUIDHASH31) {
				for (var i = 0; i < associatedDevices.length; i++) {
					if (associatedDevices[i].UUIDHASH31 == UUIDHASH31) {
						return true;
					}
				}
				return false;
			}

			$scope.startScan = function () {
				checkChannel(function (success) {
					window.CsrMeshPlugin.startScan(
						function (res) {
							$scope.$broadcast("device.detected", {"deviceData": res});
						}, function (err) {
							window.alert(err);
						});
				}, function (failure) {
					ionicToast.show('Please wait until channel is ready', 'bottom', false, 2000);
				});
			};

			$scope.associateDevice = function (index) {
			console.log("device Associated");
				var deviceToAssociate = $scope.devices[index];
				window.CsrMeshPlugin.associateDevice(deviceToAssociate.UUIDHASH31, function (deviceId) {
						var associatedDevice = deviceToAssociate;
						associatedDevice.deviceId = deviceId;
						CSRService.setAssociatedDevices(associatedDevice);
						$scope.devices.splice(index, 1);
						ionicToast.show("device associated.", 'bottom', false, 2000);
						$state.go("app.associatedDevices");
					},
					function (err) {
						console.log(err);
						console.log("Error in associating device");
					});
			};

			$scope.$on("device.detected", function (event, args) {
				var device = args.deviceData;
				var deviceExists = false;
				for (var i = 0; i < $scope.devices.length; i++) {
					if ($scope.devices[i].UUIDHASH31 == device.UUIDHASH31 || checkIfDeviceIsAlreadyAssociated(device.UUIDHASH31)) {
						deviceExists = true;
						break;
					}
				}
				if (!deviceExists) {
					$scope.devices.push(device);
				}
			});
			 $scope.startScan();
		}])

	.controller('AssociatedDeviceListCtrl', ["$scope", "CSRService",
		function ($scope, CSRService) {
			function getAssociatedDevices() {
				 $scope.associatedDevices = CSRService.getAssociatedDevices();
			}
			getAssociatedDevices();
		}])

	.controller('DeviceDetailCtrl', function ($scope, $stateParams, CSRService) {
		var deviceId = $stateParams.deviceId;
		$scope.device = CSRService.getDeviceDetailsByDeviceId(deviceId);
		if(!$scope.device.ledColor){
		$scope.device.ledColor = "#5dafde";
		}

		$scope.setRgb = function () {
			window.CsrMeshPlugin.setRgb($scope.device.deviceId, $scope.device.ledColor, function (res) {
				CSRService.setDetailsWithColor($scope.device);
				console.log(res);
			}, function (err) {
				console.log(err);
			})
		};


	});
