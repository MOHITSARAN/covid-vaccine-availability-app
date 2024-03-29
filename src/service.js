const moment = require("moment");
const axios = require("axios");

async function getTotalDose() {
  let config = {
    method: "get",
    url: "https://cdn-api.co-vin.in/api/v1/reports/v2/getPublicReports",
    headers: {
      accept: "application/json",
    },
  };

  return axios(config)
    .then(function (response) {
      return response.data.topBlock.vaccination;
    })
    .catch(function (error) {
      alert(
        "Lowe's employees- Please try to access this site using India west or India south GP gateways"
      );
      return Promise.reject(error);
    });
}

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
      return Promise.reject(error);
    });
}

async function fetchNext7Days(days) {
  let dates = [];
  let today = moment();
  for (let i = 0; i <= parseInt(days); i++) {
    let dateString = today.format("DD-MM-YYYY");
    dates.push(dateString);
    today.add(1, "day");
  }
  return dates;
}

async function checkAvailability(pin, days) {
  var slotListArray = [];
  let datesArray = await fetchNext7Days(days);

  const getSlots = async () => {
    for (let i = 0; i < datesArray.length; i++) {
      const output = await getSlotsForDate(pin, datesArray[i]);
      let validSlots = output.data.sessions;
      if (validSlots.length) {
        validSlots.forEach(function (entry) {
          if (entry.available_capacity > 0) slotListArray.push(entry);
        });
      }
    }
    return slotListArray;
  };
  const respslot = await getSlots();
  return respslot;
}

export { checkAvailability, getTotalDose };
