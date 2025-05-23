import React from 'react';
import CheckoutForm from '../components/carritoPagos/checkout';
import Footer from '../components/common/footer';

const CheckoutPage = () => {
  return (
    <div className="min-h-screen bg-[#272727] flex flex-col w-screen overflow-hidden">
      <CheckoutForm />
      <Footer />
    </div>
  );
};

export default CheckoutPage;