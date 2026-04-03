
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Briefcase, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

import { type FullAdviceDataType } from './MultiStepContext';
import { type InvestementsAdviceType } from './MultiStepContext';
import { useEffect } from 'react';
import { useState } from 'react';




const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isFrontier = !data.ticker;
    
    return (
      <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-lg">
        {!isFrontier && (
          <p className="font-bold text-gray-800 mb-2">{data.ticker}</p>
        )}
        {isFrontier && (
          <p className="font-bold text-emerald-600 mb-2">Efficient Frontier</p>
        )}
        <div className="text-sm space-y-1">
          <p className="text-gray-600">
            <span className="font-medium">Return:</span> {formatPercent(data.expectedReturn)}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Volatility:</span> {formatPercent(data.volatility)}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

//PROBLEM: DESIGN BACKEND THAT GIVES US THIS DATA; INJECT IT INSIDE THE InvestementsAdvice inside the FullAdviceData
const rebalancingData= {
    tradeOrders: [
      { assetName: "AAPL", action: "Sell", numOfShares: 10 },
      { assetName: "BABA", action: "Buy", numOfShares: 15 },
      { assetName: "MA", action: "Sell", numOfShares: 5 }
    ],
    rebalancingNeedDetectedAt: "March 20, 2026, 15:42"
  }
//rendering

export default function PortfolioAnalytics() {
  const [mockData, setMockData] = useState<InvestementsAdviceType | null>(null);
  const [needsRebalancing,setNeedsRebalancing] =useState<boolean>(false); 
   // PROBLEM: use 'useQuery' instead of locat storage
  useEffect(()=>{
    const rawString:string |null =localStorage.getItem("FullAdviceData")
    if(rawString){
      const backendData:FullAdviceDataType=JSON.parse(rawString)
      setMockData(backendData.investementsAdvice)
    }
  },[]) /** question : why not to define custome hook that contains those two hooks , so that I get rid of this useEffect ? */
  
  if(!mockData){
    return(
      <>
        <p> there is no data to render</p>
      </>
    )
  }
  
  
  
  //PROBLEM in rebalncing : rebalancingData.tradeOrders.length < 0;
 
  console.log("Recommended portfolio data: ",mockData.optimalPortfolio)
  console.log("leftover is :", mockData.leftover)
  console.log("number of assets shown on the scatter plot",mockData.assetsScatter.length)
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-blue-600" />
            Portfolio Analytics
          </h1>
          <p className="text-gray-500 mt-2">Interactive review of your asset allocation and efficient frontier.</p>
        </header>

        {/* 1. Market Overview */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50/50">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gray-500" />
              Market Overview
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Risk-return profile of assets and the efficient frontier.
            </p>
          </div>
          <div className="p-6">
            <div className="h-[450px] w-full">
              <ResponsiveContainer width="100%" height={500}>
                
                <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    type="number" 
                    dataKey="volatility" 
                    name="Volatility" 
                    tickFormatter={(tick) => `${(tick * 100).toFixed(0)}%`}
                    domain={['auto', 'auto']}
                    padding={{ left: 20, right: 20 }}
                    label={{ value: 'Volatility (Risk)', position: 'insideBottom', offset: -10 }}
                  />
                  
                  <YAxis 
                    type="number" 
                    dataKey="expectedReturn" 
                    name="Return" 
                    tickFormatter={(tick) => `${(tick * 100).toFixed(0)}%`}
                    domain={['auto', 'auto']}
                    padding={{ top: 20, bottom: 20 }}
                    label={{ value: 'Expected Return', angle: -90, position: 'insideLeft', offset: 0 }}
                  />

                  <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                  <Legend verticalAlign="top" height={36}/>
                  
                  {/* Efficient Frontier as a line using Scatter */}
                  <Scatter 
                    name="Efficient Frontier" 
                    data={mockData.efficientFrontierPoints} 
                    fill="#10b981"
                    stroke="#10b981" 
                    strokeWidth={2}
                    line={{ stroke: '#23342e', strokeWidth: 2 }}
                    shape={() => null} 
                  />
                  
                  {/* Assets */}
                  <Scatter 
                    name="Assets" 
                    data={mockData.assetsScatter} 
                    fill="#3b82f6" 
                  />
                </ScatterChart>
              
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/** Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 2. Optimal Portfolio Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50/50">
              <h2 className="text-xl font-semibold">Optimal Portfolio</h2>
            </div>
            
            <div className="p-6">
              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-600/80 font-medium mb-1">Expected Return</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatPercent(mockData.optimalPortfolio.metrics.expectedAnnualReturn)}
                  </p>
                </div>
                <div className="bg-orange-50/50 p-4 rounded-lg border border-orange-100">
                  <p className="text-sm text-orange-600/80 font-medium mb-1">Volatility</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {formatPercent(mockData.optimalPortfolio.metrics.annualVolatility)}
                  </p>
                </div>
                <div className="bg-purple-50/50 p-4 rounded-lg border border-purple-100">
                  <p className="text-sm text-purple-600/80 font-medium mb-1">Sharpe Ratio</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {Number((mockData.optimalPortfolio.metrics.sharpeRatio).toFixed(2))}
                  </p>
                </div>
              </div>

              {/* Assets Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-3 font-medium rounded-tl-lg">Asset</th>
                      <th className="px-4 py-3 font-medium">Allocation</th>
                      <th className="px-4 py-3 font-medium rounded-tr-lg text-right">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockData.optimalPortfolio.assets.map((asset) => (
                      <tr key={asset.assetName} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-gray-900">{asset.assetName}</td>
                        <td className="px-4 py-3 text-gray-600">{Number((100*asset.capitalAllocationPercentage).toFixed(2))}%</td>
                        <td className="px-4 py-3 text-gray-600 text-right">{asset.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 3. Rebalancing Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Rebalancing</h2>
              <div className="flex items-center text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">
                <Clock className="w-3 h-3 mr-1.5" />
                {rebalancingData.rebalancingNeedDetectedAt}{/**mockData.rebalancingData.rebalancingNeedDetectedAt */}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              {!needsRebalancing ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-green-50/30 rounded-lg border border-green-100">
                  <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-medium text-green-900 mb-2">Portfolio Aligned</h3>
                  <p className="text-green-700 max-w-sm">
                    Your portfolio is currently aligned with its target allocation. No rebalancing is required.
                  </p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-lg border border-amber-200 mb-6">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-amber-900">Rebalancing Required</h3>
                      <p className="text-sm text-amber-700 mt-1">
                        Execute the following trade orders to align your portfolio with the optimal allocation strategy.
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-gray-100 rounded-lg">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-gray-600">
                        <tr>
                          <th className="px-4 py-3 font-medium">Asset</th>
                          <th className="px-4 py-3 font-medium">Action</th>
                          <th className="px-4 py-3 font-medium text-right">Shares</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {/**mockData.rebalancingData.tradeOrders.map((order, i) */}
                        {rebalancingData.tradeOrders.map((order, i) => (
                          <tr key={i} className="hover:bg-gray-50/50">
                            <td className="px-4 py-3 font-medium text-gray-900">{order.assetName}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                order.action === 'Buy' 
                                  ? 'bg-blue-100 text-blue-700' 
                                  : 'bg-rose-100 text-rose-700'
                              }`}>
                                {order.action}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-600 text-right font-medium">{order.numOfShares}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
