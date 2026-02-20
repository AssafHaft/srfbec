/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Zap, Wind, DollarSign } from 'lucide-react';

export default function App() {
  const [inputs, setInputs] = useState({
    totalKW: '',
    totalNIS: '',
    machineKW: '',
    billabongKW: ''
  });
  const [result, setResult] = useState<null | {
    rate: number;
    directKW: number;
    acShareKW: number;
    totalKW: number;
    finalNIS: number;
  }>(null);

  const calculate = () => {
    const tKW = parseFloat(inputs.totalKW) || 0;
    const tNIS = parseFloat(inputs.totalNIS) || 0;
    const mKW = parseFloat(inputs.machineKW) || 0;
    const bKW = parseFloat(inputs.billabongKW) || 0;

    if (!tKW || !tNIS) {
      alert("Please enter the main bill details.");
      return;
    }

    const rate = tNIS / tKW;
    const parkGeneralKW = tKW - mKW;
    // 50% of the base park consumption is the AC pool
    const totalAcKW = parkGeneralKW * 0.50; 
    // Billabong pays for 3.4% of the AC pool
    const bShareAcKW = totalAcKW * 0.034; 
    
    const totalBilledKW = bKW + bShareAcKW;
    const finalNIS = totalBilledKW * rate;

    setResult({
      rate,
      directKW: bKW,
      acShareKW: bShareAcKW,
      totalKW: totalBilledKW,
      finalNIS
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] font-sans text-[#1d1d1f] flex items-center justify-center p-4">
      {/* Card */}
      <div className="w-full max-w-[440px] bg-white rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-8 md:p-10">
        <header className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Billabong Invoice Tool</h1>
          <p className="text-[#86868b] text-sm">SurfparkTLV Maintenance & IT</p>
        </header>

        <div className="space-y-5">
          {/* Inputs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Utility Bill (KW)</label>
            <div className="relative">
              <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="number" 
                value={inputs.totalKW}
                onChange={(e) => setInputs({...inputs, totalKW: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-[#d2d2d7] rounded-xl focus:outline-none focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] transition-all"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Utility Cost (NIS)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="number" 
                value={inputs.totalNIS}
                onChange={(e) => setInputs({...inputs, totalNIS: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-[#d2d2d7] rounded-xl focus:outline-none focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] transition-all"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Wave Machine Meter (KW)</label>
            <div className="relative">
              <Wind className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="number" 
                value={inputs.machineKW}
                onChange={(e) => setInputs({...inputs, machineKW: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-[#d2d2d7] rounded-xl focus:outline-none focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] transition-all"
                placeholder="0"
              />
            </div>
          </div>

          <div className="bg-[#fff9db] p-4 rounded-xl border border-[#ffe066]">
            <label className="block text-sm font-medium text-[#856404] mb-2">Billabong Cabinet Meter (KW)</label>
            <input 
              type="number" 
              value={inputs.billabongKW}
              onChange={(e) => setInputs({...inputs, billabongKW: e.target.value})}
              className="w-full px-4 py-3 border border-[#d2d2d7] rounded-xl focus:outline-none focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] transition-all bg-white"
              placeholder="0"
            />
          </div>

          <button 
            onClick={calculate}
            className="w-full py-3.5 bg-[#0071e3] hover:bg-[#0077ED] active:scale-[0.98] text-white font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Calculate Invoice
          </button>
        </div>

        {result && (
          <div className="mt-8 p-6 bg-[#f2f2f2] rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            <span className="block text-xs font-bold text-[#6e6e73] uppercase tracking-wider text-center mb-1">Amount to Invoice</span>
            <div className="text-4xl font-bold text-[#28a745] text-center mb-4">
              {new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(result.finalNIS)}
            </div>
            
            <div className="border-t border-[#d2d2d7] pt-4 space-y-2 text-sm text-[#1d1d1f]">
              <div className="flex justify-between">
                <span className="text-[#86868b]">Avg Rate</span>
                <span className="font-medium">₪{result.rate.toFixed(4)} / KW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#86868b]">Direct Meter</span>
                <span className="font-medium">{result.directKW.toLocaleString()} KW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#86868b]">AC Share (3.4%)</span>
                <span className="font-medium">{result.acShareKW.toFixed(2)} KW</span>
              </div>
              <div className="flex justify-between pt-2 font-semibold border-t border-[#d2d2d7]/50 mt-2">
                <span>Total Billed</span>
                <span>{result.totalKW.toFixed(2)} KW</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
