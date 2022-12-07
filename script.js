'use strict';

// Simply Bank App

const account1 = {
  userName: 'Cecil Ireland',
  transactions: [500.32, 250, -300.92, 5000, -850, -110, -170, 1100],
  interest: 1.5,
  pin: 1111,
};

const account2 = {
  userName: 'Amani Salt',
  transactions: [2000, 6400, -1350, -70, -210, -2000, 5500, -30],
  interest: 1.3,
  pin: 2222,
};

const account3 = {
  userName: 'Corey Martinez',
  transactions: [900, -200, 280, 300, -200, 150, 1400, -400],
  interest: 0.8,
  pin: 3333,
};

const account4 = {
  userName: 'Kamile Searle',
  transactions: [530, 1300, 500, 40, 190],
  interest: 1,
  pin: 4444,
};

const account5 = {
  userName: 'Oliver Avila',
  transactions: [630, 800, 300, 50, 120],
  interest: 1.1,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.total__value--in');
const labelSumOut = document.querySelector('.total__value--out');
const labelSumInterest = document.querySelector('.total__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerTransactions = document.querySelector('.transactions');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseNickname = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayTransactions = function(transactions, sort = false) { 

  const transacs = sort ? transactions.slice().sort((x, y) => x - y) : transactions;

  containerTransactions.innerHTML = '';

  transacs.forEach(function(trans, index) {
    const transType = trans > 0 ? 'deposit' : 'withdrawal'; 
    const transactionRow = `
    <div class="transactions__row">
      <div class="transactions__type transactions__type--${transType}">
       ${index + 1} ${transType}
      </div>
      <div class="transactions__value">${trans.toFixed(2)}</div>
    </div>
    `;
    containerTransactions.insertAdjacentHTML('afterbegin', transactionRow);
  });
};


// // console.log(containerTransactions.innerHTML);

const createNicknames = function(accs) {
  accs.forEach(function(acc) {
    acc.nickname = acc.userName
    .toLocaleLowerCase()
    .split(' ')
    .map(word => word[0])
    .join('');
  });
};
createNicknames(accounts);
console.log(accounts);

// // const userName = 'Oliver Avila'; // nickname = 'oa'
// // const nickname = userName
// //   .toLocaleLowerCase()
// //   .split(' ')
// //   .map(word => word[0])
// //   .join('');
// // console.log(nickname);

const displayBalance = function(account) {
  const balance = account.transactions.reduce((acc, trans) => acc + trans, 0);
  account.balance = balance;
  labelBalance.textContent = `${balance.toFixed(2)}$`;

}


const displayTotal = function(account) {
  const depositesTotal = account.transactions.filter(trans => trans > 0).reduce((acc, trans) => acc + trans, 0);
  labelSumIn.textContent = `${depositesTotal.toFixed(2)}$`; 

  const withdrawalsTotal = account.transactions.filter(trans => trans < 0).reduce((acc, trans) => acc + trans, 0);
  labelSumOut.textContent = `${withdrawalsTotal.toFixed(2)}$`;

  const interestTotal = account.transactions
    .filter(trans => trans > 0)
    .map(depos => (depos * account.interest) / 100)
    .filter((interest, index, arr) => {
      console.log(arr);
      return interest >= 5;
    })
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${interestTotal.toFixed(2)}$`;
};

// const coreyMartinez = accounts.find(account => account.userName === 'Corey Martinez');
// console.log(coreyMartinez);

const upDateUi = function(account) {
  displayTransactions(account.transactions);
  //disp balance
  displayBalance(account);
  //disp total
  displayTotal(account);
}

let currentAccount; 

btnLogin.addEventListener('click', function(e) {
  e.preventDefault();
  currentAccount = accounts.find(account => account.nickname === inputLoginUsername.value);
  console.log(currentAccount);
  if(currentAccount?.pin === +(inputLoginPin.value)) {
    //display Ui welcome message
    labelWelcome.textContent = `Hi ${currentAccount.userName.split(' ')[0]}!!! Whhhhaaaaazzzzuuuup?!`;
    containerApp.style.opacity = 1;
    //clear input
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();
    // disp trans
    upDateUi(currentAccount);
  };
});

btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();
  const transferAmount = +(inputTransferAmount.value);
  const recipientNickname = inputTransferTo.value;
  const recipientAccount = accounts.find(account => account.nickname === recipientNickname);
  console.log(transferAmount);
  console.log(recipientAccount);
  if(transferAmount > 0 && currentAccount.balance >= transferAmount && recipientAccount && recipientAccount.nickname !== currentAccount.nickname) {
    currentAccount.transactions.push(-transferAmount);
    recipientAccount.transactions.push(transferAmount);
    upDateUi(currentAccount);
  }
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
});

btnClose.addEventListener('click', function(e) {
  e.preventDefault();
  if(inputCloseNickname.value === currentAccount.nickname && +(inputClosePin.value) === currentAccount.pin) {
    const currentAccountIndex = accounts.findIndex(account => account.nickname === currentAccount.nickname);
    accounts.splice(currentAccountIndex, 1); //1 в данном случае количество удаленных элементов
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Come in';
  }
  inputCloseNickname.value = '';
  inputClosePin.value = '';
});

btnLoan.addEventListener('click', function(e) {
  e.preventDefault();
  const loanAmount = Math.floor(+inputLoanAmount.value);
  if(loanAmount > 0 && currentAccount.transactions.some(depos => depos >= loanAmount * 0.1)) {
    currentAccount.transactions.push(loanAmount);
    upDateUi(currentAccount);
  }
  inputLoanAmount.value = '';
})

let transactionsSorted = false;

btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayTransactions(currentAccount.transactions, !transactionsSorted);
  transactionsSorted = !transactionsSorted;
});

// Array.from() example

// const logoImage = document.querySelector('.logo');
// logoImage.addEventListener('click', function() {
//   const transactionsUi = document.querySelectorAll('.transactions__value');
//   console.log(transactionsUi);
//   const transactionsUiArray = Array.from(transactionsUi);
//   console.log(transactionsUiArray.map(elem => +(elem.textContent)));
// });

const logoTopImage = document.querySelector('.logo');
logoTopImage.addEventListener('click', function() {
  const transactionsUi = document.querySelectorAll('.transactions__value');
  console.log(transactionsUi);
  const transactionsUiArray = Array.from(transactionsUi, elem => +(elem.textContent));
  console.log(transactionsUiArray);
});

// change Number -> +

// added loan function 

const logoImage = document.querySelector('.logo');
logoImage.addEventListener('click', function() {
  [...document.querySelectorAll('.transactions__row')].forEach((row, index) => {
    if(index % 2 === 0) {
      row.style.backgroundColor = 'grey';
    }
  })
});