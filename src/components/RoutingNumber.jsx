import React, { useState } from 'react';
import { Search, Building2, MapPin, Landmark } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

const bankData = [
  {
    id: 'bofa',
    name: 'Bank of America',
    routingInfo: {
      steps: [
        'Ingresa a tu cuenta en línea de Bank of America',
        'Ve a la sección "Account Details" o "Account Information"',
        'El número de ruta (Routing Number) aparecerá junto a tu número de cuenta',
        'También puedes encontrarlo en la parte inferior de tus cheques'
      ],
      commonNumbers: [
        { state: 'California', number: '121000358' },
        { state: 'Florida', number: '063100277' },
        { state: 'Texas', number: '111000025' },
        { state: 'New York', number: '021000322' }
      ]
    }
  },
  {
    id: 'chase',
    name: 'Chase Bank',
    routingInfo: {
      steps: [
        'Inicia sesión en tu cuenta de Chase',
        'Selecciona la cuenta para la que necesitas el número de ruta',
        'Haz clic en "Ver detalles completos de la cuenta"',
        'El número de ruta se mostrará en la información de la cuenta'
      ],
      commonNumbers: [
        { state: 'California', number: '322271627' },
        { state: 'New York', number: '021000021' },
        { state: 'Illinois', number: '071000013' },
        { state: 'Texas', number: '111000614' }
      ]
    }
  },
  {
    id: 'wells',
    name: 'Wells Fargo',
    routingInfo: {
      steps: [
        'Accede a tu cuenta de Wells Fargo en línea',
        'Ve a "Cuenta" y selecciona la cuenta específica',
        'Busca "Números de cuenta" o "Detalles de cuenta"',
        'El número de ruta se mostrará en los detalles de la cuenta'
      ],
      commonNumbers: [
        { state: 'California', number: '121042882' },
        { state: 'Texas', number: '111900659' },
        { state: 'Florida', number: '063107513' },
        { state: 'New York', number: '026012881' }
      ]
    }
  },
  {
    id: 'citi',
    name: 'Citibank',
    routingInfo: {
      steps: [
        'Ingresa a tu cuenta de Citibank',
        'Selecciona la cuenta para ver sus detalles',
        'Busca en la sección "Información de cuenta"',
        'El número de ruta estará listado junto con otra información bancaria'
      ],
      commonNumbers: [
        { state: 'New York', number: '021000089' },
        { state: 'California', number: '321171184' },
        { state: 'Florida', number: '266086554' },
        { state: 'Illinois', number: '271070801' }
      ]
    }
  },
  {
    id: 'pnc',
    name: 'PNC Bank',
    routingInfo: {
      steps: [
        'Inicia sesión en tu cuenta de PNC Bank',
        'Selecciona la cuenta para ver los detalles',
        'Busca la sección "Routing and Account Numbers"',
        'El número de ruta estará listado junto con otros detalles'
      ],
      commonNumbers: [
        { state: 'Pennsylvania', number: '031000053' },
        { state: 'Ohio', number: '042000398' },
        { state: 'Illinois', number: '071921891' },
        { state: 'Florida', number: '267084199' }
      ]
    }
  },
  {
    id: 'usbank',
    name: 'US Bank',
    routingInfo: {
      steps: [
        'Ingresa a tu cuenta de US Bank',
        'Ve a la sección de detalles de la cuenta',
        'Busca "Routing Number"',
        'El número de ruta estará visible en la parte superior de la información de la cuenta'
      ],
      commonNumbers: [
        { state: 'California', number: '122105155' },
        { state: 'Minnesota', number: '091000022' },
        { state: 'Oregon', number: '123000220' },
        { state: 'Washington', number: '125000105' }
      ]
    }
  },
  {
    id: 'capitalone',
    name: 'Capital One',
    routingInfo: {
      steps: [
        'Accede a tu cuenta de Capital One en línea',
        'Ve a la sección "Información de la cuenta"',
        'Busca la pestaña de "Routing and Account Details"',
        'El número de ruta aparecerá en la parte superior'
      ],
      commonNumbers: [
        { state: 'Texas', number: '111901014' },
        { state: 'Virginia', number: '056073502' },
        { state: 'Louisiana', number: '065000090' },
        { state: 'New York', number: '051405515' }
      ]
    }
  }
];

const RoutingNumber = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBank, setSelectedBank] = useState(null);
  
  const filteredBanks = bankData.filter(bank =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header con diseño moderno */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-red-50 rounded-full mb-4">
            <Landmark className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Encuentra tu Número de Ruta Bancaria
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Selecciona tu banco y obtén instrucciones detalladas para encontrar tu número de ruta.
          </p>
        </div>

        {/* Barra de búsqueda modernizada */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 border-0 rounded-xl bg-white shadow-lg 
                     focus:ring-2 focus:ring-red-500 placeholder-gray-400 transition-shadow
                     duration-200 hover:shadow-xl"
            placeholder="Busca tu banco aquí..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Lista de bancos con diseño moderno */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <Accordion 
            type="single" 
            collapsible 
            className="divide-y divide-gray-100"
          >
            {filteredBanks.map((bank) => (
              <AccordionItem 
                key={bank.id} 
                value={bank.id}
                className="group"
              >
                <AccordionTrigger className="hover:no-underline px-6 py-4">
                  <div className="flex items-center gap-4 w-full">
                    <div className="flex-shrink-0 w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                        {bank.name}
                      </h3>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6">
                    {/* Instrucciones */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Instrucciones paso a paso
                      </h4>
                      <ol className="space-y-3">
                        {bank.routingInfo.steps.map((step, index) => (
                          <li 
                            key={index}
                            className="flex items-start gap-3 text-gray-600"
                          >
                            <span className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-sm font-medium text-red-600">
                              {index + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Números de ruta por estado */}
                    <div>
                      <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                        <MapPin className="h-5 w-5 text-red-600" />
                        Números de ruta por estado
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {bank.routingInfo.commonNumbers.map((item, index) => (
                          <div 
                            key={index}
                            className="bg-white rounded-lg border border-gray-200 p-4 hover:border-red-200 hover:shadow-md transition-all duration-200"
                          >
                            <p className="font-medium text-gray-900 mb-1">{item.state}</p>
                            <p className="text-red-600 font-mono text-lg">{item.number}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Mensaje de no resultados modernizado */}
        {filteredBanks.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No encontramos resultados
            </h3>
            <p className="text-gray-500">
              Intenta con otro término de búsqueda
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutingNumber;