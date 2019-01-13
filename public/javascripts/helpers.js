const hbs = require('handlebars')

const register = function(Handlebars) {
    const helpers = {
      // put all of your helpers inside this object
      color: (c, bkgd, opc) => {
        return (bkgd ? 'background-' : '') + `color: rgb(${c.r},${c.g},${c.b},${opc});`;
      },
      border: (c, opc, size, side) => {
        return `border-${side}: ${size}px solid rgb(${c.r},${c.g},${c.b},${opc});`;
      }
    };
  
    if (Handlebars && typeof Handlebars.registerHelper === "function") {
      // register helpers
      for (var prop in helpers) {
          Handlebars.registerHelper(prop, helpers[prop]);
      }
    } else {
        // just return helpers object if we can't register helpers here
        return helpers;
    }
  
  };
  
  module.exports.register = register;
  module.exports.helpers = register(hbs);  