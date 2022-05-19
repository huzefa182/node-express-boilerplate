'use strict';
import ejs from "ejs";
import path from "path";
import fs from 'fs';

export default {
    /**
     * Generate email templates
     * @param {object} model 
     * @param {object} rules 
     * @param {array} errors 
     */
    convertHtmlToString(data, folder, template) {  
      const ejsfilePath = path.join(__dirname, `../views/${folder}/${template}`);
      return new Promise((resolve, reject) => {
        ejs.renderFile(ejsfilePath, { data }, function(err, result) {
          if(err) {
            reject(err);
          }
          resolve(result); 
        });    
      });       
    },
}
