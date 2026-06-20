import { useState, useEffect } from "react";
import aiService from "../../services/aiService";
import { SparkleIcon } from "../icons";

const AIInsights = ({ refreshKey }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const data = await aiService.getInsights();
        setInsights(data);
      } catch (err) {
        // non-critical, fail silently
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, [refreshKey]);

  if (loading || !insights) return null;

  return (
    <div className="pmp-card pmp-ai-card">
      <h6 className="pmp-card-title"><SparkleIcon /> AI Insights</h6>
      <p className="pmp-ai-message">{insights.message}</p>
      <p className="pmp-ai-suggestion">{insights.suggestion}</p>
    </div>
  );
};

export default AIInsights;