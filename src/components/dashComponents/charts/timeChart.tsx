import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';

const TimeChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Dados simulados (data e hora de abertura e tempo de conclusão em minutos)
    const chamados = [
      { abertura: '2024-07-10T09:00:00', conclusao: '2024-07-10T09:35:00' },
      { abertura: '2024-07-10T10:15:00', conclusao: '2024-07-10T10:50:00' },
      { abertura: '2024-07-10T11:30:00', conclusao: '2024-07-10T12:05:00' },
      { abertura: '2024-07-10T13:00:00', conclusao: '2024-07-10T13:30:00' },
      { abertura: '2024-07-10T14:45:00', conclusao: '2024-07-10T15:10:00' },
    ];

    // Converter dados para o formato adequado para ApexCharts
    const seriesData = chamados.map(chamado => {
      const abertura = new Date(chamado.abertura).getTime();
      const conclusao = new Date(chamado.conclusao).getTime();
      const tempoDecorrido = (conclusao - abertura) / (1000 * 60); // Converter para minutos
      return tempoDecorrido;
    });

    // Labels (opcional, pode ser usado para mostrar a data/hora de abertura)
    const labels = chamados.map(chamado => {
      const abertura = new Date(chamado.abertura);
      return abertura.toLocaleString('pt-BR');
    });

    const options = {
      chart: {
        type: 'line',
        fontFamily: 'Satoshi, sans-serif',
      },
      series: [
        {
          name: 'Tempo para Conclusão (minutos)',
          data: seriesData,
        },
      ],
      xaxis: {
        categories: labels,
      },
      colors: ['#008FFB'],
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
      <div className='text-black dark:text-white'> Tempo médio de resposta</div>
      <div ref={chartRef}></div>
    </div>
  );
};

export default TimeChart;
