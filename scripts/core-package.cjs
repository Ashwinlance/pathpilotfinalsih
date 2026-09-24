const fs=require('node:fs'); fs.mkdirSync('.core-build',{recursive:true}); fs.writeFileSync('.core-build/package.json', JSON.stringify({type:'commonjs'}));
