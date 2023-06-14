var oresUrl = "ores.csv";
var materialsUrl = "materials.csv";

var oreSelect = document.getElementById("ore-select");
var materialSelect = document.getElementById("material-select");
var quantityInput = document.getElementById("quantity-input");
var outputValue = document.getElementById("output-value");

function loadCSV(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      if (xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        reject(Error(xhr.statusText));
      }
    };
    xhr.onerror = function() {
      reject(Error("Network Error"));
    };
    xhr.open("GET", url);
    xhr.send();
  });
}

function populateDropdown(data, selectElement) {
  var options = data.split("\n");
  options.shift(); // Remove header row
  options.forEach(function(option) {
    var parts = option.split(",");
    var value = parts[0].trim();
    var label = parts[1].trim();
    var optionElement = document.createElement("option");
    optionElement.value = label;
    optionElement.textContent = value;
    selectElement.appendChild(optionElement);
  });
}

function populateOres() {
  loadCSV(oresUrl)
    .then(function(response) {
      populateDropdown(response, oreSelect);
    })
    .catch(function(error) {
      console.log("Error loading ores:", error);
    });
}

function populateMaterials() {
  var selectedOre = oreSelect.value;
  if (selectedOre) {
    loadCSV(materialsUrl)
      .then(function(response) {
        var filteredData = response.split("\n").filter(function(row) {
          return row.startsWith(selectedOre);
        });
        populateDropdown(filteredData.join("\n"), materialSelect);
      })
      .catch(function(error) {
        console.log("Error loading materials:", error);
      });
  } else {
    materialSelect.innerHTML = '<option value="">Select an ore first...</option>';
    outputValue.textContent = "";
  }
}

function calculateOutput() {
  var selectedMaterial = materialSelect.value;
  var quantity = parseInt(quantityInput.value);
  if (selectedMaterial && quantity > 0) {
    var output = quantity * 3.15;
    outputValue.textContent = selectedMaterial + ": " + output.toFixed(2);
  } else {
    outputValue.textContent = "";
  }
}

window.onload = function() {
  populateOres();
};
