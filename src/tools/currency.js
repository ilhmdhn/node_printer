const currency = (value) =>{
    const options = { style: 'currency', currency: 'IDR' };
    return  value.toLocaleString('id-ID', options).replace(/^Rp\s*/, '').replace(/,00$/, '');
}

module.exports = {
    currency
}