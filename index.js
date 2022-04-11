const express = require("express");
const cors = require('cors');

const mercadopago = require('mercadopago');
const { response } = require("express");

const app = express();

app.use(express.static("public"));
app.use(express.json());

app.use(cors());

mercadopago.configurations.setAccessToken('APP_USR-5feae009-8ee0-483f-8399-7f6cc6e02ee3');

app.post("/create-payment-pix", async (req, res) => {
    const { amount, name, last_name, email, cpf } = req.body;

    var payment_data = {
        transaction_amount: amount,
        payment_method_id: 'pix',
        payer: {
          email: email,
          first_name: name,
          last_name,
          identification: {
              type: 'CPF',
              number: cpf
          }
        }
      }

      mercadopago.payment.create(payment_data).then(function (data) {
        res.send({
            pix: data.body.point_of_interaction.transaction_data.qr_code,
            qr_code: data.body.point_of_interaction.transaction_data.qr_code_base64,
            id: data.body.id
        })
    })
})

app.post("/not", (req, res) => {
  var id = req.query.id;

    mercadopago.payment.get(id, mercadopago, (error, response) => {
      if (error){
          console.log(error);
      }else{
          res.send({"status": response.body.status})
      }})
})
