import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DollarSign, Check, Info, Save } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import toast from '../utils/toast';
import {
  getSelectedCurrency,
  setSelectedCurrency,
  availableCurrencies,
  type Currency
} from '../data/currencySettings';

// Helper function to format currency
const formatCurrency = (amount: number, currency: Currency): string => {
  const formatted = amount.toFixed(currency.decimalPlaces)
    .replace('.', currency.decimalSeparator)
    .replace(/\B(?=(\d{3})+(?!\d))/g, currency.thousandSeparator);

  return currency.symbolPosition === 'before'
    ? `${currency.symbol}${formatted}`
    : `${formatted}${currency.symbol}`;
};

export default function CurrencySettings() {
  const { t } = useLanguage();
  const [selectedCurrencyCode, setSelectedCurrencyCodeState] = useState(getSelectedCurrency().code);
  const [hasChanges, setHasChanges] = useState(false);

  const handleCurrencyChange = (code: string) => {
    setSelectedCurrencyCodeState(code);
    setHasChanges(true);
  };

  const handleSave = () => {
    const success = setSelectedCurrency(selectedCurrencyCode);
    if (success) {
      toast.success(t('admin.currencyUpdated'), {
        description: t('admin.currencyUpdatedDesc'),
      });
      setHasChanges(false);
      // Reload the page to apply changes throughout the app
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      toast.error(t('common.error'), {
        description: t('admin.currencyUpdateFailed'),
      });
    }
  };

  const selectedCurrency = availableCurrencies.find(c => c.code === selectedCurrencyCode);
  const currentCurrency = getSelectedCurrency();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl mb-2">{t('admin.currencySettings')}</h3>
        <p className="text-gray-500">{t('admin.currencySettingsDesc')}</p>
      </div>

      {/* Current Currency Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            {t('admin.currentCurrency')}
          </CardTitle>
          <CardDescription>{t('admin.currentCurrencyDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{currentCurrency.symbol}</span>
                <span className="text-xl">{currentCurrency.name}</span>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  {currentCurrency.code}
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                {t('admin.exampleAmount')}: {formatCurrency(1234567.89, currentCurrency)}
              </div>
            </div>
            <Check className="w-8 h-8 text-blue-600" />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="mb-1">{t('admin.currencyWarning')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Currency */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.changeCurrency')}</CardTitle>
          <CardDescription>{t('admin.changeCurrencyDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currency-select">{t('admin.selectCurrency')}</Label>
            <Select value={selectedCurrencyCode} onValueChange={handleCurrencyChange}>
              <SelectTrigger id="currency-select">
                <SelectValue placeholder={t('admin.selectCurrencyPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {availableCurrencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{currency.symbol}</span>
                      <span>{currency.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {currency.code}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCurrency && (
            <div className="p-4 bg-gray-50 rounded-lg border space-y-3">
              <h4 className="text-sm text-gray-700">{t('admin.currencyPreview')}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('admin.currencyName')}</p>
                  <p className="text-sm">{selectedCurrency.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('admin.currencyCode')}</p>
                  <p className="text-sm">{selectedCurrency.code}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('admin.currencySymbol')}</p>
                  <p className="text-xl">{selectedCurrency.symbol}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('admin.symbolPosition')}</p>
                  <p className="text-sm capitalize">{selectedCurrency.symbolPosition}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('admin.decimalPlaces')}</p>
                  <p className="text-sm">{selectedCurrency.decimalPlaces}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('admin.separators')}</p>
                  <p className="text-sm">
                    {t('admin.thousand')}: {selectedCurrency.thousandSeparator} | {t('admin.decimal')}: {selectedCurrency.decimalSeparator}
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t">
                <p className="text-xs text-gray-500 mb-1">{t('admin.formatExample')}</p>
                <p className="text-lg">{formatCurrency(1234567.89, selectedCurrency)}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={!hasChanges}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {t('admin.saveCurrency')}
            </Button>
            {hasChanges && (
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCurrencyCodeState(currentCurrency.code);
                  setHasChanges(false);
                }}
              >
                {t('common.cancel')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Available Currencies List */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.availableCurrencies')}</CardTitle>
          <CardDescription>
            {t('admin.availableCurrenciesDesc', { count: availableCurrencies.length })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableCurrencies.map((currency) => (
              <div
                key={currency.code}
                className={`p-3 border rounded-lg transition-colors ${currency.code === currentCurrency.code
                  ? 'bg-blue-50 border-blue-300'
                  : 'bg-white hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl">{currency.symbol}</span>
                  <Badge
                    variant={currency.code === currentCurrency.code ? 'default' : 'outline'}
                    className={currency.code === currentCurrency.code ? 'bg-blue-600' : ''}
                  >
                    {currency.code}
                  </Badge>
                </div>
                <p className="text-sm">{currency.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(12345, currency)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}