class EnrollmentHandler {
    constructor(client, containers, templates) {
      this.client = client;
      this.containers = containers;
      this.templates = templates;
    }
  
    onEnrollment(enrollment) {
      this.client.accessToken = enrollment.accessToken;
  
      const container = this.containers.accounts;
      const template = this.templates.account;
      const spinner = new Spinner(container);
      const callbacks = this;
  
      spinner.show();
  
      this.client.listAccounts()
        .then(function(response) {
          return response.json();
        })
        .then(function(accounts) {
          accounts.forEach(function(account) {
            const node = template.render(account, callbacks);
            container.appendChild(node);
          });
  
          spinner.hide();
        });
    }
  
    onDetails(account) {
      const container = this.containers.logs;
      const template = this.templates.detail;
      const spinner = new Spinner(container);
      const header = this.templates.log.render({
        method: 'GET',
        name: 'Details',
        path: `/accounts/${account.id}/details`,
      });
  
      spinner.show();
  
      this.client.getAccountDetails(account)
        .then(function(response) {
          return response.json();
        })
        .then(function(details) {
          container.prepend(template.render(details));
          container.prepend(header);
  
          spinner.hide();
        });
    }
  
    onBalances(account) {
      const container = this.containers.logs;
      const template = this.templates.balance;
      const spinner = new Spinner(container);
      const header = this.templates.log.render({
        method: 'GET',
        name: 'Balances',
        path: `/accounts/${account.id}/balances`,
      });
  
      spinner.show();
  
      this.client.getAccountBalances(account)
        .then(function(response) {
          return response.json();
        })
        .then(function(balances) {
          container.prepend(template.render(balances));
          container.prepend(header);
  
          spinner.hide();
        });
    }
  
    onTransactions(account) {
      const container = this.containers.logs;
      const template = this.templates.transaction;
      const spinner = new Spinner(container);
      const header = this.templates.log.render({
        method: 'GET',
        name: 'Transactions',
        path: `/accounts/${account.id}/transactions?count=30`,
      });
  
      spinner.show();
  
      this.client.listAccountTransactions(account)
        .then(function(response) {
          return response.json();
        })
        .then(function(transactions) {
          transactions.reverse().forEach(function(transaction) {
            container.prepend(template.render(transaction));
          });
  
          container.prepend(header);
          spinner.hide();
        });
    }
  
    onPayees(account) {
      const container = this.containers.logs;
      const template = this.templates.payee;
      const spinner = new Spinner(container);
      const header = this.templates.log.render({
        method: 'GET',
        name: 'Payees',
        path: `/accounts/${account.id}/payments/zelle/payees`,
      });
  
      spinner.show();
  
      const onCreatePayment = this.onCreatePayment.bind(this);
      this.client.listAccountPayees(account)
        .then(function(response) {
          return response.json();
        })
        .then(function(payees) {
          payees.forEach(function(payee) {
            const callback = function() {
              onCreatePayment(account, payee);
            };
            container.prepend(template.render(payee, callback));
          });
  
          container.prepend(header);
          spinner.hide();
        });
    }
  
    onCreatePayee(account) {
      const container = this.containers.logs;
      const spinner = new Spinner(container);
      const rootContainer = this.containers.root;
      const modalTemplate = this.templates.payeeModal;
  
      const person = generatePerson();
      const modal = modalTemplate.render(person.name, person.email);
      rootContainer.append(modal);
  
      const enrollmentHandler = this;
  
      document.getElementById('submit-payee').addEventListener('click', function() {
        const name = document.getElementById('payee-name').value;
        const email = document.getElementById('payee-email').value;
  
        document.getElementById('payee-modal').remove();
        spinner.show();
  
        const payee = {
          name: name,
          type: 'person',
          address: {
            type: 'email',
            value: email,
          },
        };
  
        enrollmentHandler.client.createAccountPayee(account, payee)
          .then(function(response) {
            return response.json();
          })
          .then(function(payeeResponse) {
            spinner.hide();
            enrollmentHandler.onPayeeResponse(account, payee, payeeResponse);
          });
      });
  
      document.getElementById('payee-modal').addEventListener('click', function() {
        document.getElementById('payee-modal').remove();
      });
  
      document.getElementById('payee-modal-content').addEventListener('click', function(e) {
        // prevent event from propagating to the dismiss function
        e.stopPropagation();
      });
    }
  
