// Status Page Configuration
const config = {
    // Site identity
    site: {
      // Logo type: "text" or "image"
      logoType: "image",
      // Text to show if logoType is "text"
      logoText: "demo",
      // Path to logo image if logoType is "image"
      logoImage: "https://cdn.layeredy.com/uptimematrix/wordmark.png",
      // Link for the logo/text when clicked
      logoLink: "https://layeredy.com/uptime",
      // Favicon path
      favicon: "https://cdn.layeredy.com/logo.png",
      // Site name (shown in browser tab)
      siteName: "UptimeMatrix Demo"
    },
    
    // Theme colors
    theme: {
      // Main colors
      bgColor: "#0f1117",
      cardBg: "#1a1d25",
      cardHover: "#212530",
      textColor: "#f1f3f5",
      textSecondary: "#a0a4ad",
      textTertiary: "#6c717d",
      borderColor: "#2a2e3a",
      
      // Status colors
      operationalColor: "#00cc88",
      warningColor: "#ffb92a",
      downColor: "#ff4757",
      primaryColor: "#6c5ce7",
      blueColor: "#3b82f6",
      
      // Customizable gradient
      primaryGradient: "linear-gradient(45deg, #6c5ce7, #a29bfe)",
      
      // UI settings
      borderRadius: "12px",
      cardRadius: "8px",
      shadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
    
    // Data source
    data: {
      // Path to the data file
      source: "data/data.json", // This should be the relative path or the URL (like https://placeholder.layeredy.com/data)
      // Refresh interval in seconds
      refreshInterval: 60,
    },
    
    // Footer links and text
    footer: {
      // Company name for copyright
      companyName: "Placeholder",
      // Year for copyright
      copyrightYear: "2077",
      // Terms of Service link
      termsLink: "https://placeholder.layeredy.com",
      // Privacy Policy link
      privacyLink: "https://placeholder.layeredy.com"
    }
  };