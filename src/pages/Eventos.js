import React from "react";
import axios from "axios";
import Select from "react-select";
import Appfooter from "../components/Appfooter";
import Header from "../components/Header";
import { toast, ToastContainer } from "react-toastify";
import DataTable from 'react-data-table-component';

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

const columns = [
  {
    name: 'Nombre',
    selector: row => row.title,
    sortable: true,
  },
  {
    name: 'Descripción',
    selector: row => row.description,
    sortable: true,
  },
  {
    name: 'Fecha',
    selector: row => new Date(row.date).toLocaleDateString(),
    sortable: true,
  },
  {
    name: 'Ubicación',
    selector: row => row.location,
    sortable: true,
  },

 

];

class Eventos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: '',
      title: '',
      description: '',
      eventType: null,
      location: '',

      eventData: [],  // State to hold event data
    };
  }

  componentDidMount() {
    this.fetchEventData();
  }

  fetchEventData = async () => {
    try {
      const response = await axios.get('http://localhost:3010/api/v1/events/all');
      this.setState({ eventData: response.data });
    } catch (error) {
      toast.error("Error al cargar los eventos: " + error);
    }
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
      this.fetchEventData();  // Refresh the data
    } catch (error) {
      toast.error("No se ha podido crear el evento: " + error);
    }
  };

  render() {
    const { selectedDate, title, location, eventData } = this.state;

    

    return (
      <div>
        <Header />
        <div className="main-content bg-white right-chat-active">
          <div className="middle-sidebar-bottom">
            <div className="middle-sidebar-left pe-0">
              <div className="row d-flex">
                <div className="border mt-4 rounded">
                  <h3 className="text-dark mt-4">Sección: Eventos</h3>
                  <div className="row">

                    <div className="container justify-content-between"> 

                      <div className="text-end jusntify-content-center  ">
                       <a className="btn bg-info text-light m-2" data-toggle="modal" data-target="#exampleModal">  <i className="feather-plus"></i> </a> 
                       <a className="btn bg-info text-light" data-toggle="modal" data-target="#exampleModal">  <i className="feather-edit"></i> </a> 

                      </div>

                    </div>


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
                   
                    <div className="col-">
                      <DataTable
                        columns={columns}
                        data={ eventData}
                        striped
                        pagination
                        title="Todos los eventos registrados"

                        

                      />
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
        <Appfooter />
      </div>
    );
  }
}

export default Eventos;
