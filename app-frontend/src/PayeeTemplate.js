class PayeeTemplate {
    constructor(template) {
      this.template = template;
    }
  
    render(payee, callback) {
      const node = this.template.content.cloneNode(true);
  
      const name = node.querySelector('.payee .name');
      const address = node.querySelector('.payee .address');
      const createPayment = node.querySelector('.payee .create-payment');
  
      name.textContent = payee.name;
      address.textContent = payee.address.value;
      createPayment.addEventListener('click', callback);
  
      return node;
    }
  }