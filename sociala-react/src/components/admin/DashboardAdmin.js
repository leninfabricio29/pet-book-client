import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Group, Pets, Forum } from '@mui/icons-material';
import SideBar from '../../pages/SideBarAdmin';

const DashboardAdmin = () => {
  const [users, setUsers] = useState([]);
  const [pets, setPets] = useState([]);
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseUsers = await axios.get('http://localhost:3010/api/v1/users/list');
        const responsePets = await axios.get('http://localhost:3010/api/v1/pets/list');
        const responsePosts = await axios.get('http://localhost:3010/api/v1/posts/list');

        setUsers(responseUsers.data);
        setPosts(responsePosts.data);
        setPets(responsePets.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const roleDistributionData = () => {
    const roleCount = users.reduce((acc, user) => {
      const role = user.user.rol;
      acc[role] = acc[role] ? acc[role] + 1 : 1;
      return acc;
    }, {});
    return Object.keys(roleCount).map(role => ({
      name: role,
      value: roleCount[role],
    }));
  };

  const typeDistributionPets = () => {
    const typeCount = pets.reduce((acc, pet) => {
      const type = pet.type;
      acc[type] = acc[type] ? acc[type] + 1 : 1;
      return acc;
    }, {});
    return Object.keys(typeCount).map(type => ({
      name: type,
      value: typeCount[type],
    }));
  };

  const typeDistributionPosts = () => {
    const typeCount = posts.reduce((acc, post) => {
      const type = post.type;
      acc[type] = acc[type] ? acc[type] + 1 : 1;
      return acc;
    }, {});
    return Object.keys(typeCount).map(type => ({
      name: type,
      value: typeCount[type],
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <>
      <SideBar />
      <div className="main-content theme-dark-bg right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="middle">
              <div className="container">
                <div className="row mb-4">
                  {/* Tarjetas con íconos */}
                  <div className="col-xs-12 col-sm-6 col-md-3">
                    <div className="  rounded shadow">
                      <div className="card-body text-center">
                        <Group style={{ fontSize: 50, color: '#0088FE' }} />
                        <h6>Usuarios Normales</h6>
                        <h4 className="text-primary">
                          {users.filter(user => user.user.rol === 'usuario').length}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="col-xs-12 col-sm-6 col-md-3">
                    <div className=" rounded shadow">
                      <div className="card-body text-center">
                        <Group style={{ fontSize: 50, color: '#00C49F' }} />
                        <h6>Usuarios Fundación</h6>
                        <h4 className="text-primary">
                          {users.filter(user => user.user.rol === 'fundacion').length}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="col-xs-12 col-sm-6 col-md-3">
                    <div className=" rounded shadow">
                      <div className="card-body text-center">
                        <Forum style={{ fontSize: 50, color: '#FFBB28' }} />
                        <h6>Total Publicaciones</h6>
                        <h4 className="text-primary">
                          {posts.length}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="col-xs-12 col-sm-6 col-md-3">
                    <div className="rounded shadow">
                      <div className="card-body text-center">
                        <Pets style={{ fontSize: 50, color: '#FF8042' }} />
                        <h6>Total Mascotas</h6>
                        <h4 className="text-primary">
                          {pets.length}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  {/* Gráfico de roles de usuarios */}
                  <div className="col-xs-12 col-md-4 mb-4">
                    <div className="card shadow-lg rounded">
                      <div className="card-body text-center">
                        <h5>Distribución de Roles de Usuarios</h5>
                        <PieChart width={300} height={300}>
                          <Pie
                            data={roleDistributionData()}
                            cx={150}
                            cy={150}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            isAnimationActive={AnimationTimeline}
                          >
                            {roleDistributionData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="center" height={36} />
                        </PieChart>
                      </div>
                    </div>
                  </div>

                  <div className="col-xs-12 col-md-4 mb-4">
                    <div className="card shadow-lg rounded">
                      <div className="card-body text-center">
                        <h5>Distribución de Publicaciones</h5>
                        <PieChart width={300} height={300}>
                          <Pie
                            data={typeDistributionPosts()}
                            cx={150}
                            cy={150}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            isAnimationActive={true}
                          >
                            {typeDistributionPosts().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="center" height={36} />
                        </PieChart>
                      </div>
                    </div>
                  </div>

                  {/* Gráfico de tipos de mascotas */}
                  <div className="col-xs-12 col-md-4 mb-4">
                    <div className="card shadow-lg rounded ">
                      <div className="card-body text-center">
                        <h5>Distribución de Tipos de Mascotas</h5>
                        <PieChart width={300} height={300}>
                          <Pie
                            data={typeDistributionPets()}
                            cx={150}
                            cy={150}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            isAnimationActive={true}
                          >
                            {typeDistributionPets().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="center" height={24} />
                        </PieChart>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardAdmin;
