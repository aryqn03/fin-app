class AccountTemplate {
    constructor(template) {
      this.template = template;
    }
  
    render(account, callbacks) {
      const node = this.template.content.cloneNode(true);
  
      const title = node.querySelector('.account .title');
      const institution = node.querySelector('.account .institution');
      const type = node.querySelector('.account .type');
      const subtype = node.querySelector('.account .subtype');
      const details = node.querySelector('.account .details');
      const balances = node.querySelector('.account .balances');
      const transactions = node.querySelector('.account .transactions');
      const payees = node.querySelector('.account .payees');
      const createPayee = node.querySelector('.account .create-payee');
  
      title.textContent = [account.name, account.last_four].join(', ');
      institution.textContent = account.institution.id;
      type.textContent = account.type;
      subtype.textContent = account.subtype;
  
      if (account.type == "depository") {
        details.addEventListener('click', function() {
          callbacks.onDetails(account);
        });
      } else {
        details.setAttribute('disabled', true);
      }
  
      balances.addEventListener('click', function() {
        callbacks.onBalances(account);
      });
  
      transactions.addEventListener('click', function() {
        callbacks.onTransactions(account);
      });
  
      if (account.subtype == 'checking') {
        payees.addEventListener('click', function() {
          callbacks.onPayees(account);
        });
  
        createPayee.addEventListener('click', function() {
          callbacks.onCreatePayee(account);
        });
      } else {
        payees.setAttribute('disabled', true);
        createPayee.setAttribute('disabled', true);
      }
  
      return node;
    }
  }