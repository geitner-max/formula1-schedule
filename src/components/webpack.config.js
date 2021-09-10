module.exports = {
    entry: './main.js',
    mode: 'production',
    module: {
        
        test: /\.json$/i,
        use: ['json-loader'],
    
        
    },
};
  
