const deleteProduct = (button) => {
    const prodId = button.parentNode.querySelector('[name=productId]').value;
    const csrf = button.parentNode.querySelector('[name=_csrf]').value;
    console.log(prodId);
}

//document.getElementById