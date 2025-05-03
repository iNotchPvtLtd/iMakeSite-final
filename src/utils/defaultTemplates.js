export const defaultTemplates = [
    {
      templateId: "thums-up",
      name: "Thums Up",
      description: "A dynamic Vue.js landing page for Thums Up.",
      previewImage: "/templates/thums-up.png",
      htmlPath: "/templates/thums-up/index.html",
      category: "Beverage",
      configData: {
        colors: {
          primary: "#0066ff",
          secondary: "#ffffff",
          accent: "#22c55e"
        },
        fonts: {
          heading: "Roboto",
          body: "Open Sans"
        },
        layout: "default",
        sections: {
          hero: true,
          features: true,
          products: true,
          contact: true
        }
      }
    },
    {
      templateId: "pepsi",
      name: "Pepsi",
      description: "A vibrant promotional landing page for beverages.",
      previewImage: "/templates/pepsi.png",
      htmlPath: "/templates/pepsi/index.html",
      category: "Beverage",
      configData: {
        colors: {
          primary: "#004B93",
          secondary: "#ffffff",
          accent: "#EE1133"
        },
        fonts: {
          heading: "Roboto",
          body: "Open Sans"
        },
        layout: "promotional",
        sections: {
          hero: true,
          features: true,
          products: true,
          contact: true
        }
      }
    },
    {
      templateId: "sprite",
      name: "Sprite",
      description: "A clean and fast Vue.js marketing page.",
      previewImage: "/templates/sprite.png",
      htmlPath: "/templates/sprite/index.html",
      category: "Beverage",
      configData: {
        colors: {
          primary: "#008B47",
          secondary: "#ffffff",
          accent: "#FCD116"
        },
        fonts: {
          heading: "Roboto",
          body: "Open Sans"
        },
        layout: "marketing",
        sections: {
          hero: true,
          features: true,
          products: true,
          contact: true
        }
      }
    },
    {
      templateId: "nextly",
      name: "Nextly",
      description: "A sleek and modern template built with Next.js.",
      previewImage: "/templates/nextly.png",
      htmlPath: "/templates/nextly/index.html",
      category: "Business",
      configData: {
        colors: {
          primary: "#000000",
          secondary: "#ffffff",
          accent: "#0066ff"
        },
        fonts: {
          heading: "Roboto",
          body: "Open Sans"
        },
        layout: "business",
        sections: {
          hero: true,
          features: true,
          pricing: true,
          contact: true
        }
      }
    }
  ];