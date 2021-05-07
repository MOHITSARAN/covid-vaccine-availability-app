import React, { Component } from "react";
import { checkAvailability, getTotalDose } from "./service";
import "./style.css";
import Push from "push.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pin: "",
      result: [],
      loading: "Data will be displayed based on the availability. ",
      total_doses: 0,
      today_doses: 0,
    };
  }

  onChange = event => {
    this.setState({ pin: event.target.value });
  };

  setResults = args => {
    this.setState({ result: args });
  };

  notifyAlert = e => {
    Push.create("Hello", {
      body:
        "Covid Vaccination is available in the given Pin code, Please book the slots in cowin app immediately good luck!",
      timeout: 120000,
      onClick: function () {
        window.focus();
        this.close();
      },
    });
  };

  // say a message
  speak = (text, callback) => {
    var u = new SpeechSynthesisUtterance();
    u.text = text;
    u.lang = "en-US";

    u.onend = function () {
      if (callback) {
        callback();
      }
    };

    u.onerror = function (e) {
      if (callback) {
        callback(e);
      }
    };

    speechSynthesis.speak(u);
  };

  clearState = args => {
    this.setState({
      loading: args,
    });
  };

  playAlert = () => {
    var audio = new Audio("https://cv19as.herokuapp.com/CoVacc.m4a");
    audio.play();
  };

  playAlert3Times = () => {
    var x = 0;
    var intervalID = setInterval(function () {
      var audio = new Audio("https://cv19as.herokuapp.com/CoVacc.m4a");
      audio.play();
      if (++x === 3) {
        window.clearInterval(intervalID);
      }
    }, 60000);
  };

  handleSubmit = async event => {
    event.preventDefault();
    if (this.state.pin.length != 6) {
      alert("Please enter valid Pincode!");
      return;
    }
    this.setState({ result: [] });
    this.setState({
      loading: "Searching vaccination centres available for next 7 days...",
    });
    const results = await checkAvailability(parseInt(this.state.pin));

    if (results.length == 0) {
      alert(
        "No slots available for the given pincode right now.\n\nDon't close the browser. You can minimize the browser, if vaccine is available you will be notified by sound."
      );
      this.clearState(
        "You can minimize the browser, if vaccine is available you will be notified by sound."
      );
      var timer = setInterval(async () => {
        let alert_result = await checkAvailability(parseInt(this.state.pin));
        if (alert_result.length > 0) {
          this.playAlert();
          this.setState({
            loading: "",
          });
          this.setResults(alert_result);
          this.notifyAlert();
          clearInterval(timer);
        }
      }, 120000);
    } else {
      this.clearState("");
      this.setResults(results);
      this.playAlert();
      this.notifyAlert();
    }
  };

  async componentDidMount() {
    var total = await getTotalDose();
    this.setState({ total_doses: total.total_doses });
    this.setState({ today_doses: total.today });
  }

  render() {
    return (
      <div className='App'>
        <div className='nav'>
          <div className='nav-header'>
            <div className='nav-title'>
              <span>Covid Vaccine Availability Finder</span>
            </div>
          </div>
        </div>
        <br></br>
        <div className='info'>
          <form className='search' onSubmit={this.handleSubmit}>
            <input
              type='number'
              className='searchTerm'
              value={this.state.pin}
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
              maximumSignificantDigits: 8,
            }).format(this.state.total_doses)}{" "}
            | Today's Vaccination{" "}
            {new Intl.NumberFormat("en-IN", {
              maximumSignificantDigits: 8,
            }).format(this.state.today_doses)}
          </div>
        </div>
        <br></br>
        <div className='mainContainer'>
          <table id='tab'>
            <thead>
              <tr>
                <th>Date</th>
                <th>Vaccine Centre</th>
                <th>Available Quantity</th>
                <th>Min. Age Limit</th>
                <th>Vaccine Name</th>
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
                    <a
                      href={`https://www.google.com/maps/search/${element.name} ${element.address} ${element.pincode}`}
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
          <span className='loading'>{this.state.loading}</span>
        </div>
        <br></br>

        <footer id='footer'>
          <div className='foot'>
            This application is not related/affiliated to cowin.gov.in in any
            manner. This application is developed to track the Covid vaccine
            availability in the nearest centre. <br></br>
            <i>Developer: Mohit Saran (Lowe's)</i>
            <a href='https://www.linkedin.com/in/mohitsaran/' target='__blank'>
              {" "}
              <img src='linkedin.png' className='linkedin' />
            </a>
            <img
              src='https://hitwebcounter.com/counter/counter.php?page=7807640&style=0025&nbdigits=5&type=ip&initCount=97'
              title='Free Counter'
              alt='web counter'
              border='0'
              className='visit'
            />
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
