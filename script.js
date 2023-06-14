// Function to fetch and parse the CSV data
function fetchCSVData(url, callback) {
  $.ajax({
    url: url,
    type: 'GET',
    dataType: 'text',
    success: function(csvString) {
      var lines = csvString.split('\n');
      var headers = lines[0].split(',');
      var data = [];

      for (var i = 1; i < lines.length; i++) {
        var values = lines[i].split(',');

        if (values.length === headers.length) {
          var item = {};
          for (var j = 0; j < headers.length; j++) {
            item[headers[j]] = values[j];
          }
          data.push(item);
        }
      }

      callback(null, data);
    },
    error: function(xhr, status, error) {
      callback(new Error('Error fetching CSV data: ' + error));
    }
  });
}

// Function to populate the ore dropdown options
function populateOreDropdown() {
  // Fetch and parse the CSV data
  fetchCSVData('ores.csv', function(error, data) {
    if (error) {
      console.error('Error fetching CSV data:', error);
      return;
    }

    // Get the ore selector dropdown element
    var oreSelector = document.getElementById('oreSelector');

    // Create and append option elements for each ore
    for (var i = 0; i < data.length; i++) {
      var option = document.createElement('option');
      option.value = data[i].Ore;
      option.textContent = data[i].Ore;
      oreSelector.appendChild(option);
    }
  });
}

// Function to handle the selection change event
function handleSelectionChange() {
  // Get the selected ore
  var oreSelector = document.getElementById('oreSelector');
  var selectedOre = oreSelector.options[oreSelector.selectedIndex].value;

  // Fetch and parse the CSV data
  fetchCSVData('output.csv', function(error, data) {
    if (error) {
      console.error('Error fetching CSV data:', error);
      return;
    }

    // Find the corresponding item in the data
    var selectedData;
    for (var i = 0; i < data.length; i++) {
      if (data[i].Ore === selectedOre) {
        selectedData = data[i];
        break;
      }
    }

    // Display the refined material and quantity
    var refinedMaterialOutput = document.getElementById('refinedMaterialOutput');
    var quantityOutput = document.getElementById('quantityOutput');
    refinedMaterialOutput.textContent = selectedData.refinedMaterialOutput;
    quantityOutput.textContent = selectedData.Quantity;
  });
}

// Populate the ore dropdown options
populateOreDropdown();
