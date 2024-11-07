import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PetsChart = ({ filteredData, filterKey }) => {
    const countData = filteredData.reduce((acc, pet) => {
        const key = pet[filterKey];
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    const data = {
        labels: Object.keys(countData),
        datasets: [
            {
                label: `Datos de las mascotas (${filterKey})`,
                data: Object.values(countData),
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(153, 102, 255)',
                    'rgb(255, 159, 64)',
                ],
                hoverOffset: 2,
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
    };

    return (
        <div style={{ width: '300px', height: '300px' }} className='mx-auto'>
            <Pie data={data} options={options}  />
        </div>
    );
};

export default PetsChart;
