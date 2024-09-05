import React, { Component, Fragment } from "react";
import Header from '../components/Header';
import Appfooter from '../components/Appfooter';
import Popupchat from '../components/Popupchat';
import axios from 'axios';
import StatisticsDashboard from "../components/StaticsDashboard";
import PetStatisticsDashboard from "../components/PetStatisticsDashboard";

class Analytics extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedCategory: 'mascotas',
            petsData: [],
            postsData: [],
            statisticsPets: {
                typesDistribution: {},
                avgPetAge: 0,
                sexDistribution: {},
                petsWithDisease: 0,
                petsWithoutDisease: 0,
                petsRequiringTreatment: 0
            },
            statisticsPosts: {
                typesDistribution: {},
                totalReactions: 0,
                avgReactions: 0,
                totalComments: 0,
                avgComments: 0,
                postsWithReward: 0,
                postsWithoutReward: 0,
                ownerDistribution: {},
                commonCoordinates: [],
                avgPetAge: 0,
                postsByMonth: {}
            }
        };
    }

    async componentDidMount() {
        try {
            const petsResponse = await axios.get('http://localhost:3010/api/v1/pets/list');
            const postsResponse = await axios.get('http://localhost:3010/api/v1/posts/list');
            this.setState({
                petsData: petsResponse.data,
                postsData: postsResponse.data
            }, () => {
                this.calculatePetStatistics();
                this.calculatePostStatistics();
            });
        } catch (error) {
            console.error('Error fetching data from API:', error);
        }
    }
    

    calculatePetStatistics = () => {
        const { petsData } = this.state;

        // 1. Distribución por tipo de mascota
        const typesDistribution = petsData.reduce((acc, pet) => {
            acc[pet.type] = (acc[pet.type] || 0) + 1;
            return acc;
        }, {});

        // 2. Promedio de edad de mascotas
        const totalAge = petsData.reduce((sum, pet) => sum + Number(pet.age), 0);
        const avgPetAge = totalAge / petsData.length;

        // 3. Distribución por sexo
        const sexDistribution = petsData.reduce((acc, pet) => {
            acc[pet.sex] = (acc[pet.sex] || 0) + 1;
            return acc;
        }, {});

        // 4. Mascotas con y sin enfermedades
        const petsWithDisease = petsData.filter(pet => pet.has_disease).length;
        const petsWithoutDisease = petsData.length - petsWithDisease;

        // 5. Mascotas que requieren tratamiento
        const petsRequiringTreatment = petsData.filter(pet => pet.requires_treatment).length;

        this.setState({
            statisticsPets: {
                typesDistribution,
                avgPetAge,
                sexDistribution,
                petsWithDisease,
                petsWithoutDisease,
                petsRequiringTreatment
            }
        });
    }

    calculatePostStatistics = () => {
        const { postsData } = this.state;

        // 1. Distribución por tipo de publicación
        const typesDistribution = postsData.reduce((acc, post) => {
            acc[post.type] = (acc[post.type] || 0) + 1;
            return acc;
        }, {});

        // 2. Total y promedio de reacciones
        const totalReactions = postsData.reduce((sum, post) => sum + post.amount_reactions, 0);
        const avgReactions = totalReactions / postsData.length;

        // 3. Total y promedio de comentarios
        const totalComments = postsData.reduce((sum, post) => sum + post.amount_comments, 0);
        const avgComments = totalComments / postsData.length;

        // 4. Publicaciones con y sin recompensa
        const postsWithReward = postsData.filter(post => post.reward > 0).length;
        const postsWithoutReward = postsData.length - postsWithReward;

        // 5. Distribución por propietarios
        const ownerDistribution = postsData.reduce((acc, post) => {
            acc[post.owner] = (acc[post.owner] || 0) + 1;
            return acc;
        }, {});

        // 6. Coordenadas más comunes
        const coordinateFrequency = postsData.reduce((acc, post) => {
            const coord = JSON.stringify(post.location.coordinates);
            acc[coord] = (acc[coord] || 0) + 1;
            return acc;
        }, {});
        const commonCoordinates = Object.entries(coordinateFrequency).filter(([coord, count]) => count > 1);

        // 7. Edad promedio de mascotas en adopciones y pérdidas
        const adoptionLostPosts = postsData.filter(post => post.type === 'Adopcion' || post.type === 'Perdida');
        const avgPetAge = adoptionLostPosts.reduce((sum, post) => sum + post.pet.age, 0) / adoptionLostPosts.length;

        // 8. Publicaciones por mes
        const postsByMonth = postsData.reduce((acc, post) => {
            const month = new Date(post.createdAt).toLocaleString('default', { month: 'long' });
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {});

        this.setState({
            statisticsPosts: {
                typesDistribution,
                totalReactions,
                avgReactions,
                totalComments,
                avgComments,
                postsWithReward,
                postsWithoutReward,
                ownerDistribution,
                commonCoordinates,
                avgPetAge,
                postsByMonth
            }
        });
    }

    handleCategoryClick = (category) => {
        this.setState({ selectedCategory: category });
    }

    renderStatisticsContent = () => {
        const { selectedCategory, statisticsPosts, statisticsPets } = this.state;

        if (selectedCategory === 'mascotas') {
            return (
                <div className="card  p-4">
                    <div className="text-center">
                    <h3 className="text-dark mt-4 font-xss fw-700 ">Sección: Estadísticas de mascotas</h3>

                    </div>
                    <div className="col-lg-12 mb-3 mt-4">
                        <PetStatisticsDashboard statisticsPets={statisticsPets} />
                    </div>
                </div>
            );
        } else if (selectedCategory === 'reportes') {
            return (
                <div className="card  p-4">
                    <div className="text-center">
                    <h3 className="text-dark mt-4 font-xss fw-700">Sección: Estadísticas de reportes</h3>

                    </div>
                    <div className="col-lg-12 mb-3 mt-4">
                        <StatisticsDashboard statistics={statisticsPosts} />
                    </div>
                </div>
            );
        }
    };

    render() {
        
        return (
            <Fragment>
                <Header />
                <div className="main-content bg-white right-chat-active">
                    <div className="middle-sidebar-bottom">
                        <div className="middle-sidebar-left pe-0">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card w-100 border-0 shadow-none p-5 rounded-xxl bg-lightblue2 mb-3">
                                        <div className="row">
                                            <div className="col ps-lg-5">
                                                <h2 className="display1-size d-block mb-2 text-grey-900 fw-700">Estadísticas hasta 2024, mascotas en Loja</h2>
                                                <p className="font-xssss fw-500 text-grey-500 lh-26">Aquí podrás encontrar datos relevantes sobre mascotas y reportes.</p>
                                                <div className="text-center">
                                                    <a href="/defaultanalytics" className="btn w200 border-0 bg-tumblr p-3 text-white fw-600 rounded-3 d-inline-block font-xssss">Ver tutorial</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-center">
                                    <div className="col-lg-3 pe-2 ps-2 cursor-pointer" onClick={() => this.handleCategoryClick('mascotas')}>
                                        <div className="card w-100 border-0 shadow-none p-4 rounded-xxl mb-3" style={{ background: `#f6f3ff` }}>
                                            <div className="card-body d-flex p-0">
                                                <i className="btn-round-lg d-inline-block me-3 bg-secondary feather-gitlab font-md text-white"></i>
                                                <h4 className="text-secondary font-xl fw-700">44.6K <span className="fw-500 mt-0 d-block text-grey-500 font-xssss">Mascotas </span></h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 pe-2 ps-2 cursor-pointer" onClick={() => this.handleCategoryClick('reportes')}>
                                        <div className="card w-100 border-0 shadow-none p-4 rounded-xxl mb-3" style={{ background: `#e2f6e9` }}>
                                            <div className="card-body d-flex p-0">
                                                <i className="btn-round-lg d-inline-block me-3 bg-success ti-clipboard font-md text-white"></i>
                                                <h4 className="text-success font-xl fw-700">27.2K <span className="fw-500 mt-0 d-block text-grey-500 font-xssss">Reportes</span></h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-12 mt-4 ">
                                    {this.renderStatisticsContent()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Popupchat />
                <Appfooter />
            </Fragment>
        );
    }
}

export default Analytics;

