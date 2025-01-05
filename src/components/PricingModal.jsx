import React from 'react';

const PricingModal = ({ onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full mx-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Selecciona tu Plan
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Plan Estándar */}
          <div 
            onClick={() => onSelect('standard', 60)}
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer hover:border-red-500"
          >
            <h3 className="text-xl font-bold text-red-600 mb-4">Plan Estándar</h3>
            <p className="text-3xl font-bold text-gray-800 mb-4">
              $60 <span className="text-sm text-gray-600">USD</span>
            </p>
            <ul className="space-y-3 text-gray-600 mb-6">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Declaración de impuestos básica
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Procesamiento estándar
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Soporte por correo electrónico
              </li>
            </ul>
            <button className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors">
              Seleccionar Plan Estándar
            </button>
          </div>

          {/* Plan Premium */}
          <div 
            onClick={() => onSelect('premium', 150)}
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer hover:border-red-500"
          >
            <h3 className="text-xl font-bold text-red-600 mb-4">Plan Premium</h3>
            <p className="text-3xl font-bold text-gray-800 mb-4">
              $150 <span className="text-sm text-gray-600">USD</span>
            </p>
            <div className="bg-green-100 text-green-800 text-sm p-2 rounded-md mb-4">
              Bono estimado: $900 - $1,200 extra
            </div>
            <ul className="space-y-3 text-gray-600 mb-6">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Todo lo del plan estándar
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Procesamiento prioritario
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Soporte prioritario por WhatsApp
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Maximización de reembolso
              </li>
            </ul>
            <button className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors">
              Seleccionar Plan Premium
            </button>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="mt-6 w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default PricingModal;