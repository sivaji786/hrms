import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useCurrency, currencies, CurrencyCode } from '../../contexts/CurrencyContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Coins, Check } from 'lucide-react';

export default function CurrencyDropdown() {
  const { currencyCode, setCurrencyCode, currency } = useCurrency();
  const { t } = useLanguage();

  return (
    <Select value={currencyCode} onValueChange={(value) => setCurrencyCode(value as CurrencyCode)}>
      <SelectTrigger className="w-auto min-w-[120px] sm:min-w-[140px] bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500/20">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-sm">
            <Coins className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-semibold text-gray-700">{currency.symbol}</span>
            <span className="text-sm font-medium text-gray-600 hidden sm:inline">{currencyCode}</span>
          </div>
        </div>
      </SelectTrigger>
      <SelectContent className="min-w-[280px] max-w-[340px]">
        <div className="px-3 py-2 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
            <Coins className="w-3.5 h-3.5 text-blue-600" />
            {t('common.selectCurrency')}
          </p>
        </div>
        <div className="py-1">
          {Object.values(currencies).map((curr) => (
            <SelectItem 
              key={curr.code} 
              value={curr.code}
              className="cursor-pointer hover:bg-blue-50/50 focus:bg-blue-50 mx-1 rounded-md my-0.5"
            >
              <div className="flex items-center justify-between w-full gap-3 py-1.5">
                <div className="flex items-center gap-3">
                  <div className={`
                    w-11 h-11 rounded-lg flex items-center justify-center text-xl font-semibold
                    ${curr.code === currencyCode 
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30' 
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700'
                    }
                    transition-all duration-200
                  `}>
                    {curr.symbol}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{curr.code}</span>
                      {curr.code === currencyCode && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{curr.name}</span>
                  </div>
                </div>
              </div>
            </SelectItem>
          ))}
        </div>
        <div className="px-3 py-2 mt-1 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            {t('common.currencyRatesNote')}
          </p>
        </div>
      </SelectContent>
    </Select>
  );
}
