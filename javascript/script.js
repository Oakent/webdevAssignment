document.getElementById("btnPay").addEventListener("click", (e) => {
  let cardNum = document.getElementById("cardNum").value;
  let expMonth = document.getElementById("expMonth").value;
  let expYear = document.getElementById("expYear").value;
  let cvv = document.getElementById("cvv").value;

  e.preventDefault();
  let valid;
  if (
    validateCVV(cvv) &&
    validateDate(expMonth, expYear) &&
    validateNum(cardNum)
  ) {
    valid = true;
  } else {
    alert("there is an error in one or more of your inputs");
  }
  if (valid == true) {
    const url = "http://mudfoot.doc.stu.mmu.ac.uk/node/api/creditcard";

    const data = {
      master_card: cardNum,
      exp_year: expYear,
      exp_month: expMonth,
      cvv_code: cvv,
    };

    fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else if (response.status === 400) {
          throw "Bad data was sent to server.";
        } else {
          throw "Something went wrong";
        }
      })
      .then((resJson) => {
        alert("payment sucsessful");
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
