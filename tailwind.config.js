// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        "collapsible-down": {
          from: { height: "0" },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "collapsible-down":
          "collapsible-down 300ms cubic-bezier(0.87, 0, 0.13, 1)",
        "collapsible-up": "collapsible-up 300ms cubic-bezier(0.87, 0, 0.13, 1)",
      },
    },
  },
};
