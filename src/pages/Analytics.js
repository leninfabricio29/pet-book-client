import React, { Component, Fragment } from "react";
import Header from '../components/Header';
import Appfooter from '../components/Appfooter';
import Popupchat from '../components/Popupchat';
import Select from "react-select";
import axios from 'axios';
import PetsChart from '../components/PetsChart';

class Analytics extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedCategory: 'mascotas',
            filtro: { value: 'type', label: 'Tipo' }, 
            data: [],
            filteredData: [],
            postsData: [],
            filteredPostsData: [],
        };
    }

    filterTypeOptions = [
        { value: 'type', label: 'Tipo' },
        { value: 'sex', label: 'Sexo' },
        { value: 'has_disease', label: 'Enfermedad' },
        { value: 'requires_treatment', label: 'Tratamiento' },
        { value: 'sterilization_status', label: 'Esterilización' },
        { value: 'status', label: 'Estado' }
    ];

    postTypeOptions = [
        { value: 'type', label: 'Tipo' },
        { value: 'amount_reactions', label: 'Reacciones' },
        { value: 'amount_comments', label: 'Comentarios' },
    ];

    async componentDidMount() {
        try {
            const petsResponse = await axios.get('http://localhost:3010/api/v1/pets/list');
            const petsData = petsResponse.data;
            const postsResponse = await axios.get('http://localhost:3010/api/v1/posts/list');
            const postsData = postsResponse.data;

            this.setState({ 
                data: petsData, 
                filteredData: petsData, 
                postsData, 
                filteredPostsData: postsData 
            });
        } catch (error) {
            console.error('Error fetching data from API:', error);
        }
    }

    applyFilter = () => {
        const { data, filtro, selectedCategory, postsData } = this.state;

        if (selectedCategory === 'mascotas') {
            if (filtro) {
                const filteredData = data.filter(item => item[filtro.value] !== undefined);
                this.setState({ filteredData });
            } else {
                this.setState({ filteredData: data });
            }
        } else if (selectedCategory === 'reportes') {
            if (filtro) {
                const filteredPostsData = postsData.filter(item => item[filtro.value] !== undefined);
                this.setState({ filteredPostsData });
            } else {
                this.setState({ filteredPostsData: postsData });
            }
        }
    }

    handleSelectChange = (selectedOption) => {
        this.setState({ filtro: selectedOption }, this.applyFilter);
    }

    handleCategoryClick = (category) => {
        this.setState({ selectedCategory: category }, this.applyFilter);
    }

    renderStatisticsContent = () => {
        const { selectedCategory, filtro, filteredData, filteredPostsData } = this.state;

        switch (selectedCategory) {
            case 'mascotas':
                return (
                    <div className="card">
                        <h3 className="text-dark mt-4">Sección: Estadísticas mascotas</h3>
                        <div className="col-lg-12 mb-3">
                            <div className="alert alert-warning d-flex flex-column align-items-center text-center">
                                <span>Estadísticas actuales Loja 2024, en esta sección (Mascotas) podrás ver información con respecto a todas las mascotas registradas en la plataforma, usa los filtros según tu necesidad.</span>
                                <a href="/defaultanalytics" className="btn w200 mt-2 border-0 bg-tumblr p-3 text-white fw-600 rounded-3 d-inline-block font-xssss"> <i className="ti-light-bulb"> </i>Ver tutorial </a>
                            </div>
                            <div className="d-flex justify-content-first">
                            <label className="mont-font fw-600 font-xss m-2">Filtrar:</label>

                            <div className="col-lg-2 mb-3">
                                        <div className="form-group">
                                            <Select
                                    required
                                    value={filtro}
                                    onChange={this.handleSelectChange}
                                    options={this.filterTypeOptions}
                                    placeholder='Seleccione:'

                                    
                                />
                                        </div>
                                    </div>
                                
                            </div>
                            <div className="d-flex justify-content-center">
                                <PetsChart filteredData={filteredData} filterKey={filtro.value} />
                            </div>
                        </div>
                    </div>
                );
            case 'reportes':
                return (
                    <div className="card">
                        <h3 className="text-dark mt-4">Sección: Estadísticas de reportes</h3>
                        <div className="col-lg-12 mb-3">
                            <div className="alert alert-warning d-flex flex-column align-items-center text-center">
                                <span>Estadísticas actuales Loja 2024, en esta sección (Reportes) podrás ver información con respecto a todos los reportes registrados en la plataforma, usa los filtros según tu necesidad.</span>
                                <a href="/defaultanalytics" className="btn w200 mt-2 border-0 bg-tumblr p-3 text-white fw-600 rounded-3 d-inline-block font-xssss"> <i className="ti-light-bulb"> </i>Ver tutorial </a>
                            </div>
                            <div className="d-flex justify-content-center">
                            <label className="mont-font fw-600 font-xss m-2">Filtrar:</label>

                            <div className="col-lg-2 mb-3">
                                        <div className="form-group">
                                            <Select
                                    required
                                    value={filtro}
                                    onChange={this.handleSelectChange}
                                    options={this.postTypeOptions}
                                    placeholder='Seleccione:'

                                    
                                />
                                        </div>
                                    </div>
                                
                            </div>
                            <div className="d-flex justify-content-center">
                                <PetsChart filteredData={filteredPostsData} filterKey={filtro.value} />
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

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
                                                <p className="font-xssss fw-500 text-grey-500 lh-26">Aquí podrás encontrar datos relevantes sobre mascotas y reportes; para una mejor percepción da clic en el tutorial.</p>
                                                <div className="text-center">
                                                <a href="/defaultanalytics" className="btn w200 border-0 bg-tumblr p-3 text-white fw-600 rounded-3 d-inline-block font-xssss"> <i className="ti-light-bulb"> </i>Ver tutorial </a>

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
                                                <h4 className="text-success font-xl fw-700">603 <span className="fw-500 mt-0 d-block text-grey-500 font-xssss">Reportes</span></h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center mt-4 rounded shadow container-statistics">
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
