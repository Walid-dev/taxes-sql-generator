const taxesContainer = document.getElementById("taxesContainer2");
const queryCountContainer = document.getElementById("queryCountContainer");
const tasksCountContainer = document.getElementById("tasksCountContainer");
const insertionSumBox = document.getElementById("insertionSumBox");
const locationsCountContainer = document.getElementById("locationsCountContainer");
const locationsListContainer = document.getElementById("locationsListContainer");

const productsCountContainer = document.getElementById("productsCountContainer");
const productsListContainer = document.getElementById("productsListContainer");

const generateQueriesBtn = document.getElementById("generateQueries");
const taxesSelector = document.getElementById("taxesSelector");
const hoTaxInput = document.getElementById("hoTaxInput");
const locationIdsTextArea = document.getElementById("locationIdsTextArea");
const productIdsTextArea = document.getElementById("productIdsTextArea");

// Clean up string text and return an array of integer values only

function cleanUpAndConvertToArray(data) {
  const textToClean = data.replace(/[, ]+/g, " ").trim().split(" ");
  const cleanedArray = [];

  textToClean.forEach((element) => {
    if (typeof +element === "number" && !isNaN(element)) {
      cleanedArray.push(+element);
    }
  });
  return cleanedArray;
}

// Create query

function createQuery(headofficeId, locationId, productId, tax1, tax2) {
  const query = `INSERT INTO system_tax_links (id, tax_id, headoffice_id, location_id, product_id, modifier_id, type) VALUES (NULL, ${tax1}, ${headofficeId}, ${locationId}, ${productId}, NULL, NULL), (NULL, ${tax2}, ${headofficeId}, ${locationId}, ${productId}, NULL, NULL);`;
  return query;
}

// Return correct query depending on the selected HTML value

function checkSelectedTax(headoffice_id, location_id, product_id) {
  var toCheck = taxesSelector.value;
  // console.log(+toCheck);
  if (+toCheck === 1) {
    return createQuery(headoffice_id, location_id, product_id, 6, 89259);
  } else if (+toCheck === 2) {
    return createQuery(headoffice_id, location_id, product_id, 6, 89584);
  } else {
    // console.log("No Taxes");
  }
}

function createTaxesSqlQueries(headofficeId, locationIdArray, productIdArray) {
  const queries = [];

  locationIdArray.forEach((locationId) => {
    productIdArray.forEach((productId) => {
      const query = checkSelectedTax(headofficeId, locationId, productId);
      queries.push(query);
      console.log(query);
      paragraphe = document.createElement("p");
      taxesContainer.appendChild(paragraphe);
      paragraphe.textContent = query;
    });
  });

  return queries;
}

// Generate...

generateQueriesBtn.addEventListener("click", () => {
  var hoTaxInputValue = hoTaxInput.value;
  var taxIdValue = taxesSelector.value;
  var taxTextValue = taxesSelector.options[taxesSelector.selectedIndex].text;
  var locationIdsStr = locationIdsTextArea.value;
  var productIdsStr = productIdsTextArea.value;

  const cleanedLocationsArray = cleanUpAndConvertToArray(locationIdsStr);
  const cleanedProductsArray = cleanUpAndConvertToArray(productIdsStr);

  // const query = checkSelectedTax(1234, 7895, 56678);
  const queries = createTaxesSqlQueries(hoTaxInputValue, cleanedLocationsArray, cleanedProductsArray);

  let numberOfLocations = cleanedLocationsArray.length.toString();
  let numberOfProducts = cleanedProductsArray.length.toString();

  insertionSumBox.style.display = "flex";

  queryCountContainer.textContent = `Number of queries: ${queries.length}`;

  productsCountContainer.textContent = `Number of Products: ${numberOfProducts}`;
  productIdsTextArea.value = `${cleanedProductsArray}`;

  locationsCountContainer.textContent = `Number of Locations: ${numberOfLocations}`;
  locationIdsTextArea.value = `${cleanedLocationsArray}`;

  queryCountContainer.innerHTML = `Number of queries: ${queries.length}`;
  tasksCountContainer.textContent = `${queries.length * 2} taxes will be inserted`;
});
