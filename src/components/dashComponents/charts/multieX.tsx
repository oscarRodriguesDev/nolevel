'use client'
import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';

export default function MultiAxisChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    const options = {
      chart: {
        height: '400px',
        type: 'line',
      },
      series: [
        {
          name: 'ANO 1',
          type: 'line',
          data: [30, 40, 45, 50, 49, 60, 70, 91, 125],
        },
        {
          name: 'ANO 2',
          type: 'line',
          data: [60, 50, 55, 40, 39, 50, 60, 81, 105],
          yAxisIndex: 1, // Associando à segundo eixo Y
        },
      ],
      options: {
        chart: {
          zoom: {
            enabled: false,
          },
        },
        colors: ['#008FFB', '#FF5733'],
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: [5, 7],
          curve: 'straight',
          dashArray: [0, 5],
        },
        title: {
          text: 'Gráfico Multieixo',
          align: 'left',
        },
        markers: {
          size: 0,
        },
        xaxis: {
          categories: ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV'],
        },
        yaxis: [
          {
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#008FFB',
            },
            labels: {
              style: {
                colors: '#008FFB',
              },
            },
            title: {
              text: 'Series 1',
              style: {
                color: '#008FFB',
              },
            },
          },
          {
            seriesName: 'Series 2',
            opposite: true,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#FF5733',
            },
            labels: {
              style: {
                colors: '#FF5733',
              },
            },
            title: {
              text: 'Series 2',
              style: {
                color: '#FF5733',
              },
            },
          },
        ],
        tooltip: {
          shared: true,
          intersect: false,
          y: {
            formatter: function (y:any) {
              if (typeof y !== 'undefined') {
                return y.toFixed(0) + ' points';
              }
              return y;
            },
          },
        },
      },
    };

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

    // Cleanup on unmount
    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <div className="chart-container">
      <div className='text-black dark:text-white'>Comparativo anual</div>
      <div id="chart" ref={chartRef}></div>
    </div>
  );
}
