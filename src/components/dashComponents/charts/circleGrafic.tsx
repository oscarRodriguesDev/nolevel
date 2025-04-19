'use client'
import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';

export default function CIDs() {
  const chartRef = useRef(null);

  useEffect(() => {
    const options = {
      chart: {
        type: 'donut',
        height: '400px', // Altura do gráfico
        width: '100%'    // Largura do gráfico
      },
      series: [30, 40, 35, 50, 49, 60, 70, 91, 125], // Exemplo de dados
      labels: ['A09', 'B20', 'C34', 'D50', 'E11', 'F22', 'G08', 'H15', 'I25'], // Exemplo de rótulos
      tooltip: {
        style: {
          fontSize: '14px',
          color: '#000000', // Cor do texto da legenda (preto)
        },
      },
      colors: ['#FF5733', '#FFC300', '#C70039', '#900C3F', '#581845', '#FF5733', '#FFC300', '#C70039', '#900C3F'], // Exemplo de cores
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
      <div className='text-black dark:text-white'>CIDs mais emitidos</div>
      <div id="chart" ref={chartRef}></div>
    </div>
  );
}
