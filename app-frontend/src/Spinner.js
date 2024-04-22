class Spinner {
    constructor(parent) {
      this.parent = parent;
      this.node = document.createElement('div');
      this.node.classList.add('spinner');
    }
  
    show() {
      this.parent.prepend(this.node);
    }
  
    hide() {
      this.parent.removeChild(this.node);
    }
  }
  
  function generatePerson() {
    const pickRandom = function(choices) {
      return choices[Math.floor(Math.random() * choices.length)];
    }
  
    const firstName = pickRandom([
      'William', 'James', 'Evelyn', 'Harper', 'Mason',
      'Ella', 'Jackson', 'Avery', 'Scarlett', 'Jack',
    ]);
  
    const middleLetter = pickRandom('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  
    const lastName = pickRandom([
      'Adams', 'Wilson', 'Burton', 'Harris', 'Stevens',
      'Robinson', 'Lewis', 'Walker', 'Payne', 'Baker',
    ]);
  
    const username = (Math.random() + 1).toString(36).substring(2);
  
    return {
      name: `${firstName} ${middleLetter}. ${lastName}`,
      email: `${username}@teller.io`,
    }
  }
  
  document.addEventListener('DOMContentLoaded', function(event) {
    const containers = {
      accounts: document.getElementById('accounts'),
      logs: document.getElementById('logs'),
      root: document.getElementsByTagName('body')[0]
    };
  
    const templates = {
      log: new LogTemplate(document.getElementById('log-template')),
      account: new AccountTemplate(document.getElementById('account-template')),
      detail: new DetailTemplate(document.getElementById('detail-template')),
      balance: new BalanceTemplate(document.getElementById('balance-template')),
      transaction: new TransactionTemplate(document.getElementById('transaction-template')),
      payee: new PayeeTemplate(document.getElementById('payee-template')),
      payment: new PaymentTemplate(document.getElementById('payment-template')),
      payeeModal: new PayeeModalTemplate(document.getElementById('payee-modal-template')),
      paymentModal: new PaymentModalTemplate(document.getElementById('payment-modal-template'))
    };
  
    const labels = {
      userId: document.getElementById('user-id'),
      accessToken: document.getElementById('access-token'),
    };
  
    const store = new TellerStore();
    const client = new Client();
    const enrollmentHandler = new EnrollmentHandler(client, containers, templates);
    const userHandler = new UserHandler(labels);
  
    const connectButton = document.getElementById('teller-connect');
    const statusHandler = new StatusHandler(connectButton);
  
    const tellerConnect = TellerConnect.setup({
      applicationId: APPLICATION_ID,
      environment: ENVIRONMENT,
      selectAccount: 'multiple',
      onSuccess: function(enrollment) {
        store.putUser(enrollment.user);
        store.putEnrollment(enrollment);
  
        enrollmentHandler.onEnrollment(enrollment);
        userHandler.onEnrollment(enrollment);
        statusHandler.onEnrollment(enrollment);
      },
    });
  
    connectButton.addEventListener('click', function() {
      statusHandler.toggle({
        onConnect: function() {
          tellerConnect.open();
        },
        onDisconnect: function() {
          enrollmentHandler.clear();
          userHandler.clear();
          store.clear();
          location.reload();
        },
      });
    });
  
    const enrollment = store.getEnrollment();
    if (enrollment) {
      enrollmentHandler.onEnrollment(enrollment);
      userHandler.onEnrollment(enrollment);
      statusHandler.onEnrollment(enrollment);
    }
  })
  