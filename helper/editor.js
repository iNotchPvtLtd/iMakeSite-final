import blockBasic from "grapesjs-blocks-basic";
import FormPlugin from "grapesjs-plugin-forms";

export const editorModes = {
  default: 'default',
  dashboard: 'dashboard'
};

const getEditorConfig = (mode = editorModes.default) => {
  const baseConfig = {
    container: mode === editorModes.dashboard ? "#dashboard-editor" : "#gjs2",
    height: mode === editorModes.dashboard ? "500px" : "100%",
    width: 'auto',
    fromElement: true,
    components: '<div class="editor-content"></div>',
    style: '.editor-content { min-height: 100px; }',
    plugins: [blockBasic, FormPlugin],
    layerManager: {
      appendTo: "#layers-container",
    },
    blockManager: {
      appendTo: "#blocks",
    },
    styleManager: {
      appendTo: "#style-manager-container",
      sectors: [
        {
          name: "General",
          open: false,
          buildProps: [
            "float",
            "display",
            "position",
            "top",
            "right",
            "left",
            "bottom",
          ],
        },
        {
          name: "Dimension",
          open: false,
          buildProps: [
            "width",
            "height",
            "max-width",
            "min-height",
            "margin",
            "padding",
          ],
        },
        {
          name: "Typography",
          open: false,
          buildProps: [
            "font-family",
            "font-size",
            "font-weight",
            "letter-spacing",
            "color",
            "line-height",
            "text-align",
            "text-shadow",
          ],
        },
        {
          name: "Decorations",
          open: false,
          buildProps: [
            "border-radius-c",
            "background-color",
            "border-radius",
            "border",
            "box-shadow",
            "background",
          ],
        },
        {
          name: "Extra",
          open: false,
          buildProps: ["opacity", "transition", "perspective", "transform"],
          properties: [
            {
              type: "slider",
              property: "opacity",
              defaults: 1,
              step: 0.01,
              max: 1,
              min: 0,
            },
          ],
        },
      ],
    },
    selectorManager: {
      appendTo: "#selectors-container",
    },
    traitManager: {
      appendTo: "#traits-container",
    },
    panels: {
      defaults: [
        {
          id: "layers",
          el: "#layers",
          resizable: {
            tc: 0,
            cr: 1,
            bc: 0,
            keyWidth: "flex-basis",
          },
        },
        {
          id: "styles",
          el: "#style-manager",
          resizable: {
            tc: 0,
            cr: 0,
            cl: 1,
            bc: 0,
            keyWidth: "flex-basis",
          },
        },
      ],
    },
    canvas: {
      styles: [
        'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
      ],
      scripts: [
        'https://code.jquery.com/jquery-3.5.1.min.js',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js',
      ],
    },
    storageManager: {
      type: 'local',
      autosave: true,
      stepsBeforeSave: 1,
    },
  };

  const dashboardSpecificConfig = {
    showToolbar: true,
    deviceManager: {
      devices: [
        {
          name: 'Desktop',
          width: '1024px'
        },
        {
          name: 'Mobile',
          width: '320px',
          widthMedia: '480px'
        }
      ]
    },
    panels: {
      defaults: [
        ...(baseConfig.panels?.defaults || []),
        {
          id: 'dashboard-tools',
          el: '#dashboard-tools',
          buttons: [
            {
              id: 'save-template',
              className: 'btn-save-template',
              label: 'Save Template',
              command: 'save-template',
              attributes: { title: 'Save Template' }
            }
          ]
        }
      ]
    }
  };

  return mode === editorModes.dashboard 
    ? { ...baseConfig, ...dashboardSpecificConfig }
    : baseConfig;
};

export default getEditorConfig;