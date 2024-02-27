
import React, { useEffect, useLayoutEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5stock from "@amcharts/amcharts5/stock";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

function StockChartComponent() {
    const [root, setRoot] = useState(null);

  useLayoutEffect(() => { 
    if (!root) {
      const newRoot = am5.Root.new("chartdiv");

      // Set themes
      newRoot.setThemes([am5themes_Animated.new(newRoot)]);

      // Create a stock chart
      const stockChart = newRoot.container.children.push(
        am5stock.StockChart.new(newRoot, {})
      );

      // Set global number format
      newRoot.numberFormatter.set("numberFormat", "#,###.00");

      // Main (value) panel

      // Create a main stock panel (chart)
      const mainPanel = stockChart.panels.push(
        am5stock.StockPanel.new(newRoot, {
          wheelY: "zoomX",
          panX: true,
          panY: true,
          height: am5.percent(70)
        })
      );

      // Create axes
      const valueAxis = mainPanel.yAxes.push(
        am5xy.ValueAxis.new(newRoot, {
          renderer: am5xy.AxisRendererY.new(newRoot, {
            pan: "zoom"
          }),
          tooltip: am5.Tooltip.new(newRoot, {}),
          numberFormat: "#,###.00",
          extraTooltipPrecision: 2
        })
      );

      const dateAxis = mainPanel.xAxes.push(
        am5xy.GaplessDateAxis.new(newRoot, {
          baseInterval: {
            timeUnit: "day",
            count: 1
          },
          groupData: true,
          renderer: am5xy.AxisRendererX.new(newRoot, {}),
          tooltip: am5.Tooltip.new(newRoot, {})
        })
      );

      // Add series
      const valueSeries = mainPanel.series.push(
        am5xy.CandlestickSeries.new(newRoot, {
          name: "MSFT",
          valueXField: "Date",
          valueYField: "Close",
          highValueYField: "High",
          lowValueYField: "Low",
          openValueYField: "Open",
          calculateAggregates: true,
          xAxis: dateAxis,
          yAxis: valueAxis,
          legendValueText: "{valueY}"
        })
      );

      // Set main value series
      stockChart.set("stockSeries", valueSeries);

      // Add a stock legend
      const valueLegend = mainPanel.plotContainer.children.push(
        am5stock.StockLegend.new(newRoot, {
          stockChart: stockChart
        })
      );
      valueLegend.data.setAll([valueSeries]);

      // Add cursor(s)
      mainPanel.set(
        "cursor",
        am5xy.XYCursor.new(newRoot, {
          yAxis: valueAxis,
          xAxis: dateAxis,
          snapToSeries: [valueSeries],
          snapToSeriesBy: "y!"
        })
      );

      // Add scrollbar
      const scrollbar = mainPanel.set(
        "scrollbarX",
        am5xy.XYChartScrollbar.new(newRoot, {
          orientation: "horizontal",
          height: 50
        })
      );
      stockChart.toolsContainer.children.push(scrollbar);

      const sbDateAxis = scrollbar.chart.xAxes.push(
        am5xy.GaplessDateAxis.new(newRoot, {
          baseInterval: {
            timeUnit: "day",
            count: 1
          },
          renderer: am5xy.AxisRendererX.new(newRoot, {})
        })
      );

      const sbValueAxis = scrollbar.chart.yAxes.push(
        am5xy.ValueAxis.new(newRoot, {
          renderer: am5xy.AxisRendererY.new(newRoot, {})
        })
      );

      const sbSeries = scrollbar.chart.series.push(
        am5xy.LineSeries.new(newRoot, {
          valueYField: "Close",
          valueXField: "Date",
          xAxis: sbDateAxis,
          yAxis: sbValueAxis
        })
      );

      sbSeries.fills.template.setAll({
        visible: true,
        fillOpacity: 0.3
      });

      // Function that dynamically loads data
      function loadData(ticker, series) {
        // Load external data
        am5.net
          .load(
            "https://www.amcharts.com/wp-content/uploads/assets/docs/stock/" +
              ticker +
              ".csv"
          )
          .then(function (result) {
            // Parse loaded data
            var data = am5.CSVParser.parse(result.response, {
              delimiter: ",",
              skipEmpty: true,
              useColumnNames: true
            });
            
            console.log(data);
            // Process data (convert dates and values)
            var processor = am5.DataProcessor.new(newRoot, {
              dateFields: ["Date"],
              dateFormat: "yyyy-MM-dd",
              numericFields: [
                "Open",
                "High",
                "Low",
                "Close",
                "Adj Close",
                "Volume"
              ]
            });
            processor.processMany(data);

            // Set data
            am5.array.each(series, function (item) {
              item.data.setAll(data);
            });
          });
      }

      // Load initial data for the first series
      loadData("MSFT", [valueSeries, sbSeries]);

      // Stock toolbar
      const toolbar = am5stock.StockToolbar.new(newRoot, {
        container: document.getElementById("chartcontrols"),
        stockChart: stockChart,
        controls: [
          am5stock.IndicatorControl.new(newRoot, {
            stockChart: stockChart,
            legend: valueLegend
          }),
          am5stock.DateRangeSelector.new(newRoot, {
            stockChart: stockChart
          }),
          am5stock.PeriodSelector.new(newRoot, {
            stockChart: stockChart
          }),
          am5stock.DrawingControl.new(newRoot, {
            stockChart: stockChart
          }),
          am5stock.ResetControl.new(newRoot, {
            stockChart: stockChart
          }),
          am5stock.SettingsControl.new(newRoot, {
            stockChart: stockChart
          })
        ]
      });

      setRoot(newRoot);
    }

    return () => {
      if (root) {
        root.dispose();
      }
    };
  }, [root]);

  return (
 <>
      <div
        id="chartcontrols"
        style={{ height: "auto", padding: "5px 45px 0 15px" }}
      ></div>
      <div id="chartdiv" style={{ width: "100%", height: "84vh" }}></div>
    </>
  )
}

export default StockChartComponent