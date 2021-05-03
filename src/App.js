import React, { Component } from "react";
import checkAvailability from "./service";
import "./style.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pin: 0,
      result: [],
      loading: "",
    };
  }

  onChange = event => {
    this.setState({ pin: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: "Searching slots for next 30 days..." });
    const results = await checkAvailability(parseInt(this.state.pin));
    if (results.length == 0) {
      alert("No record found!!");
      window.location.reload();
    }
    this.setState({ result: results });
    this.setState({ loading: "" });
  };

  render() {
    return (
      <div className='App'>
        <form onSubmit={this.handleSubmit}>
          Enter Pincode:{" "}
          <input value={this.state.term} onChange={this.onChange} />
          <button>Search</button>
        </form>
        <br></br>
        <div className='mainContainer'>
          <table id='tab'>
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Time</th>
                <th>Available Capacity</th>
                <th>Min Age Limit</th>
                <th>Vaccine</th>
                <th>Slots</th>
                <th>Book</th>
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
                  <td>
                    {element.available_capacity > 40 ? (
                      <span className='green'>
                        {element.available_capacity}
                      </span>
                    ) : (
                      <span className='red'>{element.available_capacity}</span>
                    )}
                  </td>
                  <td>{element.min_age_limit}</td>
                  <td>{element.vaccine}</td>
                  <td>{element.slots}</td>
                  <td>
                    <a
                      href='https://selfregistration.cowin.gov.in/appointment'
                      target='__blank'
                    >
                      Book Now
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {this.state.loading}
        </div>
        <br></br>

        <footer id='footer'>
          <h3>
            Find vaccination slots available in your pincode - Mohit Saran
          </h3>
        </footer>
      </div>
    );
  }
}

export default App;
