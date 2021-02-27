/******************************************************************************
 *                                  Send Requests
 ******************************************************************************/

document.addEventListener(
  "click",
  function (event) {
    event.preventDefault();
    var ele = event.target;
    var path = document.getElementById("endpoint-input").value;
    var data = document.getElementById("body-input").value;
    if (ele.matches("#get-btn")) {
      sendRequest(path, data, httpGet);
    } else if (ele.matches(".post-btn")) {
      sendRequest(path, data, httpPost);
    } else if (ele.matches(".patch-btn")) {
      sendRequest(path, data, httpPatch);
    } else if (ele.matches(".delete-btn")) {
      sendRequest(path, data, httpDelete);
    }
  },
  false
);

function sendRequest(path, data, httpClientFunction) {
  // Clear old response
  displayResponses({ status: "", bodyOverride: "" });

  // Send request
  httpGet(path, data).then((response) => {
    // Display new response
    displayResponses(response);
  });
}

function httpGet(path) {
  return fetch(path, getOptions("GET"));
}

function httpPost(path, data) {
  return fetch(path, getOptions("POST", data));
}

function httpPut(path, data) {
  return fetch(path, getOptions("PUT", data));
}

function httpPatch(path, data) {
  return fetch(path, getOptions("PATCH", data));
}

function httpDelete(path) {
  return fetch(path, getOptions("DELETE"));
}

function getOptions(verb, data) {
  var options = {
    dataType: "json",
    method: verb,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  if (data) {
    options.body = JSON.stringify(data);
  }
  return options;
}

/******************************************************************************
 *                               Display Responses
 ******************************************************************************/

function displayResponses(response) {
  document.getElementById("status-output").value = response.status;
  if (response.bodyOverride === undefined) {
    response.text().then((body) => {
      document.getElementById("body-output").value = body;
    });
  } else {
    document.getElementById(
      "body-output"
    ).value = response.bodyOverride.toString();
  }
}
