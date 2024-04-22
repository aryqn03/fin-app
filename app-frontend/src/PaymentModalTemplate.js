class PaymentModalTemplate {
    constructor(template) {
      this.template = template;
    }
  
    render(prefilledMemo, prefilledAmount) {
      const node = this.template.content.cloneNode(true);
  
      const memo = node.querySelector('#payment-memo');
      const amount = node.querySelector('#payment-amount');
  
      memo.value = prefilledMemo;
      amount.value = prefilledAmount;
  
      return node;
    }
  }