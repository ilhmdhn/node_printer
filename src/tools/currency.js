const currency = (value) =>{
    // console.log(value)
    if(value === undefined){
        return 'nol';
    }
    const options = { style: 'currency', currency: 'IDR' };
    return  value.toLocaleString('id-ID', options).replace(/^Rp\s*/, '').replace(/,00$/, '');
}

module.exports = {
    currency
}