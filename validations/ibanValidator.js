var IBAN = require('iban');
const countrySpecificaiton = require('../models/IBAN_Specifications')

exports.validateIBAN = (iban) => {
    if (IBAN.isValid(iban)) {
        return true
    } else {
        return false
    }

}

exports.validateIBANWithCurrency = (iban, currency) => {

    //console.log(countrySpecificaiton);

    var ibanCountryCode = iban.substring(0, 2);

    var countySpecs =  countrySpecificaiton[ibanCountryCode]

    if(countySpecs[0] === currency){
        console.log(countySpecs, 'validate iban with currency');
        return true
    }else{
        return false
    }



}
