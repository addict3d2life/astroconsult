const express = require('express');
const cors = require('cors');
const app = express();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.use(express.static('.'));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/create-checkout-session', async (req, res) => {
    try {
        const { amount } = req.body;
        console.log("Получена сума от фронтенда:", amount);

        if (!amount || isNaN(amount)) {
            return res.status(400).json({ error: 'Невалидна сума' });
        }

        // Динамично определяме протокола и домейна (работи и на локал, и на Render)
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.get('host');
        const currentDomain = `${protocol}://${host}`;

        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded_page',
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: 'Астрологична консултация / Хороскоп',
                        },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            return_url: `${currentDomain}/success.html?session_id={CHECKOUT_SESSION_ID}`,
        });

        res.send({ clientSecret: session.client_secret });
    } catch (e) {
        console.error("ГРЕШКА ОТ STRIPE API:", e.message);
        res.status(500).json({ error: e.message });
    }
});

// Динамичен порт за локално тестване или други платформи (като Render)
const PORT = process.env.PORT || 3000;

// Ако сме локално, пускаме app.listen. Ако сме във Vercel, НЕ го пускаме, а само експортираме app!
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => console.log(`Сървърът работи на порт ${PORT}`));
}

// Задължително за Vercel Serverless Functions:
module.exports = app;
