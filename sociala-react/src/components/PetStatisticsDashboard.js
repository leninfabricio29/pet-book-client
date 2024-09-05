import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const StatisticCard = ({ title, children }) => (
  <div className="col-lg-6 mb-4">
    <div className="card shadow border-0 w-100 p-0 rounded-10 bg-white overflow-hidden">
      <div className="card-body p-4">
        <h4 className="fw-700 font-xss mb-3 text-grey-900">{title}</h4>
        {children}
      </div>
    </div>
  </div>
);

const PetStatisticsDashboard = ({ statisticsPets }) => {
  const renderTypesDistribution = () => {
    const data = Object.entries(statisticsPets.typesDistribution).map(([name, value]) => ({ name, value }));
    return (
      <StatisticCard title="Distribución por tipo de mascota">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </StatisticCard>
    );
  };

  const renderSexDistribution = () => {
    const data = Object.entries(statisticsPets.sexDistribution).map(([sex, value]) => ({ sex, value }));
    return (
      <StatisticCard title="Distribución por sexo">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#82ca9d"
              dataKey="value"
              label={({ sex, percent }) => `${sex} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </StatisticCard>
    );
  };

  const renderHealthDistribution = () => {
    const data = [
      { name: 'Con enfermedad', value: statisticsPets.petsWithDisease },
      { name: 'Sin enfermedad', value: statisticsPets.petsWithoutDisease },
    ];
    return (
      <StatisticCard title="Distribución de salud">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#FFBB28"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 120).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </StatisticCard>
    );
  };

  const renderAverageAge = () => {
    return (
      <StatisticCard title="Edad promedio de mascotas">
        <div className="text-center">
          <h2 className="fw-700">{statisticsPets.avgPetAge.toFixed(2)} años</h2>
        </div>
      </StatisticCard>
    );
  };

  const renderTreatmentNeeds = () => {
    return (
      <StatisticCard title="Mascotas que requieren tratamiento">
        <div className="text-center">
          <h2 className="fw-700">{statisticsPets.petsRequiringTreatment}</h2>
        </div>
      </StatisticCard>
    );
  };

  return (
    <div className="pet-statistics-dashboard">
      <div className="row">
        {renderTypesDistribution()}
        {renderSexDistribution()}
        {renderHealthDistribution()}
        {renderAverageAge()}
        {renderTreatmentNeeds()}
      </div>
    </div>
  );
};

export default PetStatisticsDashboard;
