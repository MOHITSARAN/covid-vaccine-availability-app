import React, { Component } from "react";
import checkAvailability from "./service";
import "./style.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pin: 0,
      result: [],
    };
  }

  onChange = (event) => {
    this.setState({ pin: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const results = await checkAvailability(parseInt(this.state.pin));
    this.setState({ result: results });
  };

  render() {
    return (
      <div className="App mainContainer">
        <form onSubmit={this.handleSubmit}>
          Enter Pincode:{" "}
          <input value={this.state.term} onChange={this.onChange} />
          <button>Search!</button>
        </form>
        <br></br>
        <table id="tab">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Time</th>
              <th>Available Capacity</th>
              <th>Vaccine</th>
              <th>Slots</th>
            </tr>
          </thead>
          <tbody>
            {this.state.result.map((element, index) => (
              <tr key={index}>
                <td>{element.date}</td>
                <td>{element.name}</td>
                <td>
                  {element.from} - {element.to}
                </td>
                <td>{element.available_capacity}</td>
                <td>{element.vaccine}</td>
                <td>{element.slots}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <footer id="footer">
          <h3>Find vaccination slots available in your pin code - Mohit</h3>
        </footer>
      </div>
    );
  }
}

export default App;
