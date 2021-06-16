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
      body: "Covid Vaccination is available in the given Pin code, Please book the slots in cowin app immediately good luck!",
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
    let audio = new Audio("https://cv19as.herokuapp.com/CoVacc.m4a");
    var playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(_ => {})
        .catch(error => {
          console.log(error);
        });
    }
  };

  getAvailability = (pin, days) => {
    return new Promise(function (resolve) {
      const results = checkAvailability(parseInt(pin), days);
      resolve(results);
    });
  };

  handleSubmit = async event => {
    event.preventDefault();
    var that = this;
    if (this.state.pin.length != 6) {
      alert("Please enter valid Pincode!");
      return;
    }
    this.setState({ result: [] });
    this.setState({
      loading: "Searching vaccination centres available for next 7 days...",
    });
    this.getAvailability(this.state.pin, 7).then(function (results) {
      if (results.length == 0) {
        alert(
          "No slots available for the given pincode right now.\n\nDon't close the browser. You can minimize the browser, if vaccine is available you will be notified by sound."
        );
        that.clearState(
          "You can minimize the browser, if vaccine is available you will be notified by sound."
        );
        var timer = setInterval(async () => {
          that.getAvailability(that.state.pin, 1).then(function (alert_result) {
            if (alert_result.length > 0) {
              that.clearState("");
              that.setResults(alert_result);
              that.playAlert();
              that.notifyAlert();
              clearInterval(timer);
            }
          });
        }, 10000);
      } else {
        that.clearState("");
        that.setResults(results);
        that.playAlert();
        that.notifyAlert();
      }
    });
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
                <th>
                  Available Quantity <br></br>(1st Dose | 2nd Dose)
                </th>
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
                        {element.available_capacity_dose1}
                      </span>
                    ) : (
                      <span className='red'>
                        {element.available_capacity_dose1}
                      </span>
                    )}{" "}
                    |{" "}
                    {element.available_capacity > 40 ? (
                      <span className='green'>
                        {element.available_capacity_dose2}
                      </span>
                    ) : (
                      <span className='red'>
                        {element.available_capacity_dose2}
                      </span>
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
