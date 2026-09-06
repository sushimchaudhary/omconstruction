"use client";

import React, { useMemo } from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { Award, Star } from "lucide-react";

// Types Define
interface OrderItem {
  id?: string;
  menu_item_name?: string;
  [key: string]: any;
}

interface Order {
  id?: string;
  rating?: number | null;
  items?: OrderItem[];
  [key: string]: any;
}

interface MenuItemRatingCandleProps {
  orders?: Order[];
  primaryColor?: string;
}

// 🎨 Dynamic & Vibrant Colors Palette for each Menu Item
const ITEM_COLORS = [
  "#6366f1", // Indigo
  "#ec4899", // Pink
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#8b5cf6", // Purple
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#3b82f6", // Blue
];

export default function MenuItemRatingCandle({
  orders = [],
  primaryColor = "#6366f1",
}: MenuItemRatingCandleProps) {

  // Menu item name को आधारमा ratings process गर्ने
  const graphData = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    const stats: Record<
      string,
      { ratings: number[]; sum: number; count: number }
    > = {};

    orders.forEach((order) => {
      if (order.rating !== null && order.rating !== undefined) {
        order.items?.forEach((item) => {
          const itemName = item.menu_item_name || "Unknown Item";
          if (!stats[itemName]) {
            stats[itemName] = { ratings: [], sum: 0, count: 0 };
          }
          const currentRating = Number(order.rating);
          stats[itemName].ratings.push(currentRating);
          stats[itemName].sum += currentRating;
          stats[itemName].count += 1;
        });
      }
    });

    return Object.entries(stats)
      .map(([name, stat]) => {
        const minRating = Math.min(...stat.ratings);
        const maxRating = Math.max(...stat.ratings);
        const avgRating = Number((stat.sum / stat.count).toFixed(1));

        return {
          menu_item: name,
          min_rating: minRating,
          max_rating: maxRating,
          avg_rating: avgRating,
          // Candle body range (Min देखि Max सम्म देखाउन)
          candle_range: [minRating, maxRating],
          reviews: stat.count,
        };
      })
      .sort((a, b) => b.avg_rating - a.avg_rating);
  }, [orders]);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award size={18} style={{ color: primaryColor }} />
          <h3 className="text-sm font-bold text-gray-800">
            Menu Item Rating Candlestick
          </h3>
        </div>
        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
          <Star size={10} className="fill-amber-500" /> Scale (0-5)
        </span>
      </div>

      {/* Candle Chart Display */}
      {graphData.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-8">
          No rating records available.
        </p>
      ) : (
        <div className="w-full h-55">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={graphData}
              margin={{ top: 10, right: 20, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              
              <XAxis
                dataKey="menu_item"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#6b7280" }}
              />
              <YAxis
                domain={[0, 5]}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const row = payload[0].payload;
                    return (
                      <div className="bg-gray-900 text-white p-2.5 rounded-lg text-xs shadow-xl border border-gray-800">
                        <p className="font-bold mb-1 text-gray-100 capitalize">
                          {row.menu_item}
                        </p>
                        <p className="text-amber-300 flex items-center gap-1">
                          ★ Avg Rating: {row.avg_rating} / 5
                        </p>
                        <p className="text-emerald-400 mt-0.5">
                          High: {row.max_rating} | Low: {row.min_rating}
                        </p>
                        <p className="text-gray-400 mt-0.5">
                          Total Orders Rated: {row.reviews}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Candlestick Bar with Distinct Colors per Item */}
              <Bar dataKey="candle_range" radius={[4, 4, 4, 4]} barSize={22}>
                {graphData.map((entry, index) => (
                  <Cell
                    key={`candle-${index}`}
                    fill={ITEM_COLORS[index % ITEM_COLORS.length]}
                  />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}