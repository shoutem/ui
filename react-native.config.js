module.exports = {
    dependency: {
        platforms: {
        ios: {},
        android: {}, 
        },
        assets: [
            "fonts"
        ],
        hooks: {
            postlink: "node node_modules/react-native-code-push/scripts/postlink/run",
        }
    },
};  