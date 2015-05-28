/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @fileoverview QueryDatasourceDirective encapsulates HTML, style and behavior
 *     for widget query filters.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.query.QueryDatasourceDirective');

goog.require('p3rf.perfkit.explorer.components.config.ConfigService');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');


goog.scope(function() {
var explorer = p3rf.perfkit.explorer;
var ConfigService = explorer.components.config.ConfigService;
var DashboardService = explorer.components.dashboard.DashboardService;

/**
 * See module docstring for more information about purpose and usage.
 *
 * @return {Object} Directive definition object.
 */
explorer.components.widget.query.QueryDatasourceDirective = function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: false,
    scope: {
      /** @type {!ChartWidgetModel} */
      'ngModel': '='
    },
    templateUrl: '/static/components/widget/query/query-datasource-directive.html',
    controller: function($scope, configService, dashboardService) {
      /** @export {!ConfigService} */
      $scope.configSvc = configService;

      /** @export {!DashboardService} */
      $scope.dashboardSvc = dashboardService;
    }
  };
};

});  // goog.scope
