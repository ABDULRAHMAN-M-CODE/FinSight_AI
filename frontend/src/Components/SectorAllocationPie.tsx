import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";

type Asset = {
    assetName: string;
    capitalAllocationPercentage: number;
};

type Props = {
    assets: Asset[];
    sectorMap: Record<string, string>;
};
const COLORS = [
    "#2563eb", // blue
    "#16a34a", // green
    "#dc2626", // red
    "#ca8a04", // yellow
    "#9333ea", // purple
    "#ea580c", // orange
    "#0891b2", // cyan
    "#db2777", // pink
];
export default function SectorAllocationPie({
    assets,
    sectorMap
}: Props) {
    const sectorTotals: Record<string, number> = {};

    assets.forEach(asset => {
        const sector =
            sectorMap[asset.assetName] ?? "unknown";

        sectorTotals[sector] =
            (sectorTotals[sector] ?? 0) +
            asset.capitalAllocationPercentage;
    });

    const data = Object.entries(sectorTotals).map(
        ([sector, value]) => ({
            sector,
            value
        })
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">
                Sector Allocation
            </h2>

            <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="sector"
                            outerRadius={140}
                            label={({ percent }) =>
                                `${((percent ?? 0) * 100).toFixed(1)}%`
                            }
                        >
                            {data.map((_, index) => (
                                <Cell
                                    key={index}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>

                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}