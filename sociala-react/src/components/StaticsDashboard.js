import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const StatisticCard = ({ title, children }) => (
  <div className="col-lg-6 mb-4 ">
    <div className="card shadow border-0 w-100 p-0 rounded-10 bg-white overflow-hidden">
      <div className="card-body p-4">
        <h4 className="fw-700 font-xss mb-3 text-grey-900">{title}</h4>
        {children}
      </div>
    </div>
  </div>
);

const StatisticsDashboard = ({ statistics }) => {
  const renderTypesDistribution = () => {
    const data = Object.entries(statistics.typesDistribution).map(([name, value]) => ({ name, value }));
    return (
      <StatisticCard title="Distribución por tipo de publicación">
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

  const renderReactionsComments = () => {
    const data = [
      { name: 'Reacciones', promedio: statistics.avgReactions, total: statistics.totalReactions },
      { name: 'Comentarios', promedio: statistics.avgComments, total: statistics.totalComments },
    ];
    return (
      <StatisticCard title="Reacciones y Comentarios">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="promedio" fill="#8884d8" name="Promedio" />
            <Bar dataKey="total" fill="#82ca9d" name="Total" />
          </BarChart>
        </ResponsiveContainer>
      </StatisticCard>
    );
  };

  const renderRewardDistribution = () => {
    const data = [
      { name: 'Recompensa', value: statistics.postsWithReward },
      { name: 'Sin Recompensa', value: statistics.postsWithoutReward },
    ];
    return (
      <StatisticCard title="Distribución de Recompensas">
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

  const renderPostsByMonth = () => {
    const data = Object.entries(statistics.postsByMonth).map(([month, count]) => ({ month, count }));
    return (
      <StatisticCard title="Publicaciones por Mes">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </StatisticCard>
    );
  };

  return (
    <div className="statistics-dashboard">
      <div className="row">
        {renderTypesDistribution()}
        {renderReactionsComments()}
        {renderRewardDistribution()}
        {renderPostsByMonth()}
      </div>
    </div>
  );
};

export default StatisticsDashboard;
