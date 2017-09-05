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
      var query = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1B37J7fFTokDZ3J3hX4zIm4YhGy5tR6WfKt6RRIfugcE/gviz/tq?gid=0&range=B7:F12');
      query.send($.proxy(this.handleQueryResponse, this));
    },

    handleQueryResponse: function(response){
      var resp = response.getDataTable();

      for(var i=0; i<resp.getNumberOfRows();i++){
        var $el = $('<div/>')
                    .append('<h2 class="heading-medium">'+resp.getValue(i, 0)+'</h2>')
                    .append('<p>'+resp.getValue(i, 1)+'</p>')
                    .appendTo(this.$el);
        this.addChart(resp, i, $el);
      }

    },

    addChart: function(resp, row, $el){
      for(var i=3; i<resp.getNumberOfColumns();i++){
        var $graphEl = $('<div/>').addClass('column').appendTo(this.$el);

        var data = new google.visualization.DataTable(),
          options = {
            'chartArea': {
              'height': 300
            },
            'enableInteractivity': false,
            'height': 350,
            'legend': 'none',
            'pieHole': 0.6,
            'slices': {0: {'color': '#005EA5'}, 1: {'color': '#28A197', 'textStyle': {'color': '#28A197'}}},
            'title': resp.getColumnLabel(i)
          };

        data.addColumn('string', 'Property');
        data.addColumn('number', 'Value');
        data.addRows([
          [resp.getColumnLabel(i), resp.getValue(row,i)],
          ['Other', (1 - resp.getValue(row,i))]
        ]);

        var chart = new google.visualization.PieChart($graphEl[0]);
        chart.draw(data, options);
      }
    }

  };

  Graph.init();
})()