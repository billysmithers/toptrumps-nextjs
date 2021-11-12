const withImages = require('next-images')
module.exports = withImages({
    assetPrefix: 'https://cdn.rebrickable.com/media/sets/',
    dynamicAssetPrefix: true,
    webpack(config, options) {
        return config
    }
})
