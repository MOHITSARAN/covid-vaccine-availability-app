const moment = require("moment");
const axios = require("axios");

async function getSlotsForDate(PINCODE, DATE) {
  let config = {
    method: "get",
    url:
      "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=" +
      PINCODE +
      "&date=" +
      DATE,
    headers: {
      accept: "application/json",
    },
  };

  return axios(config)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      alert("Please enter valid Pincode!!!");
      window.location.reload();
      return Promise.reject(error);
    });
}

async function fetchNext30Days() {
  let dates = [];
  let today = moment();
  for (let i = 0; i < 30; i++) {
    let dateString = today.format("DD-MM-YYYY");
    dates.push(dateString);
    today.add(1, "day");
  }
  return dates;
}

async function checkAvailability(pin) {
  var slotListArray = [];
  let datesArray = await fetchNext30Days();

  const getSlots = async () => {
    for (let i = 0; i <= datesArray.length; i++) {
      const output = await getSlotsForDate(pin, datesArray[i]);
      let sessions = output.data.sessions;
      let validSlots = sessions.filter(
        slot => slot.min_age_limit >= "18" && slot.available_capacity > 0
      );
      if (validSlots.length) {
        slotListArray.push(validSlots[0]);
      }
    }
    return slotListArray;
  };
  const respslot = await getSlots();
  return respslot;
}

export default checkAvailability;
