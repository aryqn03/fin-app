class PaymentTemplate {
    constructor(template) {
      this.template = template;
    }
  
    render(payment, payee) {
      const node = this.template.content.cloneNode(true);
  
      const name = node.querySelector('.payment .name');
      const amount = node.querySelector('.payment .amount');
  
      name.textContent = payee.name;
      amount.textContent = `${payment.amount}$`;
  
      return node;
    }
  }