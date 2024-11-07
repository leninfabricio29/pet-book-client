import React, { Component, Fragment } from "react";
import axios from 'axios';
import Header from '../components/Header';
import Leftnav from '../components/Leftnav';
import Rightchat from '../components/Rightchat';
import Appfooter from '../components/Appfooter';
import Popupchat from '../components/Popupchat';
import { toast, ToastContainer } from 'react-toastify';
import { Tooltip } from "@mui/material";
import Select from "react-select";


const SelectsRow = ({ onSelectChange }) => {
    const eventTypeOptions = [
      { value: 'Adopción', label: 'Adopción' },
      { value: 'Donaciones', label: 'Donaciones' },
      { value: 'Esterilización', label: 'Esterilización' }
    ];
  
  
    
  
    return (
      <div className="select-wrapper">
        <Select
          onChange={onSelectChange}
          placeholder="Seleccione:"
          options={eventTypeOptions}
        />
      </div>
    );
  };
  
 


class EventoUno extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            user: null,
            selectedDate: '',
      title: '',
      description: '',
      eventType: null,
      location: '',
        };
    }

    componentDidMount() {
        // Llamar a la API para obtener los eventos al cargar el componente
        this.fetchEvents();
    }

    fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:3010/api/v1/events/all');
            const events = response.data;
            const user = JSON.parse(localStorage.getItem('user'));
            this.setState({ user, events });
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }

    saveEvent = async (eventId) => {
        const { user } = this.state;
        if (!user) {
            alert('User not logged in');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3010/api/v1/events/save', {
                userId: user._id,
                eventId: eventId,
            });

            if (response.status === 200) {
                toast.info('Evento guardado con éxito');
                this.fetchEvents(); // Volver a cargar los eventos para actualizar el estado
            }
        } catch (error) {
            console.error('Error saving event:', error);
            alert('Error al guardar el evento');
        }
    }

    formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();

        const months = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        const monthName = months[monthIndex];
        const formattedDate = `${day} ${monthName} ${year}`;
        return formattedDate;
    };

    handleDateChange = (e) => {
        this.setState({ selectedDate: e.target.value });
      };
    
      handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
      };
    
      handleEventChange = (selectedOption) => {
        this.setState({ eventType: selectedOption });
      };
    
      handleSubmit = async (e) => {
        e.preventDefault();
    
        const { title, description, selectedDate, eventType, location } = this.state;
        const userId = JSON.parse(localStorage.getItem('user'))._id;
    
        try {
          await axios.post('http://localhost:5020/api/v1/events/new/', {
            title,
            description: eventType ? eventType.label : description,
            date: selectedDate,
            location,
            userId
          });
    
          toast.info("Evento creado correctamente !");
          window.location.reload();
        } catch (error) {
          toast.error("No se ha podido crear el evento: " + error);
        }
      };
    

    render() {
        const { events, user } = this.state;
        const { selectedDate, title, location } = this.state;


        return (
            <Fragment>
                <Header />
                <Leftnav />
                <Rightchat />

                <div className="main-content right-chat-active">
                    <div className="middle-sidebar-bottom">
                        <div className="middle-sidebar-left pe-0">
                            <div className="row">
                                <div className="text-start mt-4">
                                    <h2 className="text-dark">Eventos en Loja</h2>
                                </div>
                                <div className="alert alert-info mt-4">
                                    <span>En esta sección verás todos los eventos que existen en la ciudad tales como, jornadas de adopción, de vacunación y de esterilización.</span>
                                </div>

                                {user?.rol === "fundacion" && (
                                    <div className="text-end ">
                                        {/* Render your button or any other component here */}
                                        <button 
                                            type="button" 
                                            className="btn btn-info m-4"
                                             data-toggle="modal" data-target="#exampleModal"
                                        >
                                            <Tooltip title="Crea un nuevo evento">
                                                <i className="feather-plus"></i>
                                            </Tooltip>
                                        </button>
                                    </div>
                                )}

                                {events.map((event, index) => (
                                    <div key={index} className="col-lg-4 col-md-6 pe-2 ps-2">
                                        <div className="card p-3 bg-white  hover-card border-0 shadow rounded-xxl border-0 mb-3 overflow-hidden ">
                                            <div className="card-image w-50 m-auto p-2 shadow rounded">
                                                {event.description === 'Adopción' && (
                                                    <img src="https://cdn-icons-png.flaticon.com/512/8183/8183234.png" alt="event" className="w-100 rounded-3" />
                                                )}
                                                {event.description === 'Donaciones' && (
                                                    <img src="https://cdn-icons-png.freepik.com/512/6410/6410115.png" alt="event" className="w-100 rounded-3" />
                                                )}
                                                {event.description === 'Esterilización' && (
                                                    <img src="https://cdn-icons-png.flaticon.com/512/1068/1068392.png" alt="event" className="w-100 rounded-3" />
                                                )}
                                            </div>
                                            <div className="card-body d-flex ps-0 pe-0 pb-0 m-auto">
                                                <h2 className="fw-600 text-grey-800 font-xss">
                                                    Jornada de, {event.description}

                                                    <div className="p-2 rounded-xxl theme-dark-bg">
                                                        <h4 className="fw-700 font-lg ls-3 text-grey-900 mb-0">
                                                            <span className="ls-3 d-block font-xsss text-grey-500 fw-500">
                                                                <i className="feather-calendar me-1"></i>{this.formatDate(event.date)}
                                                            </span>
                                                        </h4>
                                                    </div>

                                                    <div className="p-2 rounded-xxl theme-dark-bg">
                                                        <h4 className="fw-700 font-lg ls-3 text-grey-900 mb-0">
                                                            <span className="ls-3 d-block font-xsss text-grey-500 fw-500">
                                                                <i className="ti-location-pin me-1"></i>{event.location}
                                                            </span>
                                                        </h4>
                                                    </div>
                                                </h2>
                                            </div>
                                            <div className="card-body p-0  m-auto">
                                                
                                                {event.users_saveds.includes(user?._id) ? (
                                                    <button 
                                                    type="button" 
                                                    className="btn btn-warning fw-500 font-xsss text-light" 
                                                    disabled
                                                    
                                                >
                                                    Evento guardado
                                                </button>
                                                ) : (
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-info fw-500 font-xsss text-light" 
                                                        onClick={() => this.saveEvent(event._id)}
                                                        
                                                    >
                                                        Guardar
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}


<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      <form onSubmit={this.handleSubmit}>
  <div className="text-center">
    <h3>Gestión de eventos</h3>
  </div>

  <div className="form-group">
    <label>Fecha del evento:</label>
    <input
      type="date"
      className="form-control"
      name="selectedDate"
      value={selectedDate}
      onChange={this.handleDateChange}
      required
    />
  </div>

  <div className="form-group">
    <label>Título:</label>
    <input
      className="form-control"
      name="title"
      value={title}
      onChange={this.handleInputChange}
      required
    />
  </div>
  <div className="form-group">
    <label>Tipo de Evento:</label>
    <SelectsRow onSelectChange={this.handleEventChange} />
  </div>
  <div className="form-group">
    <label>Ubicación:</label>
    <input
      className="form-control"
      name="location"
      value={location}
      onChange={this.handleInputChange}
      required
    />
  </div>

  <div className="d-flex justify-content-end">
    <button className="btn bg-instagram text-light mt-4" type="submit">
      Guardar evento
    </button>
  </div>
</form>
      </div>
    </div>
  </div>
</div>

                            </div>
                        </div>
                    </div>
                    <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
                </div>

                <Popupchat />
                <Appfooter />
            </Fragment>
        );
    }
}

export default EventoUno;
