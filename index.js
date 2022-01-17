const express = require("express");
const cors = require('cors');

const mercadopago = require('mercadopago');

const app = express();

app.use(express.static("public"));
app.use(express.json());

app.use(cors());

mercadopago.configurations.setAccessToken('APP_USR-6278788611971337-122401-8fa0d12a8b3277c1e2b5562677e34df4-351591541');

app.post("/create-payment-pix", async (req, res) => {
    const { amount, name, last_name, email, cpf } = req.body;

    var payment_data = {
        transaction_amount: amount,
        description: 'Título do produto',
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
            qr_code: data.body.point_of_interaction.transaction_data.qr_code_base64
        })
    })
})
app.connection({
  port: process.env.PORT || 3000 
});