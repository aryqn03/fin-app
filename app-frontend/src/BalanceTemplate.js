class BalanceTemplate {
    constructor(template) {
      this.template = template;
    }
  
    render(balances) {
      const node = this.template.content.cloneNode(true);
  
      const available = node.querySelector('.balance .available');
      const ledger = node.querySelector('.balance .ledger');
  
      available.textContent = `${balances.available}$`;
      ledger.textContent = `${balances.ledger}$`;
  
      return node;
    }
  }