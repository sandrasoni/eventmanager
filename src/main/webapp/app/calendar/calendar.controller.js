'use strict';

angular.module('eventmanagerApp')
    .controller('CalendarController', function ($scope, $filter, $state, $compile, $log, uiCalendarConfig, DateUtils, CalendarService) {

        $scope.eventSource = function getEvents(start, end, timezone, callback) {
            // start and end are for displayed calendar, so see if end is in current month before subtracting a month
            var date = end;
            var endOfMonth = moment(end).endOf('month');
            if (endOfMonth.diff(date, 'days') > 0) {
                date = end.subtract({months: 1});
            }
            date = date.format('YYYY-MM');
            $log.info("Fetching data for this date: " + date);
            $scope.events = [];

            CalendarService.query({month: date}, function (data) {

                data.forEach(function (invitation) {

                    invitation.event.date = $filter('date')(invitation.event.date, "dd-MM-yyyy hh:mm");
                    invitation.date = $filter('date')(invitation.date, "dd-MM-yyyy hh:mm");

                    // vezi conversia asta de data...
                    var evtDate = '2016-04-25 15:00';

                    $log.info(invitation.event.name + " " + invitation.event.location + " " + invitation.event.date + " " + invitation.date);

                    $scope.events.push({
                        id: invitation.id,
                        title: invitation.event.name,
                        tooltip: invitation.event.location,
                        type: 'points',
                        start: evtDate,
                        allDay: false,
                        className: ['label label-primary']
                    });
                });

                $log.info(JSON.stringify($scope.events));
                callback($scope.events);
            });
        };

        $scope.onEventClick = function (date, jsEvent, view) {
            $state.go('history.' + date.type, {id: date.id});
        };

        /* Change View */
        $scope.changeView = function (view, calendar) {
            uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
        };

        /* Change View */
        $scope.renderCalender = function (calendar) {
            if (uiCalendarConfig.calendars[calendar]) {
                uiCalendarConfig.calendars[calendar].fullCalendar('render');
            }
        };

        /* Render Tooltip */
        $scope.eventRender = function (event, element, view) {
            var tooltip = (event.tooltip) ? event.tooltip : event.title;
            element.attr({
                'tooltip': tooltip,
                'tooltip-append-to-body': true
            });
            $compile(element)($scope);
        };

        /* config object */
        $scope.uiConfig = {
            calendar: {
                editable: false,
                header: {
                    left: 'month agendaWeek agendaDay',
                    center: 'title',
                    right: 'today prev,next'
                },
                eventClick: $scope.onEventClick,
                eventRender: $scope.eventRender
            }
        };

        $scope.eventSources = [$scope.eventSource];
    });
