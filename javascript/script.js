document.getElementById("btnPay").addEventListener("click", (e) => {
  let cardNum = document.getElementById("cardNum").value;
  let expMonth = document.getElementById("expMonth").value;
  let expYear = document.getElementById("expYear").value;
  let cvv = document.getElementById("cvv").value;

  e.preventDefault();
  let valid;
  let errMsg = "The following input(s) contain errors:";
  let cvvValid = validateCVV(cvv);
  let dateValid = validateDate(expMonth, expYear);
  let numberValid = validateNum(cardNum);
  errMsg = !cvvValid ? (errMsg += " CVV") : errMsg;
  errMsg = !dateValid ? (errMsg += " date") : errMsg;
  errMsg = !numberValid ? (errMsg += " card number") : errMsg;
  if (cvvValid && dateValid && numberValid) {
    valid = true;
  } else {
    alert(errMsg);
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

    console.log(data);

    fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 200) {
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
  const d = new Date();
  let thisYear = d.getFullYear();
  let month = d.getMonth() + 1;
  if (expYear > thisYear || (expYear == thisYear && month <= expMonth)) {
    return true;
  } else {
    return false;
  }
};

validateCVV = (cvv) => {
  const cvvReg = /\d{3,4}/;
  return cvvReg.test(cvv);
};

validateNum = (cardNum) => {
  const cardReg = /^((5[1-5][0-9]{14}))$/;
  let numberValid = cardReg.test(cardNum);
  return numberValid;
};
