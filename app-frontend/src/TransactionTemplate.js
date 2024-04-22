class TransactionTemplate {
    constructor(template) {
      this.template = template;
    }
  
    render(transaction) {
      const node = this.template.content.cloneNode(true);
  
      const description = node.querySelector('.transaction .description');
      const date = node.querySelector('.transaction .date');
      const amount = node.querySelector('.transaction .amount');
  
      description.textContent = transaction.description;
      date.textContent = transaction.date;
      amount.textContent = `${transaction.amount}$`;
  
      return node;
    }
  }