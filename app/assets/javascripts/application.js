;(function() {
  'use strict'

  var Graph = {

    el: '.js-Diversity',

    init: function() {
      this.$el = $(this.el);
      this.i18n = this.$el.data('i18n');
      if(this.$el.length > 0){
        google.charts.load('current', {
          'packages': ['corechart']
        });
        google.charts.setOnLoadCallback($.proxy(this.drawCharts, this));
      }
    },

    drawCharts: function() {
      var query = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1B37J7fFTokDZ3J3hX4zIm4YhGy5tR6WfKt6RRIfugcE/gviz/tq?gid=0&range=B7:E12');
      query.send($.proxy(this.handleQueryResponse, this));
    },

    handleQueryResponse: function(response){
      var data = response.getDataTable(),
        options = {
          'chartArea': {
            'height': 800
          },
          'height': 900,
          'legend': { 'position': 'top'},
          'isStacked': true,
          'hAxis': {
            'textPosition': 'none',
          }
        };

      var chart = new google.visualization.BarChart(this.$el[0]);
      chart.draw(data, options);
    }
  };

  Graph.init();
})()