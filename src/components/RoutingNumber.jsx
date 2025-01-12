import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
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
  
  const filteredBanks = bankData.filter(bank =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Encuentra tu Número de Ruta Bancaria
        </h2>
        <p className="text-gray-600">
          Selecciona tu banco para ver instrucciones sobre cómo encontrar tu número de ruta.
        </p>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          placeholder="Buscar banco..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Lista de bancos */}
      <Accordion type="single" collapsible className="w-full">
        {filteredBanks.map((bank) => (
          <AccordionItem key={bank.id} value={bank.id}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center">
                <span className="text-lg font-medium">{bank.name}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-4 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Cómo encontrar tu número de ruta:</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    {bank.routingInfo.steps.map((step, index) => (
                      <li key={index} className="text-gray-600">{step}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Números de ruta comunes por estado:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {bank.routingInfo.commonNumbers.map((item, index) => (
                      <div key={index} className="bg-white p-3 rounded-md border border-gray-200">
                        <p className="font-medium text-gray-700">{item.state}</p>
                        <p className="text-gray-600">{item.number}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Mensaje cuando no hay resultados */}
      {filteredBanks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No se encontraron bancos que coincidan con tu búsqueda.</p>
        </div>
      )}
    </div>
  );
};

export default RoutingNumber;