import axiosInstance from "@/lib/config/axios.config";

// --- Types & Interfaces ---

export interface SalesInsightResponse {
  success: boolean;
  insights: string; // Markdown formatted insight text
}

export interface MenuRecommendationResponse {
  success: boolean;
  recommendations: Array<{
    item_id?: string;
    item_name: string;
    suggestion: string;
    action: "PROMOTE" | "DISCOUNT" | "REMOVE" | "COMBO";
  }>;
}

export interface SmartAssistantResponse {
  success: boolean;
  reply: string;
}

export interface CustomerTrendResponse {
  success: boolean;
  summary: string;
  popular_items: string[];
  peak_hours: string;
}

// --- AI Services ---

export const AIServices = {
  /**
   * 1. Dashboard Sales Insights
   * Usage: Admin Dashboard UI
   * Goal: Sales & Revenue analytics, suggestions to increase revenue
   */
  getSalesInsights: async (): Promise<SalesInsightResponse> => {
    const res = await axiosInstance.get("/ai/sales-insight");
    return res.data;
  },

  /**
   * 2. Menu Optimization Suggestions
   * Usage: Menu Management Page
   * Goal: Suggest items to promote, discount, remove, or turn into combos
   */
  getMenuRecommendations: async (): Promise<MenuRecommendationResponse> => {
    const res = await axiosInstance.get("/ai/menu-recommendations");
    return res.data;
  },

  /**
   * 3. AI Smart Waiter / POS Assistant Chat
   * Usage: POS / Order Creation Page
   * Goal: Ask queries like "Suggest best veg combos under Rs. 1000" or order related questions
   */
  askSmartAssistant: async (
    prompt: string,
    context?: { currentOrderItems?: any[]; tableNo?: string }
  ): Promise<SmartAssistantResponse> => {
    const res = await axiosInstance.post("/ai/ask-assistant", {
      prompt,
      context,
    });
    return res.data;
  },

  /**
   * 4. Customer Buying Trends & Reports
   * Usage: Reports & Analytics Page
   * Goal: Deep analysis on peak hours and popular items
   */
  getCustomerTrends: async (
    dateRange?: "7days" | "30days" | "custom"
  ): Promise<CustomerTrendResponse> => {
    const res = await axiosInstance.get("/ai/customer-trends", {
      params: { range: dateRange || "7days" },
    });
    return res.data;
  },
};