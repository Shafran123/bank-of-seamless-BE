const puppeteer = require('puppeteer');
var FormData = require('form-data');
const randomUseragent = require('random-useragent');
const axios = require('axios');
const cheerio = require('cheerio');
var IBAN = require('iban');
const ibanValidator = require('../validations/ibanValidator')

const fs = require('firebase-admin');

exports.getBankBalance = async (req, res) => {
    console.log(balance);
    var formatedBalance = parseFloat(balance).toFixed(2)

    res.status(200).send({
        code: 200, data: {
            "balance": formatedBalance
        }
    })
}


exports.getIBANDetails = async (req, res) => {

    try{

    let bankLogo = '';
    var bankName = ''
    var iban = req.params.iban;
 
    isValidIban =  IBAN.isValid(iban)   //IBAN Validation

    console.log(isValidIban);

 
    if(isValidIban){
        var formData = new FormData();
        formData.append("userInputIban", req.params.iban);
    
        await axios({
            method: 'post',
            url: 'https://transferwise.com/us/iban/checker',
            headers:formData.getHeaders(),
            data: formData
          }).then((response) => {
        
            const $ = cheerio.load(response.data)        
            $('#main').each((index, element) => {
                  //  console.log(index , element);
                     bankLogo = $(element).find('.bank-logo').attr('src')
                     bankName = $(element).find('.bank-logo').attr('alt')
                     console.log(bankLogo);
                if(bankName){
                    res.status(203).send({
                        code: 203, data: {
                            "bank": bankName,
                            "logo": bankLogo
                        }
                    })
                }else{
                    res.status(404).send({
                        code: 404, message: "Bank Not Found"
                        
                    })
                }
                   
            });
    
          }).catch(error => {
            res.status(500).send({
                code: 500, 
                error: {
                    "status": "Internal Server Error",
                    "message": error 
                }        
            })
          });
    }else{
        res.status(400).send({
            code: 400,
            error: {
                "status": "Bad Request",
                "message": "Invalid IBAN Number" 
            }        
        })
    }

    }catch (err){
        res.status(500).send({
            code: 500, 
            error: {
                "status": "Internal Server Error",
                "message": null 
            }        
        })
    }
}

exports.transfer = async (req, res) => {
    var iban = req.params.iban;
     var isValidIBAN = ibanValidator.validateIBAN(iban)

     if(isValidIBAN){
        //Validate IBAN WITH Currency
       var isValidCurrency  = ibanValidator.validateIBANWithCurrency(iban , req.body.currency)
        if(isValidCurrency){
            
            var transferAmount = req.body.amount

            console.log(parseFloat(balance) < transferAmount);

            if(transferAmount > parseFloat(balance)){
                res.status(402).send({
                    code: 402,
                    error: {
                        "status": "Payment Required",
                        "message": "Insufficient Funds!" 
                    }        
                })
            }else{
                balance = parseFloat(balance) - transferAmount


                const data ={
                    updated_at: Date.now()
                }

                try{
                    await fs.firestore().collection('bank').doc('balance').set(data);

                    res.status(202).send({
                        code: 202,
                        data: {
                            "status": "Accepted",
                            "aval_balance": balance
                        }        
                    })
                }catch (err){
                    res.status(418).send({
                        code: 418,
                        error: {
                            "status": "Eroor",
                            "message": "Something Went Wrong!" 
                        }        
                    })
                }
     
                


            }

        }else{
            res.status(409).send({
                code: 409,
                error: {
                    "status": "Conflict",
                    "message": "Sorry, Your Currency Doenst Match with bank!" 
                }        
            })
        }

     }else{
        res.status(400).send({
            code: 400,
            error: {
                "status": "Bad Request",
                "message": "Invalid IBAN Number" 
            }        
        })
     }
   
}