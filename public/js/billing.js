const stripe = Stripe('pk_test_51RfFLLQkT9sgchaqrD365f47SrHRTY5CQcgDVqnGfFi0t2LXwQukNv1qlcYAImXO6BMI2stmHwqVoruCRZmhconD00I5vnGUop');
const buttons = document.querySelectorAll('.plan-card button');
const token = localStorage.getItem('arca-law-token');

buttons.forEach(button => {
    button.addEventListener('click', async (event) => {
        const priceId = event.target.dataset.priceId;
        try {
            const response = await fetch('/api/subscriptions/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ priceId: priceId })
            });
            const session = await response.json();
            if (!response.ok) {
                throw new Error(session.message || 'Erro do servidor');
            }
            await stripe.redirectToCheckout({ sessionId: session.id });
        } catch (error) {
            console.error('Erro ao redirecionar para o checkout:', error);
            alert(`Erro: ${error.message}`);
        }
    });
});