;(function() {
  'use strict'

  var Graph = {

    chartEl: '#js-Chart',
    introEl: '#js-Intro',
    footerEl: '#js-Footer',

    init: function() {
      this.$chartEl = $(this.chartEl);
      this.i18n = this.$chartEl.data('i18n');
      if(this.$chartEl.length > 0){
        google.charts.load('current', {
          'packages': ['corechart']
        });
        google.charts.setOnLoadCallback($.proxy(this.drawCharts, this));
      }
    },

    drawCharts: function() {
      var intro = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1B37J7fFTokDZ3J3hX4zIm4YhGy5tR6WfKt6RRIfugcE/gviz/tq?gid=0&range=B2');
      var footer = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1B37J7fFTokDZ3J3hX4zIm4YhGy5tR6WfKt6RRIfugcE/gviz/tq?gid=0&range=B6');
      var query = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1B37J7fFTokDZ3J3hX4zIm4YhGy5tR6WfKt6RRIfugcE/gviz/tq?gid=0&range=B9:F14');
      intro.send($.proxy(this.handleIntroResponse, this));
      footer.send($.proxy(this.handleFooterResponse, this));
      query.send($.proxy(this.handleChartResponse, this));
    },

    handleIntroResponse: function(response){
      var resp = response.getDataTable();
      $(this.introEl).text(resp.getValue(0, 0));
    },

    handleFooterResponse: function(response){
      var resp = response.getDataTable();
      $(this.footerEl).text(resp.getValue(0, 0));
    },

    handleChartResponse: function(response){
      var resp = response.getDataTable();
      this.addRows(resp);
    },

    addRows: function(resp) {
      for(var i=0; i<resp.getNumberOfRows();i++){
        var $el = $('<div/>')
                    .append('<h2 class="heading-medium">'+resp.getValue(i, 0)+'</h2>')
                    .append('<p>'+resp.getValue(i, 1)+'</p>')
                    .appendTo(this.$chartEl);
        this.addChart(resp, i, $el);
      }
    },

    addChart: function(resp, row, $el){
      for(var i=3; i<resp.getNumberOfColumns();i++){
        var $graphEl = $('<div/>').addClass('column').appendTo(this.$chartEl);

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