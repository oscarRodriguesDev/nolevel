
import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';

const PieChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const options = {
      chart: {
        type: 'pie',
        fontFamily: 'Satoshi, sans-serif',
        height: '400px', // Altura do gráfico
        width: '100%'    // Largura do gráfico
      },
      series: [50, 20, 15, 18, 30,40,42],
      labels: ['segunda', 'terça', 'quarta', 'quinta', 'sexta','sabado','domingo'],
      colors: ['#f00', '#fe0', '#0f0', '#fa6', '#ff8','#f05','#f11'],
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '14px',
        fontFamily: 'Satoshi',
        markers: {
          width: 12,
          height: 12,
        },
        itemMargin: {
          horizontal: 15,
          vertical: 10,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: '100%',
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <div className="chart-container">
      <div className='text-black dark:text-white'>Atestado por dias da semana</div>
      <div ref={chartRef}></div>
    </div>
  );
};

export default PieChart;
