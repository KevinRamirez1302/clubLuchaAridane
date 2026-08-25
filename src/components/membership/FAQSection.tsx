// FAQ de membresías — acordeón accesible
import { useState } from 'react';
import faqsData from '../../data/faqs.json';
import type { FAQ } from '../../types';

const faqs = faqsData as FAQ[];

export default function FAQSection() {
  const [abierto, setAbierto] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto">
      <dl className="space-y-3">
        {faqs.map((faq) => {
          const isOpen = abierto === faq.id;
          return (
            <div
              key={faq.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <dt>
                <button
                  onClick={() => setAbierto(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-respuesta-${faq.id}`}
                  id={`faq-pregunta-${faq.id}`}
                  className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-gray-900 dark:text-white hover:text-club-blue dark:hover:text-club-blue-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-club-orange focus-visible:ring-inset"
                >
                  <span>{faq.pregunta}</span>
                  <span
                    className={`flex-shrink-0 ml-4 w-6 h-6 text-club-orange transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
              </dt>
              <dd
                id={`faq-respuesta-${faq.id}`}
                role="region"
                aria-labelledby={`faq-pregunta-${faq.id}`}
                className={`transition-all duration-300 overflow-hidden ${
                  isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="px-6 pb-5 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-50 dark:border-gray-700 pt-3">
                  {faq.respuesta}
                </p>
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
