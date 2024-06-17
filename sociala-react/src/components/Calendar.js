import React, { Component } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

class Calendario extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date()
    };
  }

  onChange = (date) => {
    this.setState({ date });
    this.props.onDateChange(date); // Llamar a la función proporcionada por el padre
  };

  render() {
    return (
      <div>
        <Calendar className={"react-calendar "}
          onChange={this.onChange}
          value={this.state.date}
          locale="es"
        />
      </div>
    );
  }
}

export default Calendario;
