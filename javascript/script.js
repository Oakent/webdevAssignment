document.getElementById("btnPay").addEventListener("click", (e) => {
  let cardNum = document.getElementById("cardNum").value;
  let expMonth = document.getElementById("expMonth").value;
  let expYear = document.getElementById("expYear").value;
  let cvv = document.getElementById("cvv").value;

  let cvvElement = document.getElementById("cvv");
  let numElement = document.getElementById("cardNum");
  let errMsgElement = document.getElementById("errMsg");
  e.preventDefault();
  let valid;
  let errMsg = "The following input(s) contain errors:";
  let cvvValid = validateCVV(cvv);
  let dateValid = validateDate(expMonth, expYear);
  let numberValid = validateNum(cardNum);
  errMsg = !cvvValid ? (errMsg += " CVV") : errMsg;
  errMsg = !dateValid ? (errMsg += " date") : errMsg;
  errMsg = !numberValid ? (errMsg += " card number") : errMsg;
  !cvvValid
    ? cvvElement.classList.add("inputError")
    : cvvElement.classList.remove("inputError");
  !numberValid
    ? numElement.classList.add("inputError")
    : numElement.classList.remove("inputError");
  if (cvvValid && dateValid && numberValid) {
    errMsgElement.innerHTML = "";
    valid = true;
  } else {
    errMsgElement.innerHTML = errMsg;
  }
  if (valid == true) {
    cardStr = cardNum.toString();
    const lastNum = cardStr.substring(12, 16);
    const url = "http://mudfoot.doc.stu.mmu.ac.uk/node/api/creditcard";

    const data = {
      master_card: parseInt(cardNum),
      exp_year: parseInt(expYear),
      exp_month: parseInt(expMonth),
      cvv_code: String(cvv),
    };

    console.log(JSON.stringify(data));

    fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 200) {
          console.log(response);
          return response.json();
        } else if (response.status === 400) {
          throw "Bad data was sent to server.";
        } else {
          throw "Something went wrong" + response.status;
        }
      })
      .then((resJson) => {
        location.href = "success.html?num=" + lastNum;
      })
      .catch((error) => {
        alert(error);
      });
  }
});

validateDate = (expMonth, expYear) => {
  let monthElement = document.getElementById("expMonth");
  let yearElement = document.getElementById("expYear");
  const d = new Date();
  let thisYear = d.getFullYear();
  let month = d.getMonth() + 1;
  expYear >= thisYear
    ? yearElement.classList.remove("inputError")
    : yearElement.classList.add("inputError");
  month > expMonth && thisYear == expYear
    ? monthElement.classList.add("inputError")
    : monthElement.classList.remove("inputError");
  if (expYear > thisYear || (expYear == thisYear && month <= expMonth)) {
    return true;
  } else {
    return false;
  }
};

validateCVV = (cvv) => {
  const cvvReg = /^\d{3,4}$/;
  return cvvReg.test(cvv);
};

validateNum = (cardNum) => {
  const cardReg = /^((5[1-5][0-9]{14}))$/;
  let numberValid = cardReg.test(cardNum);
  return numberValid;
};
