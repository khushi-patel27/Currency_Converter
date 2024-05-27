document.addEventListener("DOMContentLoaded", () => {
  const BASE_URL = `https://api.exchangerate-api.com/v4/latest/USD`;

 

  const dropdowns = document.querySelectorAll(".dropdown select");
  const btn = document.querySelector(".convert");
  const fromCurr = document.querySelector(".from select");
  const toCurr = document.querySelector(".to select");
  const msg = document.querySelector(".msg");

  // Check if elements exist
  if (!btn || !fromCurr || !toCurr || !msg) {
      console.error("One or more elements could not be found in the DOM.");
      return;
  }

  // Populate dropdowns with currency codes
  for (let select of dropdowns) {
      for (let currCode in countryList) {
          let newOption = document.createElement("option");
          newOption.innerText = currCode;
          newOption.value = currCode;
          if (select.name === "from" && currCode === "USD") {
              newOption.selected = "selected";
          } else if (select.name === "to" && currCode === "INR") {
              newOption.selected = "selected";
          }
          select.append(newOption);
      }

      select.addEventListener("change", (evt) => {
          updateFlag(evt.target);
      });
  }

  const updateExchangeRate = async () => {
      let amount = document.querySelector(".amount input");
      let amtVal = amount.value;
      if (amtVal === "" || amtVal < 1) {
          amtVal = 1;
          amount.value = "1";
      }

      if (fromCurr.value === toCurr.value) {
          msg.innerText = `${amtVal} ${fromCurr.value} = ${amtVal} ${toCurr.value}`;
          return;
      }

      const URL = `${BASE_URL}?base=${fromCurr.value}&symbols=${toCurr.value}`;
      try {
          let response = await fetch(URL);
          if (!response.ok) {
              throw new Error(`Network response was not ok: ${response.statusText}`);
          }
          let data = await response.json();

          // Check if the response contains the expected data
          if (!data.rates || !data.rates[toCurr.value]) {
              throw new Error(`Conversion rate for ${fromCurr.value} to ${toCurr.value} not found.`);
          }

          let rate = data.rates[toCurr.value];
          let finalAmount = amtVal * rate;
          msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
      } catch (error) {
          console.error("Fetch error: ", error);
          msg.innerText = "Error fetching exchange rate.";
      }
  };

  const updateFlag = (element) => {
      let currCode = element.value;
      let countryCode = countryList[currCode];
      if (countryCode) {
          let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
          let img = element.parentElement.querySelector("img");
          if (!img) {
              img = document.createElement("img");
              element.parentElement.appendChild(img);
          }
          img.src = newSrc;
      }
  };

  btn.addEventListener("click", (evt) => {
      evt.preventDefault();
      updateExchangeRate();
  });

  updateExchangeRate();
});
