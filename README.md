# About
[![Netlify Status](https://api.netlify.com/api/v1/badges/9ab3e478-3865-417a-aedf-2fd5669cc973/deploy-status)](https://app.netlify.com/sites/futres-data-interface/deploys)

A lightweight interface for visualizing vertebrate traits, drawing on data that has been indexed using the 
[fovt-data-pipeline](https://github.com/futres/futres-data-interface).  This interface is written
in angularJS v1.7 and bootstrap v3.x and calls ElasticSearch at https://www.plantphenology.org/api/v1/query/ using the futres index.

The master branch of this repository is hosted on netlify and currently running at: https://futres-data-interface.netlify.app/

# first time installation steps
```
npm install 
```

# to run on a local server
```
npm start 
```

# deployment 
The following uses `public/` as the output directory:
```
gulp clean
gulp   
```

# Serving on the Web

1. Just point Apache or Nginx to the `public/` directory after running gulp
2. Netlify: deploy build command, use `gulp` and point to directory `public`

