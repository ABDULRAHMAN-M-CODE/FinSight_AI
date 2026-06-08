
import { Briefcase, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

import { type FullAdviceDataType } from './MultiStepContext';
import { type InvestementsAdviceType } from './MultiStepContext';
import { useEffect } from 'react';
import { useState } from 'react';
import * as Tooltip from "@radix-ui/react-tooltip";
import { assetMetadata } from "../data/assetMetadata";
import SectorAllocationPie from '../Components/SectorAllocationPie';
import { sectorMap } from "../data/sectorMap";
type rebalancingDataType ={
    tradeOrders: {
        assetName: string;
        action: string;
        numOfShares: number;
    }[];
    rebalancingNeedDetectedAt: string;
}
const rebalanceDataDefaults: rebalancingDataType = {
  rebalancingNeedDetectedAt: "2026-05-08T09:00:00Z", // When the check occurred
  tradeOrders: [
    {
      assetName: "default1",
      action: "SELL",
      numOfShares: 50.5
    },
    {
      assetName: "default2",
      action: "BUY",
      numOfShares: 120
    },
    {
      assetName: "default3",
      action: "BUY",
      numOfShares: 75
    }
  ]
};


const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;






export default function PortfolioAnalytics() {
  const [mockData, setMockData] = useState<InvestementsAdviceType | null>(null);
  const [message, setMessage] = useState<string>("Portfolio is not ready yet");
  const [needsRebalancing,setNeedsRebalancing] =useState<boolean>(false);
  const [rebalancingData, setRebalancingData] = useState<rebalancingDataType>(rebalanceDataDefaults); 

  useEffect(()=>{    
    const fetchUserData=async ()=>{
          try {
            const response = await fetch("http://localhost:8000/mocks/get_investements_advice_mocks", { 
              method: "GET",
              headers: { "Content-Type": "application/json" },
              credentials:"include"              
            });
            if (!response.ok) {
                const error = await response.json();
                console.log("could not fetch portfolio data or the portfolio is not ready yet, more details:",error)
                setMessage(error.detail)
                return;
            }
            const data = await response.json();
            setMockData(data);
          } catch (error) {
            console.log(error);// Executed correctly
            setMessage("Please check your internet connection.")
            
          } 
    }
    fetchUserData();

  },[])
  useEffect(() => {


    const websocket = new WebSocket(
        "ws://localhost:8000/ws/rebalancing"
    );

    websocket.onopen = () => {
        console.log("websocket connected");
    };

    websocket.onmessage = (event) => {

        const backendData = JSON.parse(event.data);
        
        console.log("received backend data", backendData);

        setRebalancingData(backendData);

        if (
            backendData &&
            backendData.tradeOrders &&
            backendData.tradeOrders.length > 0
        ) {
            setNeedsRebalancing(true);
        } else {
            setNeedsRebalancing(false);
        }
    };

    websocket.onclose = () => {
        console.log("websocket disconnected");
    };

    websocket.onerror = (error) => {
        console.log("websocket error", error);
    };

    return () => {
        websocket.close();
    };

}, []);
  
  if(!mockData){
    return(
      <>
        <p> {message}</p>
      </>
    )
  }
  
  
  
  
  
  
  
  
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-blue-600" />
            Recommended Portfolio
          </h1>
          <p className="text-gray-500 mt-2">Based on the Black-Litterman model and Efficient Frontier optimization.</p>
        </header>
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
                      
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockData.optimalPortfolio.assets.map((asset) => (
                      <tr key={asset.assetName} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-gray-900">
                            <Tooltip.Provider>
                                <Tooltip.Root>
                                    <Tooltip.Trigger asChild>
                                        <span className="cursor-help underline decoration-dotted">
                                            {asset.assetName}
                                        </span>
                                    </Tooltip.Trigger>

                                    <Tooltip.Portal>
                                        <Tooltip.Content
                                            side="top"
                                            className="
                                                z-50
                                                max-w-xs
                                                rounded-lg
                                                border
                                                bg-white
                                                p-4
                                                shadow-lg
                                            "
                                        >
                                            <div className="space-y-2">
                                                <div className="font-semibold">
                                                    {
                                                        assetMetadata[asset.assetName]?.name ??
                                                        asset.assetName
                                                    }
                                                </div>

                                                <div className="text-xs text-gray-500">
                                                    Sector:
                                                    {" "}
                                                    {
                                                        assetMetadata[asset.assetName]?.sector ??
                                                        "Unknown"
                                                    }
                                                </div>

                                                <div className="text-sm text-gray-700">
                                                    {
                                                        assetMetadata[asset.assetName]?.description ??
                                                        "No description available."
                                                    }
                                                </div>
                                            </div>
                                        </Tooltip.Content>
                                    </Tooltip.Portal>
                                </Tooltip.Root>
                            </Tooltip.Provider>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{Number((100*asset.capitalAllocationPercentage).toFixed(2))}%</td>
                        
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
        <SectorAllocationPie
            assets={mockData.optimalPortfolio.assets}
            sectorMap={sectorMap}
        />
      </div>
    </div>
  );
}
