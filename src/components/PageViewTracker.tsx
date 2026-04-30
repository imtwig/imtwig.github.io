import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const VISITOR_KEY = "visitor_id";

function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return "anonymous";
  }
}

const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Skip CMS admin pages
    if (location.pathname.startsWith("/cms")) return;

    const visitorId = getVisitorId();
    const path = location.pathname;

    supabase
      .from("page_visits")
      .insert({
        path,
        visitor_id: visitorId,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
      })
      .then(({ error }) => {
        // Unique constraint violation (same visitor, same page, same day) is expected — silently ignore
        if (error && error.code !== "23505") {
          console.warn("page_visits insert failed:", error.message);
        }
      });
  }, [location.pathname]);

  return null;
};

export default PageViewTracker;
