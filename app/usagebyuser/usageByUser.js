/*
 *    Copyright (C) 2010 - 2018 VREM Software Development <VREMSoftwareDevelopment@gmail.com>
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
angular.module('BWMonApp.UsageByUser', ['ngRoute'])
.config(function($routeProvider) {
	$routeProvider.when('/UsageByUser', {
		templateUrl: 'usagebyuser/usageByUser.tpl.html',
		controller: 'UsageByUserController',
		controllerAs: 'usageByUserCtrl'
	});
})
.controller('UsageByUserController', function($scope, dataService, chartService) {
	var ctrl = this,
		reset = function() {
			ctrl.selected.user = '';
			ctrl.predicate = 'IP';
			ctrl.descending = false;
		},
		findUserData = function(value) {
			var result;
			if (value % 1 === 0) {
				result = _.find(ctrl.data, function(item) {
					return value === item.id;
				});
			}
			return result;
		};

	ctrl.setOrder = function(predicate) {
		ctrl.descending = (ctrl.predicate === predicate) ? !ctrl.descending : false;
		ctrl.predicate = predicate;
	};
	
	ctrl.getOrder = function(predicate) {
		return ctrl.predicate === predicate ? (ctrl.descending ? {desc:true} : {asc: true}): {};
	};

	ctrl.getLabel = function(value) {
		var result = '',
			item = findUserData(value); 
		if (typeof item !== 'undefined' && item !== null) {
			result = item.IP;
		}
		return result;
	};
	
	ctrl.getTooltip = function(value) {
		var result = '',
			item = findUserData(value); 
		if (typeof item !== 'undefined' && item !== null) {
			result = item.IP + " | " + item.MAC + " | " + item.user;
		}
		return result;
	};

	$scope.$watch('usageByUserCtrl.selected.year', function() {
		reset();
		ctrl.selected.month = dataService.getMonths(ctrl.selected.year)[0];
	}, true);

	$scope.$watch('usageByUserCtrl.selected.month', function() {
		reset();
	}, true);
	
	$scope.$watch('usageByUserCtrl.selected', function() {
		var usageData = dataService.getUsageByUser(ctrl.selected.year, ctrl.selected.month, ctrl.selected.user);
		
		ctrl.data = usageData.data.usage;
		ctrl.total = usageData.data.total;
		ctrl.chartData = chartService.getChartData(usageData.data.usage);
		ctrl.chartOptions = chartService.getChartOptions(ctrl.getLabel, ctrl.getTooltip);
		ctrl.chartOptions.series[0].type = ctrl.selected.chartType;
	}, true);
	
	ctrl.selected = {
		year: dataService.getYears()[0],
		chartType: chartService.getChartTypes()[0]
	};
	ctrl.pageSize = 15;
	reset();
	
})
;
