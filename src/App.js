import React, { Component } from "react";
import { checkAvailability, getTotalDose } from "./service";
import "./style.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pin: 0,
      result: [],
      loading: "",
      total_doses: 0,
      today_doses: 0,
    };
  }

  onChange = event => {
    this.setState({ pin: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ result: [] });
    this.setState({
      loading: "Searching vaccination centers available for next 30 days...",
    });
    const results = await checkAvailability(parseInt(this.state.pin));
    if (results.length == 0) {
      alert(
        "No slots available for the given pincode please check after some time."
      );
      window.location.reload();
    }
    this.setState({ result: results });
    this.setState({ loading: "" });
  };

  async componentDidMount() {
    var total = await getTotalDose();
    this.setState({ total_doses: total.total_doses });
    this.setState({ today_doses: total.today });
  }

  render() {
    return (
      <div className='App'>
        <br></br>
        <div className='info'>
          <form className='search' onSubmit={this.handleSubmit}>
            <input
              type='number'
              className='searchTerm'
              value={this.state.term}
              onChange={this.onChange}
              placeholder='Enter Pincode'
            />
            <button type='submit' className='searchButton'>
              <i className='material-icons searchSize'>&#xe8b6;</i>
            </button>
          </form>
          <br></br>

          <div className='chip'>
            Total Vaccination Doses{" "}
            {new Intl.NumberFormat("en-IN", {
              maximumSignificantDigits: 3,
            }).format(this.state.total_doses)}{" "}
            | Today's Vaccination Doses{" "}
            {new Intl.NumberFormat("en-IN", {
              maximumSignificantDigits: 3,
            }).format(this.state.today_doses)}
          </div>
        </div>
        <br></br>
        <div className='mainContainer'>
          <table id='tab'>
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Available Capacity</th>
                <th>Min Age Limit</th>
                <th>Vaccine</th>
                <th>Slot Timings</th>
                <th>Location</th>
                <th>Book</th>
              </tr>
            </thead>
            <tbody>
              {this.state.result.map((element, index) => (
                <tr key={index}>
                  <td>{element.date}</td>
                  <td>{element.name}</td>

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
                  <td>
                    {element.slots.map(function (name, index) {
                      return (
                        <span className='space' key={index}>
                          {" "}
                          {name}{" "}
                        </span>
                      );
                    })}
                  </td>
                  <td>
                    <a
                      href={`https://www.google.com/maps/search/${element.name} ${element.pincode}`}
                      target='__blank'
                    >
                      <i className='material-icons size'>&#xe569;</i>
                    </a>
                  </td>
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
          <h4 className='foot'>
            Find vaccination centers available in nearby - Mohit Saran
            <img
              src='https://hitwebcounter.com/counter/counter.php?page=7807640&style=0025&nbdigits=5&type=ip&initCount=97'
              title='Free Counter'
              alt='web counter'
              border='0'
              className='visit'
            />
          </h4>
        </footer>
      </div>
    );
  }
}

export default App;