    onCreatePayment(account, payee) {
      const container = this.containers.logs;
      const rootContainer = this.containers.root;
      const spinner = new Spinner(container);
      const template = this.templates.paymentModal;
  
      const prefilledMemo = 'Teller test';
      const prefilledAmount = `${Math.ceil(Math.random() * 100)}.00`;
  
      const modal = template.render(prefilledMemo, prefilledAmount);
      rootContainer.append(modal);
  
      const enrollmentHandler = this;
  
      document.getElementById('submit-payment').addEventListener('click', function() {
        const memo = document.getElementById('payment-memo').value;
        const amount = document.getElementById('payment-amount').value;
  
        document.getElementById('payment-modal').remove();
        spinner.show();
  
        const payment = {
          payee_id: payee.id,
          amount: amount,
          memo: memo,
        };
  
        enrollmentHandler.client.createAccountPayment(account, payment)
          .then(function(response) {
            return response.json();
          })
          .then(function(paymentResponse) {
            spinner.hide();
            enrollmentHandler.onPaymentResponse(account, payee, payment, paymentResponse);
          });
      });
  
      document.getElementById('payment-modal').addEventListener('click', function() {
        document.getElementById('payment-modal').remove();
      });
  
      document.getElementById('payment-modal-content').addEventListener('click', function(e) {
        // prevent event from propagating to the dismiss function
        e.stopPropagation();
      });
    }
  
    onPayeeResponse(account, payee, payeeResponse) {
  
      const enrollmentHandler = this;
      const container = this.containers.logs;
      const template = this.templates.payee;
      const spinner = new Spinner(container);
  
      const header = this.templates.log.render({
        method: 'POST',
        name: 'Payees',
        path: `/accounts/${account.id}/payments/zelle/payees`,
      });
  
      const callback = function() {
        enrollmentHandler.onCreatePayment(account, payeeResponse);
      };
  
      if (payeeResponse.connect_token) {
        spinner.show();
  
        const tellerConnect = TellerConnect.setup({
          applicationId: APPLICATION_ID,
          environment: ENVIRONMENT,
          connectToken: payeeResponse.connect_token,
          onSuccess: function(payeeData) {
            container.prepend(template.render(payee, callback));
            container.prepend(header);
            spinner.hide();
          },
          onFailure: function(details) {
            spinner.hide();
          },
        });
  
        tellerConnect.open();
  
      } else {
        container.prepend(template.render(payee, callback));
        container.prepend(header);
      }
    }
  
    onPaymentResponse(account, payee, payment, paymentResponse) {
      const container = this.containers.logs;
      const spinner = new Spinner(container);
      const template = this.templates.payment;
      const header = this.templates.log.render({
        method: 'POST',
        name: 'Payments',
        path: `/accounts/${account.id}/payments/zelle`,
      });
  
      if (paymentResponse.connect_token) {
        spinner.show();
  
        const tellerConnect = TellerConnect.setup({
          applicationId: APPLICATION_ID,
          environment: ENVIRONMENT,
          connectToken: paymentResponse.connect_token,
          onSuccess: function(payment_data) {
            container.prepend(template.render(payment, payee));
            container.prepend(header);
            spinner.hide();
          },
          onFailure: function(details) {
            spinner.hide();
          },
        });
  
        tellerConnect.open();
      } else {
        container.prepend(template.render(payment, payee));
        container.prepend(header);
      }
    }
  
    clear() {
      const parents = Object.values(this.containers);
      parents.forEach(function(parent) {
        while (parent.firstChild) {
          parent.removeChild(parent.firstChild);
        }
      });
    }
  }