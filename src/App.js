import React, { Component } from "react";
import { checkAvailability, getTotalDose } from "./service";
import "./style.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pin: 0,
      result: [],
      loading: "Only vaccine available addresses will be listed below. ",
      total_doses: 0,
      today_doses: 0,
    };
  }

  onChange = event => {
    this.setState({ pin: event.target.value });
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
    var audio = new Audio(
      "https://assets.mixkit.co/sfx/preview/mixkit-clear-announce-tones-2861.mp3"
    );
    audio.play();
  };

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ result: [] });
    this.setState({
      loading: "Searching vaccination centres available for next 7 days...",
    });
    const results = await checkAvailability(parseInt(this.state.pin));

    if (results.length == 0) {
      alert(
        "No slots available for the given pincode right now.\n\nDon't close the browser if vaccine is available, you will be notified by sound."
      );
      this.clearState(
        "You can minimize the browser if vaccine is available, you will be notified by sound."
      );
      var timer = setInterval(async () => {
        let alert = await checkAvailability(parseInt(this.state.pin));
        if (alert.length > 0) {
          //this.speak("Hi, Vaccination centre is available in you area!");
          this.playAlert();
          clearInterval(timer);
          this.setState({
            loading: "",
          });
        }
      }, 120000);
    } else {
      this.clearState("");
      //this.speak("Hi, Vaccination centre is available in you area!");
      this.playAlert();
    }

    this.setState({ result: results });
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
                <th>Name</th>
                <th>Available Capacity</th>
                <th>Min Age Limit</th>
                <th>Vaccine</th>
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
            manner. This application is only developed to track the availability
            of vaccination centres available nearby.
            <br></br>
            Developer:{" "}
            <i>
              Mohit Saran{" "}
              <a href='https://www.linkedin.com/in/mohitsaran/'>
                <i className='material-icons user'>&#xe7fd;</i>
              </a>
            </i>
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
